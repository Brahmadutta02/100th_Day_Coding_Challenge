import { withDependencies, named } from '@wix/thunderbolt-ioc'
import { SiteFeatureConfigSymbol, TpaHandlerProvider } from '@wix/thunderbolt-symbols'
import { name as tpaCommonsName, TpaCommonsSiteConfig } from 'feature-tpa-commons'

export type GetViewModeResponse = {
	editMode: TpaCommonsSiteConfig['viewMode']
}

export const GetViewModeHandler = withDependencies(
	[named(SiteFeatureConfigSymbol, tpaCommonsName)],
	(tpaCommonsSiteConfig: TpaCommonsSiteConfig): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				getViewMode(): GetViewModeResponse {
					return {
						editMode: tpaCommonsSiteConfig.viewMode,
					}
				},
			}
		},
	})
)
