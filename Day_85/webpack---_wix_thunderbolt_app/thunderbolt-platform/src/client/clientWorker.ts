import 'proxy-polyfill'
import './queueMicrotaskPollyfill'
import type { IPlatformLogger } from '@wix/thunderbolt-symbols'
import { expose, Remote } from 'comlink/dist/esm/comlink.js' // eslint-disable-line no-restricted-syntax
import type { PlatformClientWorkerAPI, InvokeViewerHandler } from '../core/types'
import { createCommonWorker } from '../worker-commons/clientWorker'
import { siteAssetsClientWorkerAdapter } from './initSiteAssetsClient'
import { fetchModelsFactory } from '../fetchModelsFactory'

const { initPlatformOnSite, runPlatformOnPage } = createCommonWorker()

const platformClientWorkerAPI = {
	initPlatformOnSite,
	runPlatformOnPage: (bootstrapData, invokeViewerHandler: Remote<InvokeViewerHandler>) => {
		function modelsProviderFactory(logger: IPlatformLogger) {
			const siteAssetsClient = siteAssetsClientWorkerAdapter(bootstrapData.platformEnvData, logger, self.fetch)
			return fetchModelsFactory({ siteAssetsClient, bootstrapData, logger })
		}

		return runPlatformOnPage({
			bootstrapData,
			invokeViewerHandler,
			modelsProviderFactory,
		})
	},
} as PlatformClientWorkerAPI

expose(platformClientWorkerAPI)
