import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { LifeCycle, TpaHandlerProviderSymbol } from '@wix/thunderbolt-symbols'
import { ReporterSymbol } from './symbols'
import { Reporter } from './reporter'
import { ReporterInit } from './reporter-init'
import { ReporterNavigationHandler } from './reporter-navigation-handler'
import { TrackEventHandler } from './track-event-handler'

export const site: ContainerModuleLoader = (bind) => {
	if (process.env.browser) {
		bind(ReporterSymbol).to(Reporter)
		bind(LifeCycle.AppWillMountHandler).to(ReporterInit)
	}
}

export const page: ContainerModuleLoader = (bind) => {
	if (process.env.browser) {
		bind(LifeCycle.PageDidMountHandler).to(ReporterNavigationHandler)
		bind(TpaHandlerProviderSymbol).to(TrackEventHandler)
	}
}

export * from './types'
export * from './symbols'
