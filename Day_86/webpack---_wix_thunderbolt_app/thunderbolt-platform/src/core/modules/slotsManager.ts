import _ from 'lodash'
import type { IModelsAPI, $WScope, SdkInstance } from '@wix/thunderbolt-symbols'
import type { IWixSelector } from './wixSelector'
import { MODELS_API, SLOTS_MANAGER } from './moduleNames'

export type ISlotsManager = {
	getSlot(controllerCompId: string, compId: string, slotName: string, getInstance: IWixSelector['getInstance'], $wScope?: $WScope): SdkInstance
}

const SlotsManager = (modelsApi: IModelsAPI): ISlotsManager => {
	return {
		getSlot(controllerCompId, compId, slotName, getInstance, $wScope) {
			const slotId = modelsApi.getSlotByName(compId, slotName)
			if (!slotId) {
				return {}
			}
			return getInstance({
				controllerCompId,
				compId: slotId,
				compType: modelsApi.getCompType(slotId) || '',
				role: modelsApi.getRoleForCompId(slotId, controllerCompId) || '',
				connection: _.get(modelsApi.getCompIdConnections(), [slotId, controllerCompId]),
				$wScope,
			})
		},
	}
}

export default {
	factory: SlotsManager,
	deps: [MODELS_API],
	name: SLOTS_MANAGER,
}
