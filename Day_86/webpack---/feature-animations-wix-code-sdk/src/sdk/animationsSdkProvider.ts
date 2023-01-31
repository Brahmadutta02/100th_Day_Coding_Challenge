import { optional, withDependencies } from '@wix/thunderbolt-ioc'
import {
	ComponentsStylesOverridesSymbol,
	CompsLifeCycleSym,
	IComponentsStylesOverrides,
	ICompsLifeCycle,
	ILogger,
	IPageDidMountHandler,
	IPageDidUnmountHandler,
	LoggerSymbol,
	SdkHandlersProvider,
} from '@wix/thunderbolt-symbols'
import { AnimationsWixCodeSdkHandlers, TimelineEvent, TimelineEventHandler } from '../types'
import { Animations, IAnimations } from 'feature-animations'
import { createPromise, createStyleUtils } from '@wix/thunderbolt-commons'
import type { SequenceInstance } from '@wix/animations-kit'

const TIMELINE_ANIMATION = 'TimelineAnimation'

const getElementsAlreadyInDOM = (compIds: Array<string>) => {
	const elementsAlreadyInDOM = compIds
		.map((id) => document.getElementById(id))
		.filter((element) => element) as Array<HTMLElement>
	if (elementsAlreadyInDOM.length === compIds.length) {
		return Promise.resolve(elementsAlreadyInDOM)
	}
	return false
}

const getElements = async (
	compIds: Array<string>,
	compsLifeCycle: ICompsLifeCycle,
	logger: ILogger
): Promise<Array<HTMLElement>> => {
	const elementsAlreadyInDOM = getElementsAlreadyInDOM(compIds)
	if (elementsAlreadyInDOM) {
		return elementsAlreadyInDOM
	}

	const waitForElementsPromise = Promise.all(compIds.map((compId) => compsLifeCycle.waitForComponentToRender(compId)))
	const { promise, resolver } = createPromise<Array<HTMLElement>>()
	const timeoutId = setTimeout(() => {
		logger.captureError(new Error('can not get element(s) from DOM'), {
			tags: { feature: 'feature-animations-wix-code-sdk' },
			extra: { compIds },
		})
		resolver([])
	}, 2000)
	const elements = await Promise.race([waitForElementsPromise, promise])
	clearTimeout(timeoutId)

	return elements
}

export const animationsWixCodeSdkParamsProvider = withDependencies(
	[ComponentsStylesOverridesSymbol, optional(Animations), CompsLifeCycleSym, LoggerSymbol],
	(
		componentsStylesOverrides: IComponentsStylesOverrides,
		animationsManager: IAnimations,
		compsLifeCycle: ICompsLifeCycle,
		logger: ILogger
	): SdkHandlersProvider<AnimationsWixCodeSdkHandlers> & IPageDidMountHandler & IPageDidUnmountHandler => {
		let resolvePageMounting: any
		const pageDidMountPromise = new Promise((resolve) => {
			resolvePageMounting = resolve
		})
		const timelines: Record<string, SequenceInstance> = {}
		const renderCompsPromises: Record<string, Array<Promise<any>>> = {}
		const timelineEvents: Record<string, Partial<Record<TimelineEvent, TimelineEventHandler>>> = {}
		const resolveAnimations = () => Promise.all([animationsManager.getInstance(), pageDidMountPromise])
		const resolveRenderComps = (timelineId: string) => Promise.all(renderCompsPromises[timelineId])
		return {
			getSdkHandlers: () => ({
				createTimeline: async (timelineId, TimelineParams) => {
					const [animator] = await resolveAnimations()
					renderCompsPromises[timelineId] = []
					timelines[timelineId] = animator.createSequence({
						...TimelineParams,
						data: { id: timelineId },
					})
				},
				addToTimeline: async (timelineId, compIds, params, offset) => {
					const [animator] = await resolveAnimations()
					const timeline = timelines[timelineId]
					if (timeline) {
						const getElementPromise = getElements(compIds, compsLifeCycle, logger)
						renderCompsPromises[timelineId].push(getElementPromise)
						const elements = await getElementPromise
						if (elements.length) {
							const animateSingle = ({ duration = 0, delay = 0, ...animationParams }) =>
								animator.createAnimationFromParams(
									TIMELINE_ANIMATION,
									elements,
									duration,
									delay,
									animationParams
								)
							timeline.add(params.map(animateSingle), offset)
						}
					}
				},
				playTimeline: async (timelineId) => {
					await resolveAnimations()
					await resolveRenderComps(timelineId)
					const timeline = timelines[timelineId]
					if (timeline) {
						timeline.play()
					}
				},
				pauseTimeline: async (timelineId) => {
					await resolveAnimations()
					await resolveRenderComps(timelineId)
					const timeline = timelines[timelineId]
					if (timeline) {
						timeline.pause()
					}
				},
				seekTimeline: async (timelineId, position) => {
					await resolveAnimations()
					await resolveRenderComps(timelineId)
					const timeline = timelines[timelineId]
					if (timeline) {
						timeline.seek(position)
					}
				},
				reverseTimeline: async (timelineId) => {
					await resolveAnimations()
					await resolveRenderComps(timelineId)
					const timeline = timelines[timelineId]
					if (timeline) {
						timeline.reverse()
					}
				},
				onStartTimeline: async (timelineId) => {
					await resolveAnimations()
					const timeline = timelines[timelineId]
					if (timeline) {
						timeline.event('onStart', () => {
							timelineEvents[timelineId].onStart!()
						})
					}
				},
				onCompleteTimeline: async (timelineId) => {
					await resolveAnimations()
					const timeline = timelines[timelineId]
					if (timeline) {
						timeline.event('onComplete', () => {
							timelineEvents[timelineId].onComplete!()
						})
					}
				},
				onRepeatTimeline: async (timelineId) => {
					await resolveAnimations()
					const timeline = timelines[timelineId]
					if (timeline) {
						timeline.event('onRepeat', () => {
							timelineEvents[timelineId].onRepeat!()
						})
					}
				},
				onReverseCompleteTimeline: async (timelineId) => {
					await resolveAnimations()
					const timeline = timelines[timelineId]
					if (timeline) {
						timeline.event('onReverseComplete', () => {
							timelineEvents[timelineId].onReverseComplete!()
						})
					}
				},
				registerTimelineEvent: (cb, timelineId: string, timelineEvent: TimelineEvent) => {
					if (!timelineEvents[timelineId]) {
						timelineEvents[timelineId] = {}
					}
					timelineEvents[timelineId][timelineEvent] = cb
				},
				showHiddenComponents: (comps: Array<string>) => {
					const styleUtils = createStyleUtils({ isResponsive: false })
					const styleOverrides = comps.reduce(
						(res, compId) => ({
							...res,
							[compId]: styleUtils.getShownStyles(),
						}),
						{}
					)
					componentsStylesOverrides.update(styleOverrides)
				},
			}),
			pageDidMount: () => {
				resolvePageMounting()
			},
			pageDidUnmount: () => {
				animationsManager.getInstance().then((animator) => {
					Object.keys(timelines).forEach((timelineId) => {
						animator.kill(timelines[timelineId].timeline)
						delete timelines[timelineId]
					})
				})
			},
		}
	}
)
