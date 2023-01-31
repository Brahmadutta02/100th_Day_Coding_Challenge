import { createPromise } from '@wix/thunderbolt-commons'
import { named, withDependencies } from '@wix/thunderbolt-ioc'
import {
	CurrentRouteInfoSymbol,
	IPageWillMountHandler,
	IPropsStore,
	PageFeatureConfigSymbol,
	Props,
	SiteFeatureConfigSymbol,
} from '@wix/thunderbolt-symbols'
import _ from 'lodash'
import { name, ReactLoaderForOOISymbol } from '../symbols'
import type { OOIPageConfig, OOIWidgetConfig } from '../types'
import { OOIComponentLoader, OOISiteConfig } from '../types'
import { OOIReporterSymbol, Reporter } from '../reporting'
import { ICurrentRouteInfo } from 'feature-router'

export const ooiLoadComponentsPageWillMountClient = withDependencies(
	[
		named(SiteFeatureConfigSymbol, name),
		ReactLoaderForOOISymbol,
		named(PageFeatureConfigSymbol, name),
		Props,
		OOIReporterSymbol,
		CurrentRouteInfoSymbol,
	],
	(
		{ ooiComponentsData }: OOISiteConfig,
		ooiComponentsLoader: OOIComponentLoader,
		{ ooiComponents, pagesToShowSosp }: OOIPageConfig,
		propsStore: IPropsStore,
		reporter: Reporter,
		currentRouteInfo: ICurrentRouteInfo
	): IPageWillMountHandler => {
		const pageId = currentRouteInfo.getCurrentRouteInfo()?.pageId

		const componentsLoadeddDeffered = createPromise<Array<string>>()
		return {
			name: 'ooiLoadComponentsPageWillMountClient',
			async pageWillMount() {
				const shouldDisplayComponentInCurrentPage = (component: OOIWidgetConfig) => {
					if (!component.isInSosp) {
						return true
					}

					return pageId && pagesToShowSosp[pageId]
				}

				const ooiComponentsForCurrnetPage = _.pickBy(ooiComponents, shouldDisplayComponentInCurrentPage)

				await Promise.all(
					_.map(ooiComponentsForCurrnetPage, async ({ widgetId }, compId) => {
						const { component, loadableReady, chunkLoadingGlobal } = await ooiComponentsLoader.getComponent(
							widgetId
						)

						const { sentryDsn, isLoadable } = ooiComponentsData[widgetId]

						if (!component) {
							reporter.reportError(new Error('component is not exported'), sentryDsn, {
								tags: { phase: 'ooi component resolution' },
							})
						}

						/**
						 * loadableReady should come from the OOI bundle to share the same registry with its internal loadable functions:
						 * slack: https://wix.slack.com/archives/C026GJZFTBJ/p1634912220010100
						 * chunkLoadingGlobal is the namespcaes of the OOI component to fix issues with multiple loadable apps on the same page
						 * issue: https://github.com/gregberge/loadable-components/pull/701
						 */
						if (isLoadable && loadableReady && chunkLoadingGlobal) {
							await new Promise((resolve) =>
								loadableReady(resolve, { chunkLoadingGlobal, namespace: compId })
							)
						}

						propsStore.update({
							[compId]: {
								ReactComponent: component,
							},
						})
					})
				)

				componentsLoadeddDeffered.resolver(_.map(ooiComponentsForCurrnetPage, ({ widgetId }) => widgetId))
			},
		}
	}
)
