import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { Navigation } from './navigation'
import { NavigationSymbol } from './symbols'
import type { INavigation } from './types'
import { ShouldNavigateHandler } from './shouldNavigateHandler'
import { ShouldNavigateHandlerSymbol } from 'feature-router'

export const page: ContainerModuleLoader = (bind) => {
	bind(NavigationSymbol).to(Navigation)
	bind(ShouldNavigateHandlerSymbol).to(ShouldNavigateHandler)
}

export const editor: ContainerModuleLoader = (bind) => {
	bind(NavigationSymbol).to(Navigation)
}

// Public Types
export { INavigation }

// Public Symbols
export { NavigationSymbol }
