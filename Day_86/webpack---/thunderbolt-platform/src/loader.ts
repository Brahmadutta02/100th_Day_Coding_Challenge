import {
	LifeCycle,
	PlatformEvnDataProviderSymbol,
	PlatformViewportAPISym,
	PlatformWorkerPromiseSym,
	SamePageUrlChangeListenerSymbol,
	StoresProviderSymbol,
	WixCodeSdkHandlersProviderSym,
} from '@wix/thunderbolt-symbols'
import { PlatformInitializerSym, UnfinishedTasksManagerSymbol } from './symbols'
import type { PlatformInitializer } from './types'
import { Platform } from './platform'
import { ContainerModuleLoader, FactoryWithDependencies } from '@wix/thunderbolt-ioc'
import { Storage } from './storage/storage'
import * as platformEnvDataProviders from './platformEnvData/platformEnvData'
import { biEnvDataProvider } from './platformEnvData/biEnvDataProvider'
import { locationEnvDataProvider } from './platformEnvData/locationEnvDataProvider'
import { siteAssetsEnvDataProvider } from './platformEnvData/siteAssetsEnvDataProvider'
import { platformHandlersProvider } from './handlers/platformHandlers'
import { platformViewportAPI } from './handlers/viewportHandlers'
import { WarmupDataEnricherSymbol } from 'feature-warmup-data'
import { platformUrlManager } from './handlers/platformUrlManager'
import { storesSdkHandlersProvider } from './handlers/storesSdkHandlersProvider'
import { unfinishedTasksHandlersProvider } from './handlers/unfinishedTasksHandlersProvider'

export function createLoaders(platformInitializer: FactoryWithDependencies<PlatformInitializer>): { site: ContainerModuleLoader } {
	return {
		site: (bind) => {
			bind(WixCodeSdkHandlersProviderSym, UnfinishedTasksManagerSymbol).to(unfinishedTasksHandlersProvider)
			bind(LifeCycle.AppWillLoadPageHandler).to(Platform)
			bind(WixCodeSdkHandlersProviderSym, PlatformEvnDataProviderSymbol).to(Storage)
			bind(WixCodeSdkHandlersProviderSym).to(platformHandlersProvider)
			bind(WixCodeSdkHandlersProviderSym, StoresProviderSymbol).to(storesSdkHandlersProvider)
			bind(PlatformViewportAPISym, LifeCycle.AppWillLoadPageHandler).to(platformViewportAPI)
			bind(PlatformEvnDataProviderSymbol).to(locationEnvDataProvider)
			bind(PlatformEvnDataProviderSymbol).to(biEnvDataProvider)
			bind(PlatformEvnDataProviderSymbol).to(siteAssetsEnvDataProvider)
			bind(WixCodeSdkHandlersProviderSym, SamePageUrlChangeListenerSymbol).to(platformUrlManager)
			Object.values(platformEnvDataProviders).forEach((envDataProvider) => {
				bind(PlatformEvnDataProviderSymbol).to(envDataProvider)
			})
			if (process.env.browser) {
				bind(PlatformInitializerSym, LifeCycle.AppWillRenderFirstPageHandler).to(platformInitializer)
				bind(PlatformWorkerPromiseSym).toConstantValue(require('./client/create-worker'))
			} else {
				bind(PlatformInitializerSym, WarmupDataEnricherSymbol).to(platformInitializer)
			}
		},
	}
}
