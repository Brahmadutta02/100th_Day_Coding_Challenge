import { withDependencies, named, multi, optional } from '@wix/thunderbolt-ioc'
import {
	BrowserWindowSymbol,
	IPropsStore,
	PageFeatureConfigSymbol,
	Props,
	SiteFeatureConfigSymbol,
	TpaHandlerExtras,
	TpaHandlerProvider,
	TpaHandlerProviderSymbol,
	TpaHandlers,
	TpaIFrame,
	ViewerModel,
	ViewerModelSym,
} from '@wix/thunderbolt-symbols'
import type { BaseResponse, TpaPageConfig } from './types'
import { name as tpaFeatureName } from './symbols'
import { ITpaHandlersManager, name as tpaCommonsName, TpaCommonsSiteConfig } from 'feature-tpa-commons'
import { runtimeTpaCompIdBuilder } from '@wix/thunderbolt-commons'
import { TbDebugSymbol, DebugApis } from 'feature-debug'
import { TpaWorkerSymbol, ITpaWorker } from 'feature-tpa-worker'
import { TPA_HANDLER_EMPTY_RESPONSE } from './utils/constants'

export const TpaHandlersManager = withDependencies(
	[
		named(SiteFeatureConfigSymbol, tpaCommonsName),
		named(PageFeatureConfigSymbol, tpaFeatureName),
		multi(TpaHandlerProviderSymbol),
		Props,
		BrowserWindowSymbol,
		ViewerModelSym,
		optional(TpaWorkerSymbol),
		optional(TbDebugSymbol),
	],
	(
		siteConfig: TpaCommonsSiteConfig,
		tpaPageConfig: TpaPageConfig,
		handlerProviders: Array<TpaHandlerProvider>,
		propsStore: IPropsStore,
		window: Window,
		{ mode: { debug } }: ViewerModel,
		tpaWorker?: ITpaWorker,
		debugApi?: DebugApis
	): ITpaHandlersManager => {
		const { appsClientSpecMapData } = siteConfig

		const sendResponseTPA = ({
			tpa,
			origin,
			callId,
			status,
			res,
			compId,
		}: {
			tpa: TpaIFrame
			origin: string
			callId: string
			status: boolean
			res: any
			compId: string
		}) => {
			const message: BaseResponse<any> = {
				callId,
				intent: 'TPA_RESPONSE',
				status,
				res,
			}
			if (debugApi) {
				debugApi.tpa.addMessage({ message, compId, contextId: tpaPageConfig.pageId, origin })
			}
			tpa.postMessage(JSON.stringify(message), '*')
		}

		const handlers: TpaHandlers = Object.assign(
			{},
			...handlerProviders.map((provider) => provider.getTpaHandlers())
		)

		const isEditorOrigin = (origin: string) =>
			origin === 'https://editor.wix.com' ||
			origin === 'https://create.editorx.com' ||
			origin === 'https://blocks.wix.com'

		const isTestOrigin = (origin: string) =>
			process.env.NODE_ENV === 'test' &&
			(origin === 'test' || origin === 'https://sled.wix.dev' || origin === 'http://localhost')

		const isMessageMatchingComponentOrigin = (compSrc: URL | null, origin: string) => compSrc?.origin === origin

		const isMessageMatchingComponentDeviceType = (compSrc: URL | null, messageDeviceType: string) => {
			const compSrcDeviceType = compSrc?.searchParams.get('deviceType')
			return !messageDeviceType || messageDeviceType === compSrcDeviceType
		}

		const getComponentSrcUrlObj = (compId: string) => {
			const src = propsStore.get(compId)?.src || propsStore.get(compId)?.url
			if (!src) {
				return null
			}

			return new URL(src)
		}

		return {
			async handleMessage({ source: tpa, origin, message }) {
				const { type, callId, compId, data, deviceType, originFrame } = message
				const compSrc = getComponentSrcUrlObj(compId)

				if (
					origin !== 'https://static.parastorage.com' && // pass through TPA galleries
					!isMessageMatchingComponentOrigin(compSrc, origin) &&
					!isEditorOrigin(origin) &&
					!isTestOrigin(origin)
				) {
					// PLAT-1303 security. we don't want to handle messages from one widget pretending to be another widget.
					debug && console.warn('discarded tpa message: untrusted origin', { origin, message })
					return
				}

				if (
					process.env.PACKAGE_NAME === 'thunderbolt-ds' &&
					originFrame !== 'editor' && // pass through messages from setting panels
					!isMessageMatchingComponentDeviceType(compSrc, deviceType)
				) {
					debug &&
						console.warn('discarded tpa message: deviceType does not match tpa src', {
							deviceType,
							message,
						})
					return
				}

				const handler = handlers[type]
				if (!handler) {
					debug && console.warn(`TpaHandlerError: ${type} handler is not implemented`)
					return
				}

				const originCompId = runtimeTpaCompIdBuilder.getOriginCompId(compId)
				const tpaCompData = tpaPageConfig.widgets[originCompId]
				const isTpaWorker = tpaWorker?.isTpaWorker(compId)
				const workerDetails = isTpaWorker ? tpaWorker!.getWorkerDetails(compId) : null
				const appDefinitionId = isTpaWorker ? workerDetails!.appDefinitionId : tpaCompData?.appDefinitionId

				const extras: TpaHandlerExtras = {
					callId,
					tpa,
					appDefinitionId,
					tpaCompData,
					appClientSpecMapData: appsClientSpecMapData[appDefinitionId],
					originCompId,
					viewMode: siteConfig.viewMode,
				}

				const result = handler(compId, data, extras)
				if (typeof result === 'undefined') {
					// the api which invokes the handler does not have an onSuccess / onFailure callback
					return
				}

				try {
					const res = await result
					if (res === TPA_HANDLER_EMPTY_RESPONSE) {
						// for tpa handlers with no onSuccess callback but only onFailure callback,
						// we want to send a response (i.e trigger the callback) only if the handler rejected.
						return
					}
					sendResponseTPA({ tpa, origin, callId, compId, status: true, res })
				} catch (e) {
					const { message: errorMessage, name, stack } = e
					sendResponseTPA({
						tpa,
						origin,
						callId,
						compId,
						status: false,
						res: { error: { message: errorMessage, name, stack } },
					})
				}
			},
		}
	}
)
