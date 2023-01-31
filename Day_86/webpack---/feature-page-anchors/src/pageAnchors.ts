import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	PageFeatureConfigSymbol,
	MasterPageFeatureConfigSymbol,
	BrowserWindowSymbol,
	Props,
	BrowserWindow,
	IPropsStore,
	IPageDidMountHandler,
	IPageWillUnmountHandler,
	pageIdSym,
} from '@wix/thunderbolt-symbols'
import type { PageAnchorsPageConfig, PageAnchorsMasterPageConfig } from './types'
import { name } from './symbols'
import { createAnchorObserver } from './pageAnchorsUtils'

/**
 * This is your feature.
 * You can get your configuration written in site-assets and viewer-model injected into your feature
 */
const pageAnchorsFactory = (
	pageFeatureConfig: PageAnchorsPageConfig,
	masterPageConfig: PageAnchorsMasterPageConfig,
	window: BrowserWindow,
	propsStore: IPropsStore,
	pageId: string
): IPageDidMountHandler & IPageWillUnmountHandler => {
	const pageAnchorsObservers = pageFeatureConfig.pageAnchorsObservers.concat(masterPageConfig.pageAnchorsObservers)
	const activeAnchorObservers = pageFeatureConfig.activeAnchorObservers.concat(masterPageConfig.activeAnchorObservers)
	const anchors = pageFeatureConfig.anchors.concat(masterPageConfig.anchors)

	const observeAnchors = createAnchorObserver(
		pageAnchorsObservers,
		activeAnchorObservers,
		anchors,
		window,
		propsStore,
		pageId,
		masterPageConfig.siteOffset
	)
	let observersCleanup: () => void | undefined

	return {
		pageDidMount(): void {
			if (pageAnchorsObservers.length || activeAnchorObservers.length) {
				observersCleanup = observeAnchors()
			}
		},
		pageWillUnmount(): void {
			if (observersCleanup) {
				observersCleanup()
			}
		},
	}
}

export const PageAnchors = withDependencies(
	[
		named(PageFeatureConfigSymbol, name),
		named(MasterPageFeatureConfigSymbol, name),
		BrowserWindowSymbol,
		Props,
		pageIdSym,
	],
	pageAnchorsFactory
)
