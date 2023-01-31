import { named, withDependencies } from '@wix/thunderbolt-ioc'
import {
	CurrentRouteInfoSymbol,
	IAppDidMountHandler,
	IAppWillLoadPageHandler,
	IPropsStore,
	IStructureAPI,
	Props,
	SiteFeatureConfigSymbol,
	StructureAPI,
} from '@wix/thunderbolt-symbols'
import { TpaSrcBuilderSymbol, ITpaSrcBuilder, TpaContextMappingSymbol, ITpaContextMapping } from 'feature-tpa-commons'
import { name } from './symbols'
import type { ITpaWorker, TpaWorkerSiteConfig } from './types'
import { ICurrentRouteInfo } from 'feature-router'
import { createPromise } from '@wix/thunderbolt-commons'
import { createWorker, isTpaWorker, getWorkerApplicationId, getWorkerId } from './tpaWorkerCommon'

export const TpaWorkerFactory = withDependencies(
	[
		named(SiteFeatureConfigSymbol, name),
		StructureAPI,
		Props,
		TpaSrcBuilderSymbol,
		TpaContextMappingSymbol,
		CurrentRouteInfoSymbol,
	],
	(
		{ tpaWorkers }: TpaWorkerSiteConfig,
		structureApi: IStructureAPI,
		props: IPropsStore,
		tpaSrcBuilder: ITpaSrcBuilder,
		tpaContextMapping: ITpaContextMapping,
		currentRouteInfo: ICurrentRouteInfo
	): IAppDidMountHandler & ITpaWorker & IAppWillLoadPageHandler => {
		const {
			resolver: resolveNavigationToNonProtectedPagePromise,
			promise: waitForNavigationToNonProtectedPage,
		} = createPromise()

		return {
			name: 'tpaWorker',
			/* we want to wait for the entire site to be ready before adding the workers, this is why we use appDidMount.
				appDidLoadPage is only used to prevent special cases where tpaWorker on site and the starting page is
				a protected page, normally the tpa should not be in the structure at all but because of how tpaWorker
				is inflated it will be and start fire handlers while the site is not really ready yet (for example
				calling getSiteInfo when currentRouteInfo has not been resolved yet)
			 */
			appDidMount() {
				waitForNavigationToNonProtectedPage.then(() =>
					Object.entries(tpaWorkers).forEach(([applicationId, workerData]) => {
						const workerId = getWorkerId(applicationId)
						createWorker({
							tpaContextMapping,
							props,
							tpaSrcBuilder,
							structureApi,
							workerId,
							...workerData,
						})
					})
				)
			},
			appWillLoadPage() {
				if (currentRouteInfo.getCurrentRouteInfo()) {
					resolveNavigationToNonProtectedPagePromise()
				}
			},
			getWorkerDetails(compId) {
				const applicationId = getWorkerApplicationId(compId)
				return tpaWorkers[applicationId!]
			},
			isTpaWorker,
		}
	}
)
