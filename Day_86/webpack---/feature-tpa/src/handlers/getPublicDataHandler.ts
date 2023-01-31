import { withDependencies, named } from '@wix/thunderbolt-ioc'
import { TpaPageConfig } from '../types'
import { PageFeatureConfigSymbol, PublicData, TpaHandlerProvider } from '@wix/thunderbolt-symbols'
import { name } from '../symbols'
import _ from 'lodash'

export const GetPublicDataHandler = withDependencies(
	[named(PageFeatureConfigSymbol, name)],
	(tpaPageConfig: TpaPageConfig): TpaHandlerProvider => ({
		getTpaHandlers() {
			function getAllPublicData(originCompId: string): PublicData {
				const { widgets, appPublicData } = tpaPageConfig
				const applicationId = widgets[originCompId].applicationId
				return {
					APP: appPublicData[applicationId],
					COMPONENT: widgets[originCompId].componentPublicData,
				}
			}
			return {
				getPublicData(compId, msgData, { originCompId }): PublicData {
					return getAllPublicData(originCompId)
				},
				getValues(compId, msgData, { originCompId }): any {
					const { scope, keys }: { scope: 'APP' | 'COMPONENT'; keys: Array<string> } = msgData
					const allPublicData = getAllPublicData(originCompId)
					return _.pickBy(allPublicData[scope], (value, key) => keys.includes(key))
				},
			}
		},
	})
)
