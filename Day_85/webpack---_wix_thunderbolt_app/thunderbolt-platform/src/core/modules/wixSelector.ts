import _ from 'lodash'
import { getFullId, getItemId } from '@wix/thunderbolt-commons'
import type { $W, $WScope, Connection, IModelsAPI, SdkInstance, EventContext, IPlatformLogger, ClientSpecMapAPI, ComponentEventContext } from '@wix/thunderbolt-symbols'
import type { BootstrapData } from '../../types'
import { EVENT_CONTEXT_SCOPE } from '../constants'
import instancesObjectFactory from '../instancesFactory'
import type { IComponentSdksManager, IUnfinishedTasks } from '../types'
import { getRepeaterScopeContext, getScopedInstancesForRole } from '../repeaterUtils'
import type { IControllerEvents } from './controllerEvents'
import type { ISdkFactoryParams } from './sdkFactoryParams'
import type { CompCacheParams, IInstanceCache } from './instanceCache'
import {
	MODELS_API,
	WIX_SELECTOR,
	BOOTSTRAP_DATA,
	INSTANCE_CACHE,
	PLATFORM_LOGGER,
	UNFINISHED_TASKS,
	CONTROLLER_EVENTS,
	SDK_FACTORY_PARAMS,
	CLIENT_SPEC_MAP_API,
	COMPONENT_SDKS_MANAGER,
} from './moduleNames'

type GetInstanceFunction = (role: string, findOnlyNestedComponents: boolean) => Array<SdkInstance>

export interface IWixSelector {
	create$w: (controllerCompId: string) => $W
	getInstance: ({
		controllerCompId,
		compId,
		compType,
		role,
		connection,
		$wScope,
		itemId,
	}: {
		controllerCompId: string
		compId: string
		compType: string
		role: string
		connection?: Connection
		$wScope?: $WScope
		itemId?: string
	}) => SdkInstance | Array<SdkInstance> | null
	$wFactory: (controllerId: string, getInstancesForRole: GetInstanceFunction, repeaterId?: string) => $W
	flushOnReadyCallbacks: () => Promise<any>
	onPageReady: (onReadyCallback: () => Promise<any>, controllerId: string, repeatedController: boolean) => void
	create$wGlobalScope(): $WScope
	create$wRepeaterScope(params: { compId: string; itemId: string }): $WScope
}

const resolveSelectorType = (rawSelector: string): 'role' | 'nickname' | 'type' => {
	switch (rawSelector[0]) {
		case '@':
			return 'role'
		case '#':
			return 'nickname'
		default:
			return 'type'
	}
}

const WixSelector = (
	modelsApi: IModelsAPI,
	{ getSdkFactoryParams }: ISdkFactoryParams,
	controllerEvents: IControllerEvents,
	sdkInstancesCache: IInstanceCache,
	componentSdksManager: IComponentSdksManager,
	logger: IPlatformLogger,
	bootstrapData: BootstrapData,
	unfinishedTasks: IUnfinishedTasks,
	clientSpecMapApi: ClientSpecMapAPI
): IWixSelector => {
	// Controls whether to queue or execute onReady callbacks.
	let isFlushingOnReadyCallbacks = false

	let onReadyCallbacks: { [controllerCompId: string]: { template: Array<() => void>; repeated: Array<() => void> } } = {}

	const create$wRepeaterScope = ({ compId, itemId }: { compId: string; itemId: string }) => ({
		type: EVENT_CONTEXT_SCOPE.COMPONENT_SCOPE,
		id: compId,
		compId,
		additionalData: { itemId },
	})
	const create$wGlobalScope = () => ({ type: EVENT_CONTEXT_SCOPE.GLOBAL_SCOPE, additionalData: {} })

	// self-exection function, allow caching the calculations of mapping all componentTypes to their sdkType
	const resolveCompTypeForSdkType = (() => {
		const _cache: Record<string, Record<string, boolean>> = {}
		return (sdkType: string, compId: string) => {
			const fromCache = () => {
				const compType = modelsApi.getCompType(compId)
				return compType && _cache[sdkType][compType] ? compType : null
			}
			if (_cache[sdkType]) {
				return fromCache()
			}
			_cache[sdkType] = componentSdksManager.getSdkTypeToComponentTypes(sdkType).reduce(
				(result, _compType) => ({
					...result,
					[_compType]: true,
				}),
				{} as Record<string, boolean>
			)
			return fromCache()
		}
	})()

	const invokeControllerOnReady = async (controllerCompId: string) => {
		// It's possible to have a controller without an onReady Callback, for example wix code without any $w.onReady().
		if (!onReadyCallbacks[controllerCompId]) {
			return Promise.resolve()
		}

		const { template, repeated } = onReadyCallbacks[controllerCompId]
		// do not run the pageReady of a repeated controller template, for the same reason we don't render repeated components.
		const onReadys = repeated.length ? repeated : template
		return Promise.all(onReadys.map((onReady) => onReady()))
	}

	const flushOnReadyCallbacks = () => {
		isFlushingOnReadyCallbacks = true
		const onReadyPromise = Promise.all(modelsApi.getControllers().map(invokeControllerOnReady))
		onReadyCallbacks = {}
		return onReadyPromise
	}

	function getInstance({
		controllerCompId,
		compId,
		connection,
		compType,
		role,
		$wScope = create$wGlobalScope(),
		itemId,
	}: {
		controllerCompId: string
		compId: string
		compType: string
		connection?: Connection
		role: string
		$wScope?: $WScope
		itemId?: string
	}): SdkInstance | Array<SdkInstance> | null {
		const compCacheParams: CompCacheParams = {
			controllerCompId,
			compId: getFullId(compId),
			role,
			itemId: itemId ?? getItemId(compId),
		}
		const instanceFromCache = sdkInstancesCache.getSdkInstance(compCacheParams)
		if (instanceFromCache) {
			return instanceFromCache
		}
		modelsApi.updateDisplayedIdPropsFromTemplate(compId)

		const componentSdkFactory = componentSdksManager.getComponentSdkFactory(compType)
		if (!componentSdkFactory) {
			return {}
		}

		const sdkFactoryParams = getSdkFactoryParams({
			$wScope,
			compId,
			controllerCompId,
			connection,
			compType,
			role,
			getInstance,
			create$w: () => create$w(controllerCompId),
		})
		const instance = componentSdkFactory(sdkFactoryParams)
		sdkInstancesCache.setSdkInstance(compCacheParams, instance)
		return instance
	}

	function queueOnReadyCallback(onReadyCallback: () => Promise<any>, controllerId: string, repeatedController: boolean) {
		onReadyCallbacks[controllerId] = onReadyCallbacks[controllerId] || { template: [], repeated: [] }
		onReadyCallbacks[controllerId][repeatedController ? 'repeated' : 'template'].push(onReadyCallback)
	}

	const createInstancesGetter = (controllerId: string): GetInstanceFunction => (role: string) => {
		const connections = modelsApi.getConnectionsByCompId(controllerId, role)
		return connections.map((connection: Connection) => {
			const compId = connection.compId
			const compType = modelsApi.getCompType(compId)
			if (!compType) {
				logger.captureError(new Error('$W Error 2: Failed to find component from connection in structure'), {
					tags: {
						GetInstanceFunction: true,
					},
					extra: {
						controllerCompId: controllerId,
						role,
						compId,
						structureModel: modelsApi.getStructureModel(),
						connection,
						currentPageId: bootstrapData.currentPageId,
						currentContextId: bootstrapData.currentContextId,
					},
				})
				return {}
			}
			return getInstance({
				controllerCompId: controllerId,
				compId,
				connection,
				role,
				compType,
			})
		})
	}

	const $wDocument = (controllerId: string) => {
		const DocumentSdkFactory = componentSdksManager.getComponentSdkFactory('Document')
		if (!DocumentSdkFactory) {
			return
		}
		return DocumentSdkFactory(
			getSdkFactoryParams({
				compId: controllerId,
				controllerCompId: controllerId,
				compType: 'Document',
				role: 'Document',
				getInstance,
				create$w: () => create$w(controllerId),
				$wScope: create$wGlobalScope(),
			})
		)
	}

	const $wComponent = (
		selector: string,
		controllerId: string,
		{ getInstancesForRole, findOnlyNestedComponents }: { getInstancesForRole: GetInstanceFunction; findOnlyNestedComponents: boolean }
	) => {
		const getInstancesForType = (sdkType: string, connections: Array<Connection>): Array<SdkInstance> => {
			return connections.reduce((instances, connection) => {
				const { compId, role } = connection
				const compType = resolveCompTypeForSdkType(sdkType, compId)
				if (!compType) {
					return instances
				}
				const instance: SdkInstance | Array<SdkInstance> | null = getInstance({
					controllerCompId: controllerId,
					compId,
					connection,
					role,
					compType,
				})
				if (_.isArray(instance)) {
					instances.push(...instance)
				} else if (instance) {
					instances.push(instance)
				}
				return instances
			}, [] as Array<SdkInstance>)
		}

		const getComponentInstances = (slctr: string): Array<SdkInstance> => {
			if (resolveSelectorType(slctr) === 'type') {
				const connections = _.flatMap(Object.values(modelsApi.getControllerConnections(controllerId)))
				return getInstancesForType(slctr, connections)
			}
			const roleOrId = slctr.slice(1)
			return getInstancesForRole(roleOrId, findOnlyNestedComponents)
		}

		const selectors = selector.split(',').map((s) => s.trim())
		const instances = _.chain(selectors)
			.map(getComponentInstances)
			.flatMap()
			.uniqBy('uniqueId') // all SdkInstance have id
			.value()
		if (selectors.length === 1 && resolveSelectorType(selector) === 'nickname') {
			return _.first(instances) || []
		}
		return instancesObjectFactory(instances)
	}

	const $wFactory: IWixSelector['$wFactory'] = (controllerId: string, getInstancesForRole, repeaterId): $W => {
		const wixSelectorInternal = (selector: string, { findOnlyNestedComponents } = { findOnlyNestedComponents: false }) => {
			if (selector === 'Document') {
				return $wDocument(controllerId)
			}
			return $wComponent(selector, controllerId, { getInstancesForRole, findOnlyNestedComponents })
		}

		const $w = (selector: string) => wixSelectorInternal(selector)

		const scopedControllerEvents = controllerEvents.createScopedControllerEvents(controllerId)
		const currentScope = repeaterId ? getRepeaterScopeContext(repeaterId) : { type: EVENT_CONTEXT_SCOPE.GLOBAL_SCOPE }

		$w.fireEvent = scopedControllerEvents.fireEvent
		$w.off = scopedControllerEvents.off
		$w.on = scopedControllerEvents.on
		$w.once = scopedControllerEvents.once
		$w.onReady = (cb: () => Promise<any>) => {
			const callbackWithErrorHandling = async () => {
				try {
					return await cb()
				} catch (e) {
					console.error(e)
					return Promise.resolve()
				}
			}

			// Either queue the onReady callback, or execute it immediately (When onReady's already started flushing).
			if (isFlushingOnReadyCallbacks) {
				return callbackWithErrorHandling()
			}

			queueOnReadyCallback(
				async () => {
					const removeUnfinishedTask = unfinishedTasks.add(`controller_page_ready_${clientSpecMapApi.getWixCodeAppDefinitionId()}_wixCode`)
					const result = await callbackWithErrorHandling()
					removeUnfinishedTask()

					return result
				},
				controllerId,
				!!repeaterId
			)
		}
		$w.at = (context: EventContext) => {
			if (!context) {
				return $w
			}
			if (_.isEqual(_.omit(context, ['itemId']), currentScope)) {
				return $w
			}

			if (context.type === EVENT_CONTEXT_SCOPE.COMPONENT_SCOPE) {
				const componentContext = context as ComponentEventContext
				const $wScope = create$wRepeaterScope({
					compId: componentContext._internal.repeaterCompId,
					itemId: componentContext.itemId,
				})
				// repeated-item-scope selector
				const compId = componentContext._internal.repeaterCompId
				const getInstanceForRole = getScopedInstancesForRole({
					modelsApi,
					controllerCompId: controllerId,
					repeaterId: compId,
					itemId: componentContext.itemId!,
					getInstanceFn: getInstance,
					$wScope,
				})
				return $wFactory(controllerId, getInstanceForRole, compId)
			}

			return create$w(controllerId)
		}
		$w.createEvent = (type: string, params: any) => {
			const context = { type: EVENT_CONTEXT_SCOPE.GLOBAL_SCOPE } // TODO: implement context for repeaters if necessary
			return { context, type, ...params }
		}
		$w.onRender = () => {
			// seems like this API is not exploding in bolt but not running. see TB-2264
			if (process.env.NODE_ENV === 'development') {
				console.log('$w.onRender API is deprecated')
			}
		}
		$w.scoped = (selector: string) => wixSelectorInternal(selector, { findOnlyNestedComponents: true })

		return $w as $W
	}

	const create$w: IWixSelector['create$w'] = (controllerCompId) => $wFactory(controllerCompId, createInstancesGetter(controllerCompId))

	return {
		create$w,
		getInstance,
		$wFactory,
		flushOnReadyCallbacks,
		onPageReady: queueOnReadyCallback,
		create$wGlobalScope,
		create$wRepeaterScope,
	}
}

export default {
	factory: WixSelector,
	deps: [MODELS_API, SDK_FACTORY_PARAMS, CONTROLLER_EVENTS, INSTANCE_CACHE, COMPONENT_SDKS_MANAGER, PLATFORM_LOGGER, BOOTSTRAP_DATA, UNFINISHED_TASKS, CLIENT_SPEC_MAP_API],
	name: WIX_SELECTOR,
}
