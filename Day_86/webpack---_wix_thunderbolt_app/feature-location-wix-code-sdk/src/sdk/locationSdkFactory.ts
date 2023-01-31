import _ from 'lodash'
import { WixCodeApiFactoryArgs } from '@wix/thunderbolt-symbols'
import { logSdkError } from '@wix/thunderbolt-commons'
import { ExternalLinkData } from '@wix/thunderbolt-becky-types'
import { namespace, LocationWixCodeSdkHandlers, LocationWixCodeSdkWixCodeApi, LocationWixCodeSdkSiteConfig } from '..'

export function LocationSdkFactory({
	featureConfig,
	handlers,
	platformUtils,
}: WixCodeApiFactoryArgs<LocationWixCodeSdkSiteConfig, never, LocationWixCodeSdkHandlers>): {
	[namespace]: LocationWixCodeSdkWixCodeApi
} {
	const { urlMappings } = featureConfig
	const { navigateTo, navigateToSection, addQueryParams, removeQueryParams } = handlers
	const { linkUtils, locationManager } = platformUtils
	const baseUrl = locationManager.getBaseUrl()
	const to = (href: string, options: { disableScrollToTop?: boolean; excludeFromHistory?: boolean } = {}) => {
		const linkProps = linkUtils.getLinkProps(href)
		if (linkUtils.isAbsoluteUrl(href)) {
			linkProps.target = '_self'
		}

		const navigationParams = {
			disableScrollToTop: options.disableScrollToTop,
			skipHistory: options.excludeFromHistory,
		}
		navigateTo(linkProps, navigationParams)
	}

	const prefix = locationManager.getPrefix()

	return {
		[namespace]: {
			get url() {
				return locationManager.getLocation().href
			},
			baseUrl,
			get path() {
				return locationManager.getPath()
			},
			prefix,
			protocol: locationManager.getLocation().protocol.slice(0, -1),
			get query() {
				return locationManager.getSearchParams()
			},
			queryParams: {
				add: (queryParams) => {
					_.forEach(queryParams, (value, key) => {
						locationManager.setSearchParam(key, value)
					})

					addQueryParams(queryParams)
				},
				remove: (queryParams) => {
					_.forEach(queryParams, (value) => {
						locationManager.deleteSearchParam(value)
					})

					removeQueryParams(queryParams)
				},
			},
			onChange: locationManager.onChange,
			getExternalUrl: (linkData) => {
				switch (linkData?.type) {
					case 'ExternalLink':
						return linkData.url
					case 'DocumentLink':
						const url = linkUtils.getLinkUrlFromDataItem(linkData)
						const linkProps = linkUtils.getLinkProps(url)
						return linkProps.href!
					default:
						return null
				}
			},
			navigateTo: (linkData) => {
				const linkType = linkData.type
				if (linkType === 'ExternalLink') {
					logSdkError(
						`The "navigateTo" method has not been executed for linkData with url: ${
							(linkData as ExternalLinkData).url
						}. You can get the external url value by using the "getExternalUrl" method`
					)
					return
				}

				// default link type
				linkData.type = linkData.type || 'PageLink'

				const href = linkUtils.getLinkUrlFromDataItem(linkData)
				return to(href)
			},
			to,
			buildCustomizedUrl: async (key, itemData, options) => {
				const { buildCustomizedUrl } = await import(
					'@wix/url-mapper-utils' /* webpackChunkName: "url-mapper-utils" */
				)
				return buildCustomizedUrl(urlMappings, key, itemData, { baseUrl, ...options })
			},
			navigateToSection,
		},
	}
}
