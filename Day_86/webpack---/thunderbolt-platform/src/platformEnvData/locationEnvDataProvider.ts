import _ from 'lodash'
import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { EditorFeatureConfigSymbol, PlatformEditorConfig, PlatformEnvDataProvider, PlatformSiteConfig, SiteFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import { IRoutingLinkUtilsAPI, IUrlHistoryManager, RoutingLinkUtilsAPISymbol, UrlHistoryManagerSymbol } from 'feature-router'
import { name } from '../symbols'

export const locationEnvDataProvider = withDependencies(
	[named(SiteFeatureConfigSymbol, name), UrlHistoryManagerSymbol],
	(platformSiteConfig: PlatformSiteConfig, urlHistoryManager: IUrlHistoryManager): PlatformEnvDataProvider => {
		return {
			get platformEnvData() {
				return {
					location: {
						...platformSiteConfig.bootstrapData.location,
						rawUrl: urlHistoryManager.getParsedUrl().href,
					},
				}
			},
		}
	}
)

export const dsLocationEnvDataProvider = withDependencies(
	[named(SiteFeatureConfigSymbol, name), named(EditorFeatureConfigSymbol, name), UrlHistoryManagerSymbol, RoutingLinkUtilsAPISymbol],
	(platformSiteConfig: PlatformSiteConfig, platformEditorConfig: PlatformEditorConfig, urlHistoryManager: IUrlHistoryManager, routingLinkUtilsAPI: IRoutingLinkUtilsAPI): PlatformEnvDataProvider => {
		return {
			get platformEnvData() {
				// See also: https://github.com/wix-private/santa-editor/blob/99bc4399069db3f4275d34f19c71cbca4b55c8c0/editor-test-sled/sled/platform/wixCode/location.spec.js#L17
				// TODO maybe we can drop this crap and always have the editor url (externalBaseUrl) in the platform urls in editor.
				const baseUrl = platformEditorConfig.publicBaseUrl || 'http://yoursitename.wixsite.com/yoursitename'
				const relativeUrl = routingLinkUtilsAPI.getLinkUtilsRoutingInfo().relativeUrl.replace(/^\.\//, '')

				return {
					location: {
						...platformSiteConfig.bootstrapData.location,
						rawUrl: `${_.compact([baseUrl, relativeUrl]).join('/')}${urlHistoryManager.getParsedUrl().search}`,
					},
				}
			},
		}
	}
)
