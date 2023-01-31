import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { ScreenInInitCallbackFactory } from './screenInInitCallbackFactory'
import { ScreenInInit } from './screenInInit'
import { LifeCycle } from '@wix/thunderbolt-symbols'
import { ScreenInInitCallbackSymbol } from './symbols'

export type { AnimationDef, Actions, ViewMode, IScreenInAPI } from './types'
export { ScreenInAPISymbol } from './symbols'

export const page: ContainerModuleLoader = (bind) => {
	bind(ScreenInInitCallbackSymbol).to(ScreenInInitCallbackFactory)
	bind(LifeCycle.PageWillMountHandler, LifeCycle.PageWillUnmountHandler).to(ScreenInInit)
}
