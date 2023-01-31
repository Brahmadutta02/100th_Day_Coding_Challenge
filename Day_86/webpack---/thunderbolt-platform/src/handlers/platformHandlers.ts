import _ from 'lodash'
import { withDependencies } from '@wix/thunderbolt-ioc'
import { NavigationManagerSymbol } from 'feature-navigation-manager'
import type { INavigationManager } from 'feature-navigation-manager'
import type { CompRefAPI, ICompEventsRegistrar, SdkHandlersProvider, IPlatformPropsSyncManager } from '@wix/thunderbolt-symbols'
import { CompEventsRegistrarSym, CompRefAPISym, PlatformViewportAPISym, PlatformPropsSyncManagerSymbol, AppDidMountPromiseSymbol } from '@wix/thunderbolt-symbols'
import type { PlatformViewPortAPI } from './viewportHandlers'

export type PlatformSdkHandlers = {
	platform: {
		invokeCompRefFunction: (compId: string, functionName: string, args: any) => Promise<any>
		registerEvent(compId: string, eventName: string, eventHandler: Function): (...args: Array<any>) => void
	}
	// TODO before wrapping sanitizeSVG in "platform" namespace, update editor-elements
	// like https://github.com/wix-private/editor-elements/blob/bb71f32bfbf4c25a141513117719d8d4db4b64ca/packages/editor-elements-library/src/components/Breadcrumbs/corvid/Breadcrumbs.corvid.ts#L111
	sanitizeSVG: (rawSVG: string) => Promise<{ svg?: string | undefined; error?: string | undefined }>
}

export const platformHandlersProvider = withDependencies(
	[CompRefAPISym, CompEventsRegistrarSym, PlatformViewportAPISym, PlatformPropsSyncManagerSymbol, AppDidMountPromiseSymbol, NavigationManagerSymbol],
	(
		compRefAPI: CompRefAPI,
		compEventsRegistrar: ICompEventsRegistrar,
		viewPortAPI: PlatformViewPortAPI,
		platformPropsSyncManager: IPlatformPropsSyncManager,
		appDidMountPromise: Promise<void>,
		navigationManager: INavigationManager
	): SdkHandlersProvider<PlatformSdkHandlers> => {
		function serializeEvent(args: any = []) {
			const [event, ...rest] = args
			// if SynteticEvent
			if (event?.nativeEvent) {
				// we want to serialize the event before awaiting cause react has an optimization
				// that reuses synthetic events and invalidates them between tasks
				const serializedEvent = _.omitBy(event, _.isObject)
				// we need to keep the native event data because it is used in the event API
				serializedEvent.nativeEvent = _.omitBy(event.nativeEvent, _.isObject)
				return [serializedEvent, ...rest]
			}
			return args
		}

		return {
			getSdkHandlers() {
				return {
					platform: {
						invokeCompRefFunction: async (compId: string, functionName: string, args: any) => {
							if (navigationManager.isDuringNavigation()) {
								await navigationManager.waitForNavigationEnd()
							}
							const compRef: any = await compRefAPI.getCompRefById(compId)
							return compRef[functionName](...args)
						},
						registerEvent(compId: string, eventName: string, eventHandler: Function) {
							if (['onViewportLeave', 'onViewportEnter'].includes(eventName)) {
								viewPortAPI[eventName as 'onViewportLeave' | 'onViewportEnter'](compId, async (...args: any) => {
									await appDidMountPromise
									eventHandler(...args)
								})
								return _.noop // TODO implement unregister api for viewport events
							}
							const compAction = compEventsRegistrar.register(
								compId,
								eventName,
								async (...args: any) => {
									const serializedEvent = serializeEvent(args)
									// use case: comp sdk registers to onChange. controlled comp fires an onChange
									// we need to ensure that that props are synced in platform before invoking the onChange handler
									await platformPropsSyncManager.waitForPlatformPropsSyncToApply()
									eventHandler(serializedEvent)
								},
								{
									addCompId: true,
								}
							)
							return () => compEventsRegistrar.unregister(compId, eventName, compAction)
						},
					},
					sanitizeSVG: async (rawSVG: string) => {
						const { sanitizer } = await import('@wix/dom-sanitizer' /* webpackChunkName: "wixDomSanitizer" */)
						return sanitizer.sanitizeSVG(rawSVG)
					},
				}
			},
		}
	}
)
