import { IFeatureState } from 'thunderbolt-feature-state'
import type { IPageScrollRegistrar, IScrollRegistrarState, ScrollHandler, ScrollPosition } from './types'
import { named, optional, withDependencies } from '@wix/thunderbolt-ioc'
import {
	BrowserWindow,
	BrowserWindowSymbol,
	FeatureStateSymbol,
	IPageDidMountHandler,
	IPageDidUnmountHandler,
} from '@wix/thunderbolt-symbols'
import { name } from './symbols'
import _ from 'lodash'
import { ILightbox, LightboxSymbol } from 'feature-lightbox'

export const PageScroll = withDependencies(
	[named(FeatureStateSymbol, name), BrowserWindowSymbol, optional(LightboxSymbol)],
	(
		featureState: IFeatureState<IScrollRegistrarState>,
		window: BrowserWindow,
		popupsApi?: ILightbox
	): IPageScrollRegistrar & IPageDidMountHandler & IPageDidUnmountHandler => {
		const registeredScrollHandlers: Array<EventListener> = []
		const registeredThrottledScrollHandlers: Array<ScrollHandler> = []

		const invokeThrottledScrollHandlers = _.throttle((scrollPosition: ScrollPosition) => {
			registeredThrottledScrollHandlers.forEach((handler) => handler(scrollPosition))
		}, 100)

		const invokeThrottledScrollEvent = (e: Event) => {
			const target = e.currentTarget // element with event listener (popup root / window)
			const position = {
				x: (target as Window).pageXOffset ?? (target as HTMLElement).scrollLeft,
				y: (target as Window).pageYOffset ?? (target as HTMLElement).scrollTop,
			}
			invokeThrottledScrollHandlers(position)
		}

		const propagateScrollEvent = (e: Event) => {
			if (registeredThrottledScrollHandlers.length > 0) {
				invokeThrottledScrollEvent(e)
			}
			registeredScrollHandlers.forEach((listener) => listener(e))
		}

		return {
			registerToThrottledScroll(handler: ScrollHandler) {
				registeredThrottledScrollHandlers.push(handler)
			},
			registerToScroll(handler: EventListener) {
				registeredScrollHandlers.push(handler)
			},
			async pageDidUnmount() {
				window && window.removeEventListener('scroll', propagateScrollEvent)
			},
			async pageDidMount(pageId: string) {
				if (popupsApi && popupsApi.isLightbox(pageId)) {
					popupsApi.registerToLightboxEvent('popupScroll', propagateScrollEvent)
				} else {
					window && window.addEventListener('scroll', propagateScrollEvent)
				}
			},
		}
	}
)
