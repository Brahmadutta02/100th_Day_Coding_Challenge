import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { Thunderbolt } from './symbols'
import { LifeCycle } from '@wix/thunderbolt-symbols'
import { createDomReadyPromise, WaitForDomReady } from './DomReady'
import { thunderboltFactory } from './thunderbolt'

export const site: ContainerModuleLoader = (bind) => {
	bind(Thunderbolt).to(thunderboltFactory)
	bind(LifeCycle.AppWillMountHandler).to(WaitForDomReady)
}

export * from './types'
export { createDomReadyPromise }
export { getThunderboltInitializer } from './thunderboltInitializer'
