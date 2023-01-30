import { name } from '../symbols'
import { withDependencies, named } from '@wix/thunderbolt-ioc'
import { TpaPageConfig } from '../types'
import { SeoSiteSymbol, ISeoSiteApi, SeoTPAPayload } from 'feature-seo'
import { PageFeatureConfigSymbol, LoggerSymbol, ILogger, TpaHandlerProvider } from '@wix/thunderbolt-symbols'
import { withViewModeRestriction } from '@wix/thunderbolt-commons'

export type TpaHandlerError = {
	error: {
		message: string
	}
}

export const SetPageMetadataHandler = withDependencies(
	[named(PageFeatureConfigSymbol, name), SeoSiteSymbol, LoggerSymbol],
	({ widgets }: TpaPageConfig, seoApi: ISeoSiteApi, logger: ILogger): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				setPageMetadata: withViewModeRestriction(
					['site'],
					async (compId, msgData: SeoTPAPayload, { originCompId }): Promise<TpaHandlerError | null> => {
						if (widgets[originCompId] && widgets[originCompId].isSection) {
							await seoApi.setTPAOverrides(msgData)
							await seoApi.renderSEO()
						} else {
							const message =
								'Setting a page meta data is possible only to TPA Sections and MultiSections'
							logger.captureError(new Error(message), { tags: { feature: 'tpa' } })
							return { error: { message } }
						}
						return null
					}
				),
			}
		},
	})
)
