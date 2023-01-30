import { withDependencies } from '@wix/thunderbolt-ioc'
import { IPageWillMountHandler, pageIdSym, PageScrollRegistrarSymbol } from '@wix/thunderbolt-symbols'
import { TpaEventsListenerManagerSymbol } from './symbols'
import { IPageScrollRegistrar, ScrollPosition } from 'feature-page-scroll'
import type { ITPAEventsListenerManager } from './types'
import fastdom from 'fastdom'

const getScrollEventDataForComp = (scrollPos: ScrollPosition, compId: string) => {
	const comp = window!.document.getElementById(compId)
	if (!comp) {
		// TODO- can remove once page handlers are reset upon navigation
		return {}
	}

	const compPositionInViewport = comp!.getBoundingClientRect()
	return {
		x: scrollPos.x + compPositionInViewport.left,
		y: scrollPos.y + compPositionInViewport.top,
		width: compPositionInViewport.width,
		height: compPositionInViewport.height,
		scrollTop: scrollPos.y,
		scrollLeft: scrollPos.x,
		documentHeight: document.documentElement.clientHeight,
		documentWidth: document.documentElement.clientWidth,
	}
}

export const SiteScrollDispatcher = withDependencies(
	[PageScrollRegistrarSymbol, TpaEventsListenerManagerSymbol, pageIdSym],
	(
		{ registerToThrottledScroll }: IPageScrollRegistrar,
		tpaEventsListenerManager: ITPAEventsListenerManager,
		pageId: string
	): IPageWillMountHandler => ({
		name: 'siteScrollDispatch',
		pageWillMount() {
			registerToThrottledScroll((scrollPos: ScrollPosition) => {
				fastdom.measure(() => {
					tpaEventsListenerManager.dispatch(
						'SCROLL',
						({ compId }) => getScrollEventDataForComp(scrollPos, compId),
						{ pageId }
					)
				})
			})
		},
	})
)
