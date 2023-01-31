import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { LifeCycle } from '@wix/thunderbolt-symbols'
import { BackgroundScrubSymbol } from './symbols'
import { BackgroundScrub } from './backgroundScrub'
import { BackgroundScrubDestroy } from './backgroundScrubDestroy'
import { BackgroundScrubInit } from './backgroundScrubInit'
import type { IBackgroundScrub, BackgroundScrubPageConfig } from './types'

export const page: ContainerModuleLoader = (bind) => {
	bind(BackgroundScrubSymbol).to(BackgroundScrub)
	bind(LifeCycle.AppDidLoadPageHandler).to(BackgroundScrubInit)
	bind(LifeCycle.PageDidUnmountHandler).to(BackgroundScrubDestroy)
}

export { BackgroundScrubSymbol, BackgroundScrub, IBackgroundScrub, BackgroundScrubPageConfig }
