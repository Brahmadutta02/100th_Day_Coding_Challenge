import _ from 'lodash'
import type { ISiteScrollBlocker } from 'feature-site-scroll-blocker'
import type { IPageScrollRegistrar } from 'feature-page-scroll'
import type { IWindowScrollAPI } from 'feature-window-scroll'
import type { FormFactor, OOIWidgetConfig, ViewMode } from './types'
import LazySentry from './lazySentry'

export const createHostProps = ({
	compData,
	pageId,
	accessibilityEnabled,
	formFactor,
	viewMode,
	siteScrollBlocker,
	windowScrollApi,
	registerToThrottledScroll,
	fonts,
}: {
	compData: OOIWidgetConfig
	pageId: string
	accessibilityEnabled: boolean
	formFactor: FormFactor
	viewMode: ViewMode
	siteScrollBlocker: ISiteScrollBlocker
	windowScrollApi: IWindowScrollAPI
	registerToThrottledScroll: IPageScrollRegistrar['registerToThrottledScroll']
	fonts: any
}) => ({
	styleId: compData.styleId,
	pageId,
	accessibilityEnabled,
	id: compData.compId,
	viewMode,
	formFactor,
	dimensions: compData.dimensions,
	isResponsive: compData.isResponsive,
	style: {
		styleParams: compData.style.style,
		siteColors: compData.style.siteColors,
		siteTextPresets: compData.style.siteTextPresets,
		fonts,
	},
	appLoadBI: {
		loaded: _.noop,
	},
	scrollTo: () => windowScrollApi.scrollToComponent(compData.compId),
	registerToScroll: registerToThrottledScroll,
	blockScroll: () => siteScrollBlocker.setSiteScrollingBlocked(true, compData.compId),
	unblockScroll: () => siteScrollBlocker.setSiteScrollingBlocked(false, compData.compId),
	updateLayout: _.noop,
	// TODO probably santa legacy. try removing this thing and see if things break.
	onSiteReady: (fn: any) => fn(),
	raven: null,
	Effect: null,
	LazySentry,
})
