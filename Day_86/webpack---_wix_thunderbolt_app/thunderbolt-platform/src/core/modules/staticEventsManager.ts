import _ from 'lodash'
import type { IPlatformLogger, IModelsAPI } from '@wix/thunderbolt-symbols'
import { getFullId, isDisplayedOnly, createPromise } from '@wix/thunderbolt-commons'
import type { EventHandlers } from '../types'
import { EVENT_TYPES_MAP } from '../constants'
import type { IWixSelector } from './wixSelector'
import type { IControllerEvents } from './controllerEvents'
import { CONTROLLER_EVENTS, MODELS_API, PLATFORM_LOGGER, STATIC_EVENTS_MANAGER, WIX_SELECTOR } from './moduleNames'

export type IStaticEventsManager = {
	setStaticEventsCallbacks: (eventHandlers: EventHandlers) => void
	triggerStaticEventsHandlers: () => void
}

const StaticEventsManager = (modelsApi: IModelsAPI, controllerEvents: IControllerEvents, wixSelector: IWixSelector, logger: IPlatformLogger): IStaticEventsManager => {
	const { resolver: staticEventCallbacksResolver, promise: staticEventCallbacksPromise } = createPromise<EventHandlers>()
	const { resolver: triggerStaticEventsHandlers, promise: waitForSdksToLoad } = createPromise<void>()

	function reportStaticEventsError(errorMessage: string, extra: any) {
		logger.captureError(new Error(`WixCode Static Events Error: ${errorMessage}`), {
			tags: {
				staticEvents: true,
			},
			extra,
			warning: true,
		})
	}

	function getCompIdFromEventOrModels(compIdFromEvent: string, sourceId: string) {
		const compId = isDisplayedOnly(compIdFromEvent) ? getFullId(compIdFromEvent) : compIdFromEvent
		if (modelsApi.getStructureModelComp(compId)) {
			return compId
		}
		if (modelsApi.getStructureModelComp(sourceId)) {
			return sourceId
		}
		const connection = modelsApi.getWixCodeConnectionByCompId(compId)
		if (connection) {
			return connection.compId
		}
	}

	async function createDynamicEvent({ compId, viewerEvent, handler }: { compId: string; viewerEvent: string; handler: Function }) {
		const role = modelsApi.getRoleForCompId(compId, 'wixCode') as string
		const compType = modelsApi.getCompType(compId) as string
		const connection = modelsApi.getWixCodeConnectionByCompId(compId)
		await waitForSdksToLoad // waiting both for component sdks and for controller sdks to be load and registered
		const sdkInstance = wixSelector.getInstance({ controllerCompId: 'wixCode', compId, role, compType, connection })
		if (!_.isFunction(sdkInstance[viewerEvent])) {
			reportStaticEventsError('viewerEvent does not exists in sdkInstance', {
				compId,
				viewerEvent,
				sdkInstanceKeys: Object.keys(sdkInstance),
			})
			return
		}
		sdkInstance[viewerEvent](handler)
	}

	function registerStaticEvents(callbacks: EventHandlers) {
		const staticEvents = modelsApi.getStaticEvents()
		staticEvents.forEach(({ compId: eventCompId, eventType, callbackId: fnName, sourceId }) => {
			const viewerEvent = EVENT_TYPES_MAP[eventType]
			const compId = getCompIdFromEventOrModels(eventCompId, sourceId)
			if (!compId) {
				reportStaticEventsError('could not find component in the given static event behavior data', {
					eventCompId,
					eventType,
					fnName,
				})
				return
			}
			const handler = callbacks[fnName]
			if (!handler) {
				console.warn(`function ${fnName} is registered as a static event handler but is not exported from the page code. Please remove the static event handler or export the function.`)
				return
			}
			if (viewerEvent) {
				// if the event is in the list of viewer events (onClick, onMouseEnter, etc..) we register it as a dynamic event ($w.onMouseEnter())
				createDynamicEvent({ compId, viewerEvent, handler })
			} else if (modelsApi.isController(compId)) {
				// might be a custom events of the controller, for example "onDatasetReady" - then we register it as a controller event.
				controllerEvents.createScopedControllerEvents(compId).on(eventType, handler)
			} else {
				reportStaticEventsError('eventType is not found in viewerEvents', {
					eventType,
					compId,
					fnName,
					EVENT_TYPES_MAP,
				})
			}
		})
	}

	staticEventCallbacksPromise.then(registerStaticEvents)

	return {
		setStaticEventsCallbacks(callbacks) {
			staticEventCallbacksResolver(callbacks)
		},
		triggerStaticEventsHandlers: () => triggerStaticEventsHandlers(),
	}
}

export default {
	factory: StaticEventsManager,
	deps: [MODELS_API, CONTROLLER_EVENTS, WIX_SELECTOR, PLATFORM_LOGGER],
	name: STATIC_EVENTS_MANAGER,
}
