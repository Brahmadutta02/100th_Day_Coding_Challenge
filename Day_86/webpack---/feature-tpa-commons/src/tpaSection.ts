import { withDependencies } from '@wix/thunderbolt-ioc'
import type { ITpaSection, TpaSectionRegistry } from './types'

/**
 * What is this?
 * An application might be broken down into multiple components. these components are
 * allowed to call handlers which will affect the application's current TpaSection component.
 * Since those components may not live within the same container as the TpaSection
 * this construct exposes direct site-wide API to the TpaSection.
 */
export const TpaSection = withDependencies(
	[],
	(): ITpaSection => {
		const sectionRegistry: { [compId: string]: TpaSectionRegistry } = {}
		const appDefinitionIdToCompId: { [appDefId: string]: string } = {}

		return {
			registerTpaSection(compId, tpaSectionAPI) {
				sectionRegistry[compId] = tpaSectionAPI
				appDefinitionIdToCompId[tpaSectionAPI.appDefinitionId] = compId
			},
			unregisterTpaSection(compId) {
				const compData = sectionRegistry[compId]
				const appDefId = compData?.appDefinitionId
				delete sectionRegistry[compId]
				if (appDefId) {
					delete appDefinitionIdToCompId[appDefId]
				}
			},
			getTpaSectionByAppDefinitionId(appDefinitionId) {
				const compId = appDefinitionIdToCompId[appDefinitionId]
				return sectionRegistry[compId]
			},
		}
	}
)
