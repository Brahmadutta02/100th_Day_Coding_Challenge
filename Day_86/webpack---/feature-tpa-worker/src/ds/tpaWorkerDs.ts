import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { SiteFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import { name } from '../symbols'
import type { ITpaWorker, TpaWorkerSiteConfig } from '../types'
import { isTpaWorker, getWorkerApplicationId } from '../tpaWorkerCommon'

export const TpaWorkerFactoryDs = withDependencies(
	[named(SiteFeatureConfigSymbol, name)],
	({ tpaWorkers }: TpaWorkerSiteConfig): ITpaWorker => {
		return {
			getWorkerDetails(compId) {
				const applicationId = getWorkerApplicationId(compId)
				return tpaWorkers[applicationId!]
			},
			isTpaWorker,
		}
	}
)
