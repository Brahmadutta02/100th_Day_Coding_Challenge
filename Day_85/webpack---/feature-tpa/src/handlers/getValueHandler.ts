import { withDependencies, named } from '@wix/thunderbolt-ioc'
import { TpaPageConfig } from '../types'
import { PageFeatureConfigSymbol, TpaHandlerProvider } from '@wix/thunderbolt-symbols'
import { name } from '../symbols'

export type MessageData = {
	key: string
	scope: 'APP' | 'COMPONENT'
}

export const GetValueHandler = withDependencies(
	[named(PageFeatureConfigSymbol, name)],
	(tpaPageConfig: TpaPageConfig): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				getValue(compId, { key, scope }: MessageData, { originCompId }) {
					const { widgets, appPublicData } = tpaPageConfig
					const applicationId = widgets[originCompId].applicationId
					const parsedData =
						scope === 'APP' ? appPublicData[applicationId] : widgets[originCompId].componentPublicData
					if (!(parsedData && parsedData[key])) {
						return { error: { message: `key ${key} not found in ${scope} scope` } }
					}
					return { [key]: parsedData[key] }
				},
			}
		},
	})
)
