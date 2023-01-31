import { ITpaContextMapping, ITpaSrcBuilder } from 'feature-tpa-commons'
import { IPropsStore, IStructureAPI } from '@wix/thunderbolt-symbols'

type CreateWorkerArgs = {
	tpaContextMapping: ITpaContextMapping
	props: IPropsStore
	tpaSrcBuilder: ITpaSrcBuilder
	structureApi: IStructureAPI
	workerId: string
	appDefinitionId: string
	appWorkerUrl: string
	appDefinitionName: string
}

type DestroyWorkerArgs = {
	tpaContextMapping: ITpaContextMapping
	props: IPropsStore
	structureApi: IStructureAPI
	workerId: string
}

const TPA_WORKER_PREFIX = 'tpaWorker'

const tpaWorkerCompIdRegex = new RegExp(`^${TPA_WORKER_PREFIX}_([0-9]+)$`)

export const isTpaWorker = (compId: string) => tpaWorkerCompIdRegex.test(compId)

export const getWorkerApplicationId = (compId: string) => {
	return tpaWorkerCompIdRegex.exec(compId)?.[1]
}

export const getWorkerId = (applicationId: string) => {
	return `${TPA_WORKER_PREFIX}_${applicationId}`
}

export const createWorker = ({
	tpaContextMapping,
	props,
	tpaSrcBuilder,
	structureApi,
	workerId,
	appDefinitionId,
	appWorkerUrl,
	appDefinitionName,
}: CreateWorkerArgs): void => {
	tpaContextMapping.registerTpasForContext({ contextId: 'masterPage', pageId: 'masterPage' }, [workerId])

	props.update({
		[workerId]: {
			title: appDefinitionName,
			src: tpaSrcBuilder.buildSrc(workerId, 'masterPage', {}, appWorkerUrl, {
				extraQueryParams: {
					endpointType: 'worker',
				},
				appDefinitionId,
			}),
		},
	})

	structureApi.addComponentToDynamicStructure(workerId, {
		components: [],
		componentType: 'TPAWorker',
	})
}

export const destroyWorker = ({ structureApi, workerId, tpaContextMapping }: DestroyWorkerArgs): void => {
	structureApi.removeComponentFromDynamicStructure(workerId)
	tpaContextMapping.unregisterTpa(workerId)
}
