import { withDependencies } from '@wix/thunderbolt-ioc'
import { name } from '../symbols'
import { IModelUpdatesHandlersImplementor } from 'ds-feature-model-updates-invoker'
import { createWorker, destroyWorker, getWorkerId } from '../tpaWorkerCommon'
import { IPropsStore, IStructureAPI, Props, StructureAPI } from '@wix/thunderbolt-symbols'
import type { ITpaWorkerSideEffects } from '../types'
import { TpaSrcBuilderSymbol, ITpaSrcBuilder, TpaContextMappingSymbol, ITpaContextMapping } from 'feature-tpa-commons'

export const TpaWorkerSideEffects = withDependencies(
	[StructureAPI, Props, TpaSrcBuilderSymbol, TpaContextMappingSymbol],
	(
		structureApi: IStructureAPI,
		props: IPropsStore,
		tpaSrcBuilder: ITpaSrcBuilder,
		tpaContextMapping: ITpaContextMapping
	): IModelUpdatesHandlersImplementor<ITpaWorkerSideEffects> => {
		let tpaWorkersSet = new Set<string>()

		return {
			featureName: name,
			handlers: {
				handleTpaWorkersChange: (tpaWorkers) => {
					const nextTpaWorkersSet = new Set<string>()

					Object.entries(tpaWorkers).forEach(([applicationId, workerData]) => {
						const workerId = getWorkerId(applicationId)

						if (!tpaWorkersSet.has(workerId)) {
							createWorker({
								tpaContextMapping,
								props,
								tpaSrcBuilder,
								structureApi,
								workerId,
								...workerData,
							})
						}

						nextTpaWorkersSet.add(workerId)
					})

					for (const workerId of tpaWorkersSet) {
						if (!nextTpaWorkersSet.has(workerId)) {
							destroyWorker({
								tpaContextMapping,
								props,
								structureApi,
								workerId,
							})
						}
					}
					tpaWorkersSet = nextTpaWorkersSet
				},
			},
		}
	}
)
