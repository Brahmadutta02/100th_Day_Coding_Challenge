import { withDependencies, optional, named } from '@wix/thunderbolt-ioc'
import { TpaHandlerProvider, SiteFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import { CustomUrlMapperSymbol, ICustomUrlMapper, UrlMappingsKeys } from 'feature-custom-url-mapper'
import { BuildCustomizedUrlOptions } from '@wix/url-mapper-utils'
import { name as tpaCommonsName, TpaCommonsSiteConfig } from 'feature-tpa-commons'

export type buildCustomizedUrlMessageData = {
	key: UrlMappingsKeys
	itemData: Record<string, string>
	options?: BuildCustomizedUrlOptions
}

export type HandlerResponse = Promise<{ url: string }>

export const BuildCustomizedUrlHandler = withDependencies(
	[named(SiteFeatureConfigSymbol, tpaCommonsName), optional(CustomUrlMapperSymbol)],
	({ externalBaseUrl: baseUrl }: TpaCommonsSiteConfig, customUrlMapper?: ICustomUrlMapper): TpaHandlerProvider => {
		return {
			getTpaHandlers() {
				return {
					async buildCustomizedUrl(compId, msgData: buildCustomizedUrlMessageData) {
						const { key, itemData, options } = msgData

						const urlMappings = customUrlMapper?.urlMappings

						const { buildCustomizedUrl } = await import(
							'@wix/url-mapper-utils' /* webpackChunkName: "url-mapper-utils" */
						)
						return buildCustomizedUrl(urlMappings, key, itemData, { baseUrl, ...options })
					},
				}
			},
		}
	}
)
