import _ from 'lodash'
import type { componentSdkFactoryArgs } from '@wix/thunderbolt-platform-types'
import { createStyleUtils, getFullId, getItemId } from '@wix/thunderbolt-commons'
import type { IPlatformUtils, SdkInstance, IPlatformLogger, Connection, $W, $WScope, EventContext, IModelsAPI, IWixCodeNamespacesRegistry } from '@wix/thunderbolt-symbols'
import type { BootstrapData, IEffectsTriggerApi } from '../../types'
import type { IPlatformAnimations, RunAnimationOptions } from '../../animations-types'
import { MasterPageId } from '../constants'
import type { IViewerHandlers } from '../types'
import type { IWixSelector } from './wixSelector'
import type { IInstanceCache } from './instanceCache'
import type { IRegisterEvent } from './registerEvent'
import type { ISetPropsManager } from './setPropsManager'
import type { IComponentSdkState } from './componentSdkState'
import type { ISlotsManager } from './slotsManager'
import {
	MODELS_API,
	BOOTSTRAP_DATA,
	INSTANCE_CACHE,
	PLATFORM_UTILS,
	REGISTER_EVENT,
	PLATFORM_LOGGER,
	VIEWER_HANDLERS,
	SET_PROPS_MANAGER,
	GET_COMP_BY_REF_ID,
	SDK_FACTORY_PARAMS,
	COMPONENT_SDK_STATE,
	PLATFORM_ANIMATIONS,
	WIX_CODE_NAMESPACES_REGISTRY,
	EFFECTS_TRIGGER_API,
	SLOTS_MANAGER,
} from './moduleNames'

export type ISdkFactoryParams = {
	getSdkFactoryParams(args: {
		compId: string
		controllerCompId: string
		connection?: Connection
		compType: string
		role: string
		getInstance: IWixSelector['getInstance']
		create$w: () => $W
		$wScope: $WScope
	}): componentSdkFactoryArgs
}

const SdkFactoryParams = (
	modelsApi: IModelsAPI,
	logger: IPlatformLogger,
	platformUtils: IPlatformUtils,
	registerEvent: IRegisterEvent,
	sdkInstancesCache: IInstanceCache,
	{ platformEnvData }: BootstrapData,
	{ createSetProps }: ISetPropsManager,
	componentSdkState: IComponentSdkState,
	getCompRefById: (compId: string) => any,
	platformAnimations: IPlatformAnimations,
	{ createViewerHandlers }: IViewerHandlers,
	wixCodeNamespacesRegistry: IWixCodeNamespacesRegistry,
	effectsTriggerApi: IEffectsTriggerApi,
	slotsManager: ISlotsManager
): ISdkFactoryParams => {
	return {
		getSdkFactoryParams: ({ compId, connection, compType, controllerCompId, role, getInstance, create$w, $wScope }) => {
			const props = modelsApi.getCompProps(compId)
			const sdkData = modelsApi.getCompSdkData(compId)
			const handlers = createViewerHandlers(modelsApi.getPageIdByCompId(compId))

			const portalId = `portal-${connection?.compId || compId}`

			const { hiddenOnLoad, collapseOnLoad } = modelsApi.getOnLoadProperties(compId)

			function getChildren() {
				return modelsApi.getContainerChildrenIds(compId).map((id: string) =>
					getInstance({
						controllerCompId,
						compId: id,
						compType: modelsApi.getCompType(id) || '',
						role: modelsApi.getRoleForCompId(id, controllerCompId) || '',
						connection: _.get(modelsApi.getCompIdConnections(), [id, controllerCompId]),
						$wScope,
					})
				)
			}

			function getSdkInstance() {
				return sdkInstancesCache.getSdkInstance({
					compId: getFullId(compId),
					controllerCompId,
					role,
					itemId: getItemId(compId),
				})
			}

			const isGlobal = () => {
				if (modelsApi.getCompType(compId) === 'Page') {
					return true // Page components are always global by design
				}
				return modelsApi.getPageIdByCompId(compId) === MasterPageId
			}

			function getParent(): SdkInstance | null {
				const parentId = modelsApi.findClosestParentIdWithRole(compId, controllerCompId)
				if (!parentId) {
					return
				}
				const parentCompType = modelsApi.getCompType(parentId)
				const parentRole = modelsApi.getRoleForCompId(parentId, controllerCompId) as string
				const parentConnection = modelsApi.getConnectionsByCompId(controllerCompId, parentRole)[0]
				return getInstance({
					controllerCompId,
					compId: parentId,
					compType: parentCompType as string,
					role: parentRole,
					connection: parentConnection,
				})
			}

			const getOwnSdkInstance = (_compId: string = compId) =>
				getInstance({
					controllerCompId,
					compType,
					connection,
					role,
					compId: _compId,
				})
			const createdRegisterEvent = registerEvent.createRegisterEvent(compId, getOwnSdkInstance)
			const createEvent = registerEvent.getCreateEventFunction(getOwnSdkInstance)

			function setStyles(id: string, style: object) {
				if (modelsApi.isRepeaterTemplate(id)) {
					modelsApi.getDisplayedIdsOfRepeaterTemplate(id).forEach((displayedId: string) => {
						handlers.stores.updateStyles({ [displayedId]: style })
					})
				}

				handlers.stores.updateStyles({ [id]: style })
			}

			const remove = () => {
				if (modelsApi.isRepeaterTemplate(compId)) {
					modelsApi.getDisplayedIdsOfRepeaterTemplate(compId).forEach((displayedId: string) => {
						handlers.stores.updateStructure({ [displayedId]: { deleted: true } })
					})
				}
				handlers.stores.updateStructure({ [compId]: { deleted: true } })
			}

			const restore = () => {
				if (modelsApi.isRepeaterTemplate(compId)) {
					modelsApi.getDisplayedIdsOfRepeaterTemplate(compId).forEach((displayedId: string) => {
						handlers.stores.updateStructure({ [displayedId]: { deleted: false } })
					})
				}
				handlers.stores.updateStructure({ [compId]: { deleted: false } })
			}

			function createScoped$w({ context }: { context?: EventContext } = {}) {
				const $w = create$w()
				return context ? $w.at(context) : $w
			}

			const wixCodeId = modelsApi.getRoleForCompId(compId, 'wixCode')

			const isResponsive = platformEnvData.site.isResponsive || modelsApi.hasResponsiveLayout(compId)
			const styleUtils = createStyleUtils({ isResponsive })

			return {
				effectsTriggersApi: effectsTriggerApi.createCompTriggerAndReactionsApi(compId),
				props,
				sdkData,
				compId,
				controllerCompId,
				setStyles: (style: object) => {
					setStyles(compId, style)
				},
				remove,
				restore,
				setProps: createSetProps(compId),
				createSdkState: componentSdkState.createSdkState(compId),
				compRef: getCompRefById(compId),
				handlers,
				getChildren,
				getSlot: (slotName: string) => slotsManager.getSlot(controllerCompId, compId, slotName, getInstance, $wScope),
				registerEvent: createdRegisterEvent,
				createEvent,
				getSdkInstance,
				role,
				runAnimation: (options: Omit<RunAnimationOptions, 'compId'>) =>
					platformAnimations.runAnimation({
						...options,
						compId,
					}),
				create$w: createScoped$w,
				$wScope,
				metaData: {
					compId,
					role,
					connection,
					compType,
					isGlobal,
					hiddenOnLoad,
					collapsedOnLoad: collapseOnLoad,
					isRendered: () => modelsApi.isRendered(compId),
					getParent,
					getChildren,
					wixCodeId,
					isRepeaterTemplate: modelsApi.isRepeaterTemplate(compId),
				},
				portal: {
					setStyles: (style: object) => {
						setStyles(portalId, style)
					},
					runAnimation: (options: Omit<RunAnimationOptions, 'compId'>) =>
						platformAnimations.runAnimation({
							...options,
							compId: portalId,
						}),
				},
				envData: {
					location: { externalBaseUrl: platformEnvData.location.externalBaseUrl },
					site: { viewMode: platformEnvData.site.viewMode },
					router: { routingInfo: platformEnvData.router.routingInfo },
				},
				// eventually will remove the spread after migrating in EE, since we want SDKs to use platformUtils just like namespaces
				platformUtils: {
					...platformUtils,
					// TODO we probably want to inject a wixCodeApi object to comp sdks and not the registry.
					// we'll need to migrate page corvid sdk: https://github.com/wix-private/editor-elements/blob/b10ee2ef7b7d5913f389cd69314025e8732e8484/packages/thunderbolt-elements/src/thunderbolt-core-components/Page/corvid/Page.corvid.ts#L16
					wixCodeNamespacesRegistry: {
						get: (namespace) => wixCodeNamespacesRegistry.get(namespace, modelsApi.getApplicationIdOfController(controllerCompId)!),
					},
				},
				...platformUtils,
				styleUtils,
			}
		},
	}
}

export default {
	factory: SdkFactoryParams,
	deps: [
		MODELS_API,
		PLATFORM_LOGGER,
		PLATFORM_UTILS,
		REGISTER_EVENT,
		INSTANCE_CACHE,
		BOOTSTRAP_DATA,
		SET_PROPS_MANAGER,
		COMPONENT_SDK_STATE,
		GET_COMP_BY_REF_ID,
		PLATFORM_ANIMATIONS,
		VIEWER_HANDLERS,
		WIX_CODE_NAMESPACES_REGISTRY,
		EFFECTS_TRIGGER_API,
		SLOTS_MANAGER,
	],
	name: SDK_FACTORY_PARAMS,
}
