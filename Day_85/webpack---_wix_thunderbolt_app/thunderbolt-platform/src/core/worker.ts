import _ from 'lodash'
import type { FetchFn, IPlatformLogger, CommonConfig, SessionServiceAPI } from '@wix/thunderbolt-symbols'
import type { BatchedUpdateFunction, BootstrapData } from '../types'
import type { fetchModels, InvokeSiteHandler, InvokeViewerHandler, ScriptCache } from './types'
import type { PlatformDebugApi } from './debug'
import { createPlatformAPI } from './index'
import moduleLoaderFactory from './loadModules'
import { PlatformLogger } from './platformLogger'
import { fetchEval } from './fetchEval'
import { batchUpdateFactory } from './batchUpdate'
import type { PlatformPerformanceStoreType } from './bi/PlatformPerformanceStore'

declare const self: {
	importScripts: (url: string) => void
	onmessage: (msg: MessageEvent) => void
	XMLHttpRequest: any
	fetch: FetchFn
	location: Location
	commonConfig: CommonConfig
}

if (self.location && self.location.protocol === 'blob:') {
	/*  blob protocol is used to overcome CORS issue when creating WebWorker.
		fetch will not apply host protocol to requests starting with '//' when host protocol is blob so it must be fixed
		manually */
	const getAbsoluteUrl = (url: string) => {
		if (url.startsWith('//')) {
			return `https:${url}`
		}

		if (url.startsWith('/')) {
			return `${self.location.origin}${url}`
		}

		return url
	}

	const originalFetch = self.fetch.bind(self)
	// @ts-ignore
	self.fetch = (requestInfo: RequestInfo, requestInit?: RequestInit) => originalFetch(typeof requestInfo === 'string' ? getAbsoluteUrl(requestInfo) : requestInfo, requestInit)

	const originalOpen = self.XMLHttpRequest.prototype.open
	self.XMLHttpRequest.prototype.open = function (method: string, url: string, ...args: Array<never>) {
		return originalOpen.call(this, method, getAbsoluteUrl(url), ...args)
	}
}

const { initPlatformOnSite, runPlatformOnPage } = createPlatformAPI()

export function initWorkerOnSite(bootstrapData: BootstrapData, invokeSiteHandler: InvokeSiteHandler) {
	const {
		platformEnvData: { session, commonConfig },
	} = bootstrapData

	self.commonConfig = commonConfig

	const logger = PlatformLogger(
		bootstrapData,
		{
			getVisitorId: () => session.visitorId,
			getSiteMemberId: () => session.siteMemberId,
			getInstance: (instanceId) => session.applicationsInstances[instanceId].instance,
		},
		{ add: () => _.noop }
	)

	initPlatformOnSite({ logger, bootstrapData }, invokeSiteHandler)
}

export async function runWorkerOnPage({
	bootstrapData,
	invokeViewerHandler,
	scriptsCache = {},
	modelsProviderFactory,
	sessionService,
	debugApi,
	onPageWillUnmount,
	platformPerformanceStore,
}: {
	bootstrapData: BootstrapData
	invokeViewerHandler: InvokeViewerHandler
	scriptsCache?: ScriptCache
	modelsProviderFactory: (logger: IPlatformLogger) => fetchModels
	sessionService: SessionServiceAPI
	debugApi?: PlatformDebugApi
	onPageWillUnmount: (cb: Function) => void
	platformPerformanceStore: PlatformPerformanceStoreType
}) {
	const { currentPageId } = bootstrapData

	const moduleLoader = moduleLoaderFactory({ scriptsCache })

	const flushes: Array<() => void> = []
	const flushPendingUpdates = () => flushes.forEach((flush) => flush())

	const createBatchedUpdate = (updateFunc: BatchedUpdateFunction) => {
		const { batchUpdate, flushUpdates } = batchUpdateFactory(updateFunc)
		flushes.push(flushUpdates)
		return batchUpdate
	}

	const originalInvokeViewerHandler = invokeViewerHandler
	const updateProps = invokeViewerHandler.bind(null, currentPageId, ['stores', 'updateProps'])
	const updateStyles = invokeViewerHandler.bind(null, currentPageId, ['stores', 'updateStyles'])
	const updateStructure = invokeViewerHandler.bind(null, currentPageId, ['stores', 'updateStructure'])
	const batchedFunctions = {
		updateProps: createBatchedUpdate(updateProps as BatchedUpdateFunction),
		updateStyles: createBatchedUpdate(updateStyles as BatchedUpdateFunction),
		updateStructure: createBatchedUpdate(updateStructure as BatchedUpdateFunction),
	}

	invokeViewerHandler = (pageId, path, ...args) => {
		const handler = _.last(path)

		if (handler === 'updateProps' || handler === 'updateStyles' || handler === 'updateStructure') {
			return batchedFunctions[handler](args[0])
		}

		return originalInvokeViewerHandler(pageId, path, ...args)
	}

	await runPlatformOnPage({
		sessionService,
		bootstrapData,
		invokeViewerHandler,
		moduleLoader,
		importScripts: fetchEval,
		modelsProviderFactory,
		flushPendingUpdates,
		debugApi,
		onPageWillUnmount,
		platformPerformanceStore,
	})

	flushPendingUpdates()
}
