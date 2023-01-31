import { withDependencies, optional, named } from '@wix/thunderbolt-ioc'
import { TpaHandlerProvider, SiteFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import { CustomUrlMapperSymbol, ICustomUrlMapper } from 'feature-custom-url-mapper'
import { name as tpaCommonsName, TpaCommonsSiteConfig } from 'feature-tpa-commons'

export type MessageData = { url: string; options?: Record<string, string> }
export type HandlerResponse = Promise<{ segments: Record<string, string> }>

export const GetCustomizedUrlSegmentsHandler = withDependencies(
	[named(SiteFeatureConfigSymbol, tpaCommonsName), optional(CustomUrlMapperSymbol)],
	(
		{ externalBaseUrl: baseUrl }: TpaCommonsSiteConfig,
		customUrlMapper?: ICustomUrlMapper | undefined
	): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				async getCustomizedUrlSegments(compId, msgData: MessageData) {
					const { url, options } = msgData
					const urlMappings = customUrlMapper?.urlMappings

					const { getCustomizedUrlSegments } = await import(
						'@wix/url-mapper-utils' /* webpackChunkName: "url-mapper-utils" */
					)

					return getCustomizedUrlSegments(urlMappings, url, { baseUrl, ...options })
				},
			}
		},
	})
)
