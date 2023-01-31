import { withDependencies } from '@wix/thunderbolt-ioc'
import {
	AppDidMountPromiseSymbol,
	BrowserWindow,
	BrowserWindowSymbol,
	ComponentsStylesOverridesSymbol,
	IComponentsStylesOverrides,
	SdkHandlersProvider,
} from '@wix/thunderbolt-symbols'
import { AnimationData, IAnimations, WixCodeAnimationsHandlers } from '../types'
import { Animations, name } from '../symbols'

const CLEAR_PROPS = 'clip,clipPath,webkitClipPath,opacity,transform,visibility'

const addIsAnimatingClass = (window: BrowserWindow, targets: Array<string>) => {
	targets.forEach((compId: string) => {
		const el = window!.document.getElementById(compId)
		if (el) {
			el.classList.add('is-animating')
		}
	})
}

const removeIsAnimatingClass = (window: BrowserWindow, targets: Array<string>) => {
	window!.requestAnimationFrame(() => {
		targets.forEach((compId) => {
			const el = window!.document.getElementById(compId)
			if (el) {
				el.classList.remove('is-animating')
			}
		})
	})
}
export const wixCodeHandlersProvider = withDependencies(
	[Animations, ComponentsStylesOverridesSymbol, BrowserWindowSymbol, AppDidMountPromiseSymbol],
	(
		animations: IAnimations,
		componentsStylesOverrides: IComponentsStylesOverrides,
		window: BrowserWindow,
		appDidMountPromise: Promise<unknown>
	): SdkHandlersProvider<WixCodeAnimationsHandlers> => ({
		getSdkHandlers: () => ({
			[name]: {
				runAnimation: async (animationData: AnimationData, animationDirection: 'in' | 'out'): Promise<void> => {
					const targets = Array.isArray(animationData.targetId)
						? animationData.targetId
						: [animationData.targetId]
					let resolvePromise: () => void
					const animationCompletePromise = new Promise<void>((resolve) => {
						resolvePromise = resolve
					})
					const animatorManager = await animations.getInstance()

					const baseClearData = {
						name: 'BaseClear',
						targetId: animationData.targetId,
						duration: 0,
						delay: 0,
						params: {
							props: CLEAR_PROPS,
							immediateRender: false,
						},
					}
					addIsAnimatingClass(window, targets)
					animationData.params = {
						...animationData.params,
						callbacks: {
							onStart() {
								if (animationDirection === 'in') {
									componentsStylesOverrides.update(
										targets.reduce(
											(styles, compId) => ({ ...styles, [compId]: { visibility: null } }),
											{}
										)
									)
								}
							},
							onComplete() {
								if (animationDirection === 'out') {
									// update visibility state using style overrides before baseClearData animation removes inline visibility style to avoid flickering
									componentsStylesOverrides.update(
										targets.reduce(
											(styles, compId) => ({
												...styles,
												[compId]: { visibility: 'hidden !important' },
											}),
											{}
										)
									)
								}
								removeIsAnimatingClass(window, targets)
							},
						},
					}

					// users are instructed not to await promises that require dom on $w.onReady()
					// https://support.wix.com/en/article/corvid-cant-preview-or-view-page-if-using-await-or-return-with-certain-functions-in-onready
					// so no deadlock can happen here between $w.onReady() and viewer waiting for all appWillLoadPage()s
					await appDidMountPromise

					// onStart function won't be called if the duration is 0 (https://greensock.com/docs/v3/GSAP/Timeline)
					animationData = { ...animationData, duration: animationData.duration || 0.00001 }

					animatorManager.runSequence(
						[
							{ type: 'Animation', data: animationData },
							{ type: 'Animation', data: baseClearData },
						],
						{
							callbacks: {
								onComplete: () => resolvePromise(),
								// TODO maybe onInterrupt and onReverseComplete not needed for platform handler?
								onInterrupt: () => resolvePromise(),
							},
						}
					)
					return animationCompletePromise
				},
			},
		}),
	})
)
