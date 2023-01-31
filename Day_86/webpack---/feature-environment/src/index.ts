import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { EnvFactory } from './env'
import { LifeCycle } from '@wix/thunderbolt-symbols'

export const site: ContainerModuleLoader = (bind) => {
	bind(LifeCycle.AppWillMountHandler).to(EnvFactory)
}

export const editor = site
