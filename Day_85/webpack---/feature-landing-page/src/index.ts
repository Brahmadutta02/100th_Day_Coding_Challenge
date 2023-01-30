import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { LifeCycle } from '@wix/thunderbolt-symbols'
import { LandingPage, LandingPageAPI } from './landingPage'
import { LandingPageAPISymbol } from './symbols'

export const page: ContainerModuleLoader = (bind) => {
	bind(LifeCycle.PageWillMountHandler).to(LandingPage)
	bind(LandingPageAPISymbol).to(LandingPageAPI)
}
