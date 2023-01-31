import fastdom from 'fastdom'
import { withDependencies, named, optional } from '@wix/thunderbolt-ioc'
import { isSafari, isEdge, isIE, isFirefox, getSafariMajorVersion, isIOS } from '@wix/thunderbolt-commons'
import { BrowserWindow, BrowserWindowSymbol, PageFeatureConfigSymbol, ResizeObserver } from '@wix/thunderbolt-symbols'
import type {
	BackgroundScrubPageConfig,
	IBackgroundScrub,
	ScrubMeasurements,
	SequenceInstancesFactory,
	SequenceInstancesStore,
} from './types'
import { name } from './symbols'
import { Animations, AnimatorManager, IAnimations } from 'feature-animations'

const getScrubClear = (targetId: Array<string>) => ({
	name: 'BaseClear',
	targetId,
	duration: 0,
	delay: 0,
	params: {
		props: 'willChange,opacity,transform',
		immediateRender: false,
	},
})

const effectToIsFullScreenMap: Record<string, boolean> = {
	BackgroundReveal: true,
	BackgroundParallax: true,
	BackgroundZoom: true,
	BgParallax: true,
	BgReveal: true,
	BgZoomIn: true,
	BgFake3D: true,
}

const isIosOrSimulator = (window: Window) => {
	return isIOS(window) || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)
}

const backgroundScrubFactory = (
	pageFeatureConfig: BackgroundScrubPageConfig,
	window: BrowserWindow,
	animationManager: IAnimations
): IBackgroundScrub => {
	const measurements: ScrubMeasurements = {
		scrollY: 0,
		viewPortHeight: 0,
		wixAdsHeight: 0,
		siteHeight: 0,
		components: {},
	}
	const sequenceFactories: SequenceInstancesFactory = {}
	const sequenceInstances: SequenceInstancesStore = {}
	const animateRevealScrubAction = isIE(window!) || isEdge(window!) || isFirefox(window!)
	const animateParallaxScrubAction = isEdge(window!)
	const preserve3DParallaxScrubAction = !(
		isFirefox(window!) ||
		(isSafari(window!) && getSafariMajorVersion(window!) >= 9)
	)

	const getMasterPage = (): HTMLElement | null => window!.document.getElementById('masterPage')

	const getSiteHeight = (): number => {
		const masterPage = getMasterPage()
		return masterPage ? masterPage.offsetHeight : 0 // probably tests that don't have masterPage created
	}

	const getWixAdsHeight = () => {
		const wixAds = window!.document.getElementById('WIX_ADS')
		return wixAds ? wixAds.offsetHeight : 0
	}

	const isSiteBackground = (compId: string = '') => compId.startsWith('pageBackground')

	const initScrubMeasurements = () => {
		const scrollY = window!.pageYOffset
		const siteHeight = getSiteHeight()
		const wixAdsHeight = getWixAdsHeight()
		const viewPortHeight = window!.document.documentElement.clientHeight - measurements.wixAdsHeight
		Object.assign(measurements, { scrollY, siteHeight, wixAdsHeight, viewPortHeight })

		Object.entries(pageFeatureConfig.scrubSequencesParams).forEach(([_, sequenceParams]) => {
			const { compId, animationName } = sequenceParams
			const component = window!.document.getElementById(compId)
			if (component) {
				const height = component.offsetHeight
				const absoluteTop = scrollY + component.getBoundingClientRect().top - wixAdsHeight
				const offset = isSiteBackground(compId) ? 0 : viewPortHeight - absoluteTop
				measurements.components[compId] = {
					height,
					top: absoluteTop,
					offset,
				}

				const bgLayers = window!.document.getElementById(`bgLayers_${compId}`) as HTMLElement
				if (bgLayers && isIosOrSimulator(window as Window) && !!effectToIsFullScreenMap[animationName]) {
					bgLayers.style.clipPath = 'none'
					// eslint-disable-next-line @typescript-eslint/no-unused-expressions
					bgLayers.offsetWidth // force a style recalculation
					bgLayers.style.clipPath = 'inset(0)'
				}
			}
		})
	}

	const createScrubSequenceInstances = (animationManagerInstance: AnimatorManager) => {
		Object.entries(pageFeatureConfig.scrubSequencesParams).forEach(([sequenceId, sequenceParams]) => {
			const {
				animationName,
				compId,
				targetElementSelector,
				extraAnimationSelectors,
				duration,
				speedFactor,
				delay,
			} = sequenceParams
			const { viewPortHeight, components, siteHeight } = measurements

			if (!components[compId]) {
				return
			}

			const { height: componentHeight, top: componentTop } = components[compId]
			const browserFlags = {
				animateRevealScrubAction,
				animateParallaxScrubAction,
				preserve3DParallaxScrubAction,
			}
			sequenceFactories[sequenceId] = () =>
				animationManagerInstance.runAnimation({
					name: animationName,
					targetId: targetElementSelector,
					duration,
					delay,
					animationSelectors: extraAnimationSelectors as Record<string, string>,
					params: {
						siteHeight,
						viewPortHeight,
						componentHeight,
						componentTop,
						browserFlags,
						suppressReactRendering: false,
						forgetSequenceOnComplete: false,
						speedFactor,
						paused: true,
					},
				})
		})
	}

	const scrubProgress = () => {
		const { scrollY, viewPortHeight, components } = measurements
		Object.entries(pageFeatureConfig.scrubSequencesParams).forEach(([sequenceId, sequenceParams]) => {
			if (!sequenceFactories[sequenceId]) {
				return
			}

			const { compId } = sequenceParams
			const { height, offset } = components[compId]
			if (!sequenceInstances[sequenceId]) {
				sequenceInstances[sequenceId] = {
					instance: sequenceFactories[sequenceId](),
					params: sequenceParams,
				}
			}
			const maxTravel = isSiteBackground(compId)
				? Math.max(getSiteHeight() - viewPortHeight, 0)
				: viewPortHeight + height
			const pos = Math.max(0, scrollY) + offset
			const progress = maxTravel ? pos / maxTravel : 0
			sequenceInstances[sequenceId].instance.progress(progress)
		})
	}

	const scrubTick = () => {
		fastdom.measure(() => {
			measurements.scrollY = window!.pageYOffset
			fastdom.mutate(scrubProgress)
		})
	}

	const initScrub = (animationsManagerInstance: AnimatorManager) => {
		fastdom.measure(() => {
			initScrubMeasurements()

			fastdom.mutate(() => {
				createScrubSequenceInstances(animationsManagerInstance)
			})
		})

		// Invoke scrubbers for the first time with scroll 0 to get correct base dom state
		scrubTick()
	}

	const destroyScrub = (animationsManagerInstance: AnimatorManager, shouldClear: boolean = false) => {
		Object.keys(sequenceInstances).forEach((sequenceId: string) => {
			if (shouldClear) {
				const { targetElementSelector, extraAnimationSelectors } = sequenceInstances[sequenceId].params
				const extra = Object.values(extraAnimationSelectors || {}) as Array<string>
				animationsManagerInstance.runAnimation(getScrubClear([targetElementSelector, ...extra]))
			}
			animationsManagerInstance.kill(sequenceInstances[sequenceId].instance)
			delete sequenceInstances[sequenceId]
			delete sequenceFactories[sequenceId]
		})
	}

	async function rebuildScrub() {
		const animationsManagerInstance = animationManager && (await animationManager.getInstance())
		if (!animationsManagerInstance) {
			return
		}
		destroyScrub(animationsManagerInstance)
		debounceInit(animationsManagerInstance)
	}

	let initScrubTimeout: number
	const RESIZE_TIMEOUT = 150
	/**
	 * Debounce initialization of scrubbers
	 */
	const debounceInit = (animationsManagerInstance: AnimatorManager) => {
		window!.clearTimeout(initScrubTimeout)
		initScrubTimeout = window!.setTimeout(() => {
			initScrub(animationsManagerInstance)
		}, RESIZE_TIMEOUT)
	}

	const siteHeightObserver =
		typeof window !== 'undefined' && window !== null
			? new window.ResizeObserver(rebuildScrub)
			: (({
					observe: () => {},
					unobserve: () => {},
			  } as unknown) as ResizeObserver)

	return {
		async init() {
			const animationsManagerInstance = animationManager && (await animationManager.getInstance())
			if (!animationsManagerInstance) {
				return
			}
			initScrub(animationsManagerInstance)
			window!.addEventListener('scroll', scrubTick)
			window!.addEventListener('resize', rebuildScrub, false)

			const masterPage = getMasterPage()
			if (masterPage) {
				siteHeightObserver.observe(masterPage)
			}
		},
		async destroy(shouldClear: boolean = false) {
			const animationsManagerInstance = animationManager && (await animationManager.getInstance())
			if (!animationsManagerInstance) {
				return
			}
			window!.removeEventListener('scroll', scrubTick)
			window!.removeEventListener('resize', rebuildScrub)
			window!.clearTimeout?.(initScrubTimeout)
			destroyScrub(animationsManagerInstance, shouldClear)
			const masterPage = getMasterPage()
			if (masterPage) {
				siteHeightObserver.unobserve(masterPage)
			}
		},
	}
}

export const BackgroundScrub = withDependencies(
	[named(PageFeatureConfigSymbol, name), BrowserWindowSymbol, optional(Animations)],
	backgroundScrubFactory
)
