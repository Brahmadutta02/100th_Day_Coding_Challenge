import { name } from '../symbols'
import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { TpaPageConfig } from '../types'
import { PageFeatureConfigSymbol, TpaHandlerProvider } from '@wix/thunderbolt-symbols'

export type GetExternalIdResponse = Promise<string | undefined>

export const GetExternalIdHandler = withDependencies(
	[named(PageFeatureConfigSymbol, name)],
	({ widgets }: TpaPageConfig): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				getExternalId(compId, msgData, { originCompId }): GetExternalIdResponse {
					return Promise.resolve(widgets[originCompId].externalId)
				},
			}
		},
	})
)
