import _ from 'lodash'
import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { MasterPageFeatureConfigSymbol, TpaHandlerProvider, SiteFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import { name as tpaCommonsName, TpaCommonsSiteConfig } from 'feature-tpa-commons'
import { name } from '../symbols'
import type { TpaMasterPageConfig } from '../types'

export type GetSectionUrlResponse = any

export type MessageData = {
	sectionIdentifier: string
}

export const GetSectionUrlHandler = withDependencies(
	[named(SiteFeatureConfigSymbol, tpaCommonsName), named(MasterPageFeatureConfigSymbol, name)],
	(
		{ externalBaseUrl, pageIdToPrefix }: TpaCommonsSiteConfig,
		{ pagesData }: TpaMasterPageConfig
	): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				getSectionUrl(
					compId,
					{ sectionIdentifier }: MessageData,
					{ appClientSpecMapData }
				): GetSectionUrlResponse {
					const page = _.find(pagesData, { tpaPageId: sectionIdentifier })
					if (page?.id) {
						const prefix = pageIdToPrefix[page.id]
						const relativeUrl = prefix ? `${prefix}/${page.pageUriSEO}` : page.pageUriSEO
						return { url: `${externalBaseUrl}/${relativeUrl}` }
					} else {
						return {
							error: {
								message: `Page with app "${appClientSpecMapData?.appDefinitionName}" was not found.`,
							},
						}
					}
				},
			}
		},
	})
)
