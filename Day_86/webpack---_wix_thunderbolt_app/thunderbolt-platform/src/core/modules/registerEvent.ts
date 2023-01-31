import _ from 'lodash'
import { getFullId, getFullItemId } from '@wix/thunderbolt-commons'
import type { SdkInstance, IModelsAPI } from '@wix/thunderbolt-symbols'
import type { componentSdkFactoryArgs } from '@wix/thunderbolt-platform-types'
import type { IViewerHandlers } from '../types'
import { EVENT_CONTEXT_SCOPE } from '../constants'
import { getRepeaterScopeContext } from '../repeaterUtils'
import { MODELS_API, REGISTER_EVENT, VIEWER_HANDLERS } from './moduleNames'

export type IRegisterEvent = {
	createRegisterEvent(compId: string, getSdkInstance: (_compId?: string) => SdkInstance): componentSdkFactoryArgs['registerEvent']
	getCreateEventFunction(getSdkInstance: (_compId?: string) => SdkInstance): componentSdkFactoryArgs['createEvent']
	waitForEventsToBeRegistered: () => Promise<unknown>
}

const RegisterEvent = ({ viewerHandlers }: IViewerHandlers, modelsApi: IModelsAPI): IRegisterEvent => {
	const eventRegistrationPromises: Array<Promise<unknown>> = []

	function getEventContext(compId: string) {
		const repeaterCompId = modelsApi.getRepeaterIdByCompId(getFullId(compId))
		if (repeaterCompId) {
			return getRepeaterScopeContext(repeaterCompId, getFullItemId(compId))
		}

		return { type: EVENT_CONTEXT_SCOPE.GLOBAL_SCOPE }
	}

	function getCreateEventFunction(getSdkInstance: (_compId?: string) => any) {
		return function createEvent(e: any) {
			if (!_.isObject(e)) {
				// there are case when sdk register events on the components and trigger them programmatically
				return e
			}

			const { compId, ...restEvent } = e as any
			const target = compId ? getSdkInstance(compId) : getSdkInstance() // compId will only be there if the event is fired on a repeated item
			const context = getEventContext(compId || target.uniqueId)
			return {
				...restEvent,
				target,
				context,
				compId: compId || target.uniqueId, // TODO: remove after EE finish migration of using createCorvidEvent
			}
		}
	}

	function createRegisterEvent(compId: string, getSdkInstance: (_compId?: string) => SdkInstance) {
		const createEventFunction = getCreateEventFunction(getSdkInstance)
		return <EventHandler extends Function>(eventName: string, eventHandler: EventHandler) => {
			const unregisterPromise: Promise<Function> = viewerHandlers.platform.registerEvent(compId, eventName, ([event, ...rest]: Array<any> = [{}]) => {
				eventHandler(createEventFunction(event), ...rest)
			})
			eventRegistrationPromises.push(unregisterPromise)
			return () => unregisterPromise.then((unregister: Function) => unregister())
		}
	}

	return {
		getCreateEventFunction,
		createRegisterEvent,
		waitForEventsToBeRegistered: () => Promise.all(eventRegistrationPromises),
	}
}

export default {
	factory: RegisterEvent,
	deps: [VIEWER_HANDLERS, MODELS_API],
	name: REGISTER_EVENT,
}
