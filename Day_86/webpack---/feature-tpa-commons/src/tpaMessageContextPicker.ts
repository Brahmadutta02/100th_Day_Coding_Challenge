import { optional, withDependencies } from '@wix/thunderbolt-ioc'
import {
	IAppDidMountHandler,
	IStructureAPI,
	StructureAPI,
	LoggerSymbol,
	ILogger,
	TpaIFrame,
	CurrentRouteInfoSymbol,
	TpaPopupSymbol,
	ITpaPopup,
} from '@wix/thunderbolt-symbols'
import { parseMessage } from '@wix/thunderbolt-commons'
import type { ITpaContextMapping, ITpaHandlersManager, PageInfo, TpaIncomingMessage } from './types'
import { IPageProvider, LogicalReflectorSymbol } from 'feature-pages'
import { TpaContextMappingSymbol, TpaHandlersManagerSymbol } from './symbols'
import { WindowMessageRegistrarSymbol, IWindowMessageRegistrar } from 'feature-window-message-registrar'
import { TbDebugSymbol, DebugApis } from 'feature-debug'
import { editorOnlyHandlers, isTpaMessage } from './tpaMessageUtilis'
import type { ICurrentRouteInfo } from 'feature-router'
import { ILightboxesLinkUtilsAPI, LightboxesLinkUtilsAPISymbol } from 'feature-lightbox'

/**
 * This object's purpose is to comb through incoming window messages and assign TPA messages to the TpaHandler
 * instance in the correct IOC container (e.g the container that has the message sending component).
 */
export const TpaMessageContextPicker = withDependencies(
	[
		WindowMessageRegistrarSymbol,
		LogicalReflectorSymbol,
		TpaContextMappingSymbol,
		StructureAPI,
		CurrentRouteInfoSymbol,
		optional(LightboxesLinkUtilsAPISymbol),
		optional(LoggerSymbol),
		optional(TbDebugSymbol),
	],
	(
		windowMessageRegistrar: IWindowMessageRegistrar,
		pageProvider: IPageProvider,
		tpaContextMapping: ITpaContextMapping,
		structureApi: IStructureAPI,
		currentRouteInfo: ICurrentRouteInfo,
		popupsLinkUtilsAPI?: ILightboxesLinkUtilsAPI,
		logger?: ILogger,
		debugApi?: DebugApis
	): IAppDidMountHandler => {
		const getHandlersManagerForPage = async ({ contextId, pageId }: PageInfo): Promise<ITpaHandlersManager> => {
			const pageRef = await pageProvider(contextId, pageId)
			return pageRef.getAllImplementersOnPageOf<ITpaHandlersManager>(TpaHandlersManagerSymbol)[0]
		}

		const getMessageSourceContainerId = ({ compId }: TpaIncomingMessage<any>): PageInfo | undefined => {
			if (!compId) {
				return
			}

			// getTpaComponentPageInfo() for persistent popups and chat in responsive
			// getContextIdOfCompId() to seek compId in structure if compId does not belong to tpa/ooi widget (i.e any random iframe with the js-sdk installed, e.g tpa galleries)
			const pageInfo = tpaContextMapping.getTpaComponentPageInfo(compId)
			if (!pageInfo || !pageInfo.contextId) {
				const contextId = structureApi.getContextIdOfCompId(compId)
				if (contextId) {
					return { contextId, pageId: contextId }
				}
			}
			return pageInfo
		}

		const getIsPersistentPopup = async (pageInfo: PageInfo | undefined, compId: string) => {
			if (pageInfo) {
				const pageRef = await pageProvider(pageInfo!.contextId, pageInfo!.pageId)
				return pageRef.getAllImplementersOnPageOf<ITpaPopup>(TpaPopupSymbol)[0]?.getOpenedPopups()?.[compId]
					?.isPersistent
			}
			return false
		}

		return {
			appDidMount() {
				windowMessageRegistrar.addWindowMessageHandler({
					canHandleEvent(event: MessageEventInit) {
						return !!(event.source && isTpaMessage(parseMessage(event)))
					},
					async handleEvent(event: MessageEventInit) {
						const originalMessage = parseMessage(event)
						const { type, callId } = originalMessage

						if (editorOnlyHandlers.includes(type)) {
							return
						}

						const pageInfo = getMessageSourceContainerId(originalMessage)
						const contextId = pageInfo && pageInfo.contextId ? pageInfo.contextId : null
						// If its a responsive chat, the value passed in compId is the template id
						// For the chat to work properly we need to map it to the real viewer comp id (inflated)
						// But we need to do it after the context was mapped
						const compIdFromTemplate = tpaContextMapping.getTpaComponentIdFromTemplate(
							originalMessage.compId
						)

						const compId = compIdFromTemplate ?? originalMessage.compId
						const message = { ...originalMessage, compId }

						const origin = event.origin!
						if (debugApi) {
							debugApi.tpa.addMessage({ message, compId, contextId, origin })
						}

						const currentContext = currentRouteInfo.getCurrentRouteInfo()?.contextId
						const currentLightboxId = popupsLinkUtilsAPI?.getCurrentOrPendingLightboxId()
						const isPersistentPopup = await getIsPersistentPopup(pageInfo, compId)

						if (
							!contextId ||
							(contextId !== 'masterPage' &&
								!isPersistentPopup &&
								contextId !== currentContext &&
								contextId !== currentLightboxId)
						) {
							console.error('TPA handler message caller does not belong to any page', {
								type,
								callId,
								compId,
							})
							return
						}

						const pageHandlersManager = await getHandlersManagerForPage(pageInfo!)

						pageHandlersManager
							.handleMessage({ source: event.source as TpaIFrame, origin, message })
							.catch((e) => {
								console.error('HandleTpaMessageError', type, contextId, compId, e)
								logger?.captureError(e, {
									tags: { feature: 'tpa', handlerName: type },
									extra: {
										handlerName: type,
										compId,
									},
								})
							})
					},
				})
			},
		}
	}
)
