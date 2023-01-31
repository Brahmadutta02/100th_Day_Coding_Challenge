import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { PlatformEvnDataProviderSymbol } from '@wix/thunderbolt-symbols'

import { СomponentsRegistryPlatformEnvDataProvider } from './componentsRegistry'

export const site: ContainerModuleLoader = (bind) => {
	bind(PlatformEvnDataProviderSymbol).to(СomponentsRegistryPlatformEnvDataProvider)
}

export const editor: ContainerModuleLoader = (bind) => {
	bind(PlatformEvnDataProviderSymbol).to(СomponentsRegistryPlatformEnvDataProvider)
}

export * from './symbols'
