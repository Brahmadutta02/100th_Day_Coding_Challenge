import { withDependencies, named } from '@wix/thunderbolt-ioc'
import { SiteFeatureConfigSymbol, TpaHandlerProvider } from '@wix/thunderbolt-symbols'
import { name as tpaCommonsName, TpaCommonsSiteConfig } from 'feature-tpa-commons'

export type MessageData = {
	appDefinitionId: string
}

export const GetApplicationFieldsHandler = withDependencies(
	[named(SiteFeatureConfigSymbol, tpaCommonsName)],
	({ appsClientSpecMapData }: TpaCommonsSiteConfig): TpaHandlerProvider => ({
		getTpaHandlers(): any {
			return {
				getApplicationFields(compId: string, { appDefinitionId }: MessageData) {
					return appsClientSpecMapData[appDefinitionId].appFields
				},
			}
		},
	})
)
