import type { $WScope, IModelsAPI } from '@wix/thunderbolt-symbols'
import { getDisplayedId } from '@wix/thunderbolt-commons'
import { EVENT_CONTEXT_SCOPE } from './constants'
import type { IWixSelector } from './modules/wixSelector'

function resolveRepeaterCompId(modelsApi: IModelsAPI, compId: string, itemId: string, repeaterId: string, findOnlyNestedComponents: boolean) {
	if (modelsApi.getCompSdkData(repeaterId).repeaterChildComponents.includes(compId)) {
		return getDisplayedId(compId, itemId)
	}
	if (findOnlyNestedComponents) {
		return null // compId is not a child of the repeater
	}
	return compId
}

export function getScopedInstancesForRole({
	modelsApi,
	controllerCompId,
	repeaterId,
	itemId,
	getInstanceFn,
	$wScope,
}: {
	modelsApi: IModelsAPI
	controllerCompId: string
	repeaterId: string
	itemId: string
	getInstanceFn: IWixSelector['getInstance']
	$wScope: $WScope
}) {
	return (role: string, findOnlyNestedComponents: boolean) => {
		const connections = modelsApi.getConnectionsByCompId(controllerCompId, role)
		return connections
			.map((connection) => {
				const compId = connection.compId
				const itemCompId = resolveRepeaterCompId(modelsApi, compId, itemId, repeaterId, findOnlyNestedComponents)
				if (!itemCompId) {
					return null
				}
				const compType = modelsApi.getCompType(compId) || ''
				return getInstanceFn({
					compId: itemCompId,
					connection,
					role,
					compType,
					controllerCompId,
					$wScope,
					itemId,
				})
			})
			.filter((v) => v)
	}
}

export function getRepeaterScopeContext(repeaterCompId: string, itemId?: string) {
	return {
		type: EVENT_CONTEXT_SCOPE.COMPONENT_SCOPE,
		...(itemId && { itemId }),
		get _internal() {
			return { repeaterCompId }
		},
	}
}
