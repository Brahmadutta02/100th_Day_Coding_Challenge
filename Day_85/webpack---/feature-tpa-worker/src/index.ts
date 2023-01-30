import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { ModelUpdatesHandlersImplementor } from 'ds-feature-model-updates-invoker'
import { LifeCycle } from '@wix/thunderbolt-symbols'
import { TpaWorkerFactory } from './tpaWorker'
import { TpaWorkerFactoryDs } from './ds/tpaWorkerDs'
import { TpaWorkerSymbol } from './symbols'
import { TpaWorkerSideEffects } from './ds/tpaWorkerSideEffects'

export const site: ContainerModuleLoader = (bind) => {
	bind(LifeCycle.AppDidMountHandler, LifeCycle.AppWillLoadPageHandler, TpaWorkerSymbol).to(TpaWorkerFactory)
}

export const editor: ContainerModuleLoader = (bind) => {
	bind(TpaWorkerSymbol).to(TpaWorkerFactoryDs)
	bind(ModelUpdatesHandlersImplementor).to(TpaWorkerSideEffects)
}

export * from './types'
export { TpaWorkerSymbol }
