import _ from 'lodash'
import { proxy, releaseProxy, Remote } from 'comlink/dist/esm/comlink.js' // eslint-disable-line no-restricted-syntax
import type { IPlatformLogger } from '@wix/thunderbolt-symbols'
import { manager as biLoggersManager } from '@wix/fe-essentials-viewer-platform/bi'
import type { Logger } from '@wix/fe-essentials-viewer-platform/bi'
import type { fetchModels, InvokeViewerHandler, PlatformWorkerCommonApi, ScriptCache } from '../core/types'
import type { BootstrapData } from '../types'
import { initWorkerOnSite, runWorkerOnPage } from '../core/worker'
import { clearTimeouts } from '../client/timeoutsManager'
import moduleLoaderFactory from '../core/loadModules'
import SessionServiceFactory from '../core/sessionService'
import { PlatformDebugApiFactory } from '../core/debug'
import { createDeepProxy } from '../deepProxyUtils'
import { platformUpdatesFunctionsNames } from '../constants'
import { InvokeSiteHandler } from '../core/types'
import { PlatformPerformanceStore } from '../core/bi/PlatformPerformanceStore'

class PlatformError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'PlatformError' // for grouping the errors in the rollout grafana
	}
}
const scriptsCache: ScriptCache = {}

const sendWorkerPerformanceEntries = () => {
	const workerPerformanceEntries = self.performance.getEntries()
	const workerStartTime = self.performance.timeOrigin
	self.postMessage({ type: 'workerPerformanceData', data: { performanceEntries: JSON.parse(JSON.stringify(workerPerformanceEntries)), workerStartTime } })
}

self.addEventListener('message', (messageEvent) => {
	switch (messageEvent.data?.type) {
		case 'PerformanceTool':
			sendWorkerPerformanceEntries()
			break
		case 'platformScriptsToPreload':
			const moduleLoader = moduleLoaderFactory({ scriptsCache })
			_(messageEvent.data.appScriptsUrls)
				.values()
				.flatten()
				.each((url: string) => moduleLoader.loadModule(url))
			break
		default:
			return
	}
})

const originalConsoleProperties = { ...self.console }
const restoreOriginalConsoleProperties = () => Object.assign(self.console, originalConsoleProperties)

export function createCommonWorker(): PlatformWorkerCommonApi {
	const webBiLoggers: Array<Logger> = []
	// @ts-ignore
	biLoggersManager.onLoggerCreated((logger: Logger) => webBiLoggers.push(logger))

	function initPlatformOnSite(bootstrapData: BootstrapData, invokeSiteHandler: InvokeSiteHandler) {
		restoreOriginalConsoleProperties()
		initWorkerOnSite(bootstrapData, (path: string, ...args: Array<unknown>) => invokeSiteHandler(path, ...args.map((arg) => (_.isFunction(arg) ? proxy(arg as never) : arg))))
	}

	const releasedInvokeViewerHandlers = new WeakMap()

	type PageState = {
		currentContextId: string
		uniqueContextId: string
		invokeViewerHandlers: Array<Remote<InvokeViewerHandler>>
		pageWillUnmountListeners: Array<Function>
	}

	// TODO make this a proper factory instance
	const pageState: PageState = {
		currentContextId: '',
		uniqueContextId: '',
		invokeViewerHandlers: [],
		pageWillUnmountListeners: [],
	}

	// TODO make this a proper factory instance
	const lightboxState: PageState = {
		currentContextId: '', // TODO clear this state once the lightbox is closed
		uniqueContextId: '', // TODO clear this state once the lightbox is closed
		invokeViewerHandlers: [],
		pageWillUnmountListeners: [],
	}

	async function runPlatformOnPage({
		bootstrapData,
		invokeViewerHandler,
		modelsProviderFactory,
	}: {
		bootstrapData: BootstrapData
		invokeViewerHandler: Remote<InvokeViewerHandler>
		modelsProviderFactory: (logger: IPlatformLogger) => fetchModels
	}) {
		const {
			currentPageId,
			currentContextId,
			platformEnvData: {
				bi: {
					pageData: { isLightbox, pageNumber },
				},
				site: {
					mode: { debug },
				},
			},
		} = bootstrapData

		const uniqueContextId = `${currentContextId}_${_.uniqueId()}`
		const state = isLightbox ? lightboxState : pageState

		// at a single point of time, one page and optionally one lightbox may be rendered.
		// upon rendering a new page/lightbox, previous page/lightbox state is cleaned up.
		state.pageWillUnmountListeners.forEach((cb) => cb())
		state.pageWillUnmountListeners.length = 0

		state.currentContextId = currentContextId
		state.uniqueContextId = uniqueContextId
		state.invokeViewerHandlers.push(invokeViewerHandler)

		if (!isLightbox) {
			// TODO those should be cleaned up upon closing the lightbox
			lightboxState.currentContextId = ''
			lightboxState.uniqueContextId = ''

			if (pageNumber > 1) {
				// bi loggers are flushing themselves with timeouts. we need to explicitly flush and await them to
				// avoid destroying their batching with clearTimeouts().
				await Promise.all(webBiLoggers.map((logger) => logger.flush()))
				webBiLoggers.length = 0
				// clear timeouts on navigation.
				// TODO we should probably clear the timeouts only after finishing running applications.
				// TODO PLAT-1309 this should be done per also when lightbox closes
				clearTimeouts()
			}
		}

		// TODO this is a quick fix to prevent master page callbacks being triggered after navigations.
		// the proper fix would be "proxy[releaseProxy]()"ing the callbacks from the main thread, in platform.ts.
		const discardStaleCallbackExecution = (cb: Function, path: Array<string>) => (...args: Array<never>) =>
			// live preview callbacks pass through because we should be able to invoke them even after subsequent live preview runs with different apps/controllers.
			// their reference is cleaned up in platformControllerHandlers upon navigation. in the future we should also proxy[releaseProxy]() them.
			pageState.uniqueContextId === uniqueContextId || lightboxState.uniqueContextId === uniqueContextId || path[0] === 'controllers'
				? cb(...args)
				: debug
				? Promise.reject(new PlatformError('rejected handling callbacks from stale contexts'))
				: Promise.resolve()

		const debugApi = debug ? PlatformDebugApiFactory() : undefined
		const arrayOfUpdatePromises: Array<Promise<any> | void> = []
		const invokeViewerHandlerWrapper: InvokeViewerHandler = (pageId, path, ...args) => {
			if (args.length > 4) {
				return debug ? Promise.reject(new PlatformError('viewer platform handlers support up to 4 arguments')) : Promise.resolve()
			}
			if (debugApi && path[0] !== 'unfinishedTasks') {
				debugApi.logPlatformOperation(`${path.join('.')}`, ...args)
			}
			const proxiedArgs = debugApi
				? args.map((arg: never, index: number) => {
						return _.isFunction(arg) ? proxy(debugApi.wrapFunctionArg(discardStaleCallbackExecution(arg, path) as never, path, index)) : arg
				  })
				: args.map((arg: never) => {
						return _.isFunction(arg) ? proxy(discardStaleCallbackExecution(arg, path) as never) : arg
				  })

			if (
				// TODO when we install Wix Site Search, there's a page navigation to the search results page + ds calls live preview refreshAppsInCurrentPage() api.
				// this causes a double platform execution for the same context. for some reason both need to succeed, so we compare context ids and not unique context ids.
				// consider deferring platform / figuring out why refreshAppsInCurrentPage() is invoked.
				// slack: https://wix.slack.com/archives/CFJN2R83D/p1647178992366759?threadstate.ts=1643737831.285829&cid=CFJN2R83D
				(pageState.currentContextId !== currentContextId && lightboxState.currentContextId !== currentContextId) ||
				releasedInvokeViewerHandlers.get(invokeViewerHandler)
			) {
				// this condition prevents unintended main thread reactions upon stale events.
				// if a released comlink proxy is invoked it explodes, so we need this explicit condition here.
				return debug ? Promise.reject(new PlatformError('rejected handling api invocations from stale contexts')) : Promise.resolve()
			}

			const promise = invokeViewerHandler(pageId, path, proxiedArgs[0], proxiedArgs[1], proxiedArgs[2], proxiedArgs[3])

			const functionName = _.last(path) as string
			if (platformUpdatesFunctionsNames.includes(functionName)) {
				arrayOfUpdatePromises.push(promise)
			}

			return promise
		}

		const onPageWillUnmount: (cb: Function) => void = (cb) => {
			state.pageWillUnmountListeners.push(cb || _.noop) // onPageWillUnmount can be invoked when the context is already stale, in this case the cb may be undefined
		}

		const sessionService = SessionServiceFactory({
			platformEnvData: bootstrapData.platformEnvData,
			handlers: createDeepProxy((path: Array<string>) => (...args: Array<never>) => invokeViewerHandlerWrapper(currentPageId, path, ...args)),
			onPageWillUnmount,
		})

		try {
			await runWorkerOnPage({
				invokeViewerHandler: invokeViewerHandlerWrapper,
				bootstrapData,
				modelsProviderFactory,
				scriptsCache,
				sessionService,
				debugApi,
				onPageWillUnmount,
				platformPerformanceStore: PlatformPerformanceStore(),
			})
		} finally {
			// when running runPlatformOnPage() in live preview context, only a subset of apps/controllers run.
			// we need to maintain the ability for other apps/controllers to interact with the viewer.
			// TODO: don't runPlatformOnPage() in live preview context, instead, run specific lifecycle apis a la triggerOnAppSettingsUpdate.
			if (_.isEmpty(bootstrapData.platformEnvData.livePreviewOptions)) {
				_(state.invokeViewerHandlers)
					.initial() // all but last
					.forEach((invokeViewerHandlersProxy) => {
						// sends a message to the main thread comlink telling it to release the event listener for the proxy.
						// prevents memory leaks on the main thread.
						invokeViewerHandlersProxy[releaseProxy]()
						releasedInvokeViewerHandlers.set(invokeViewerHandlersProxy, true)
					})
				state.invokeViewerHandlers = [_.last(state.invokeViewerHandlers)!]
			}
		}

		// wait for all prop updates to finish before resolving the main platform promise to make sure props are updated before render
		await Promise.all(arrayOfUpdatePromises)
	}

	return {
		initPlatformOnSite,
		runPlatformOnPage,
	}
}
