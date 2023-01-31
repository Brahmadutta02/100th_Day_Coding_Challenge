import _ from 'lodash'
import { name } from '../symbols'
import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { TpaPageConfig, TpaMasterPageConfig } from '../types'
import {
	PageFeatureConfigSymbol,
	MasterPageFeatureConfigSymbol,
	TpaHandlerProvider,
	SiteFeatureConfigSymbol,
	ExperimentsSymbol,
	Experiments,
} from '@wix/thunderbolt-symbols'
import { name as tpaCommonsName, TpaCommonsSiteConfig } from 'feature-tpa-commons'

type IsAppInstalledArgs = {
	sectionId: string
	originCompId: string
	appDefinitionId?: string
}

export type MessageData = { appDefinitionId?: string; sectionId: string }

export const IsAppSectionInstalledHandler = withDependencies(
	[
		named(PageFeatureConfigSymbol, name),
		named(MasterPageFeatureConfigSymbol, name),
		named(SiteFeatureConfigSymbol, tpaCommonsName),
		ExperimentsSymbol,
	],
	(
		{ widgets }: TpaPageConfig,
		{ pagesData }: TpaMasterPageConfig,
		{ widgetsClientSpecMapData }: TpaCommonsSiteConfig,
		experiments: Experiments
	): TpaHandlerProvider => {
		const isAppInstalledByPageAppDefId = ({ sectionId, originCompId, appDefinitionId }: IsAppInstalledArgs) => {
			if (experiments['specs.thunderbolt.readAppDefIdFromPageData']) {
				const appDefId = appDefinitionId || widgets[originCompId]?.appDefinitionId
				const appPagesByAppDefId = _.filter(pagesData, { appDefinitionId: appDefId })

				return _.some(appPagesByAppDefId, {
					tpaPageId: sectionId,
				})
			}

			return false
		}

		const isAppInstalledByApplicationId = ({ sectionId, originCompId, appDefinitionId }: IsAppInstalledArgs) => {
			let applicationId: number | string = widgets[originCompId]?.applicationId
			if (appDefinitionId) {
				const app = _.find(widgetsClientSpecMapData, { appDefinitionId })
				applicationId = app?.applicationId || applicationId
			}
			const appPages = _.filter(pagesData, { tpaApplicationId: Number(applicationId) })
			return _.some(appPages, {
				tpaPageId: sectionId,
			})
		}

		return {
			getTpaHandlers() {
				return {
					isAppSectionInstalled(
						_compId,
						{ sectionId, appDefinitionId }: MessageData,
						{ originCompId }
					): boolean {
						const args = { sectionId, originCompId, appDefinitionId }
						return isAppInstalledByPageAppDefId(args) || isAppInstalledByApplicationId(args)
					},
				}
			},
		}
	}
)
