import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { NavigationPhases } from './navigationPhases'
import { NavigationPhasesSymbol } from './symbols'

export const site: ContainerModuleLoader = (bind) => {
	bind(NavigationPhasesSymbol).to(NavigationPhases)
}

export const editor = site

export * from './types'
export * from './symbols'
