import { named, withDependencies } from '@wix/thunderbolt-ioc'
import {
	CurrentRouteInfoSymbol,
	IPageWillMountHandler,
	PageFeatureConfigSymbol,
	SiteFeatureConfigSymbol,
} from '@wix/thunderbolt-symbols'
import _ from 'lodash'
import { name } from '../symbols'
import type { OOIPageConfig, OOIWidgetConfig } from '../types'
import { OOISiteConfig } from '../types'
import { OOIReporterSymbol, Reporter } from '../reporting'
import { ICurrentRouteInfo } from 'feature-router'

export default withDependencies(
	[
		named(SiteFeatureConfigSymbol, name),
		named(PageFeatureConfigSymbol, name),
		CurrentRouteInfoSymbol,
		OOIReporterSymbol,
	],
	(
		{ ooiComponentsData }: OOISiteConfig,
		{ ooiComponents, pagesToShowSosp }: OOIPageConfig,
		currentRouteInfo: ICurrentRouteInfo,
		reporter: Reporter
	): IPageWillMountHandler => {
		const pageId = currentRouteInfo.getCurrentRouteInfo()?.pageId

		const loadCss = async (url: string, sentryDsn: any) => {
			const existing = Array.from(document.getElementsByTagName('style')).find((style) => {
				return style.getAttribute('data-href') === url
			})

			if (existing) {
				return existing
			}

			const res = await fetch(url)
			if (res.status !== 200) {
				reporter.reportError(
					new Error(
						`Could not load CSS vars static css. CSS url: ${url}. Error: ${res.status} - ${res.statusText}`
					),
					sentryDsn,
					{
						tags: { phase: 'ooi component resolution' },
					}
				)
			}
			const text = await res.text()
			const style = document.createElement('style')
			style.innerHTML = text
			style.setAttribute('data-href', url)
			document.head.appendChild(style)
		}

		return {
			name: 'ooiLoadStaticCSSPageWillMountClient',
			async pageWillMount() {
				const shouldDisplayComponentInCurrentPage = (component: OOIWidgetConfig) => {
					if (!component.isInSosp) {
						return true
					}

					return pageId && pagesToShowSosp[pageId]
				}

				await Promise.all(
					_.chain(ooiComponents)
						.pickBy(shouldDisplayComponentInCurrentPage)
						.map('widgetId')
						.uniq()
						.filter((widgetId) => !!ooiComponentsData[widgetId]?.isTPACssVars)
						.map(async (widgetId) => {
							const { componentUrl, sentryDsn } = ooiComponentsData[widgetId]
							// we load css by convention - same name as js bundle
							const cssUrl = componentUrl.replace('.bundle.min.js', '.min.css')
							await loadCss(cssUrl, sentryDsn)
						})
						.value()
				)
			},
		}
	}
)
