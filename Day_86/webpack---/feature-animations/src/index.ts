import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { Animations, name, EditorAnimationsSym } from './symbols'

import { LifeCycle, WixCodeSdkHandlersProviderSym } from '@wix/thunderbolt-symbols'
import { AnimationsInit } from './animationsInit'
import { wixCodeHandlersProvider } from './wixCode/wixCodeHandlersProvider'

export const page: ContainerModuleLoader = (bind) => {
	bind(Animations, LifeCycle.PageWillMountHandler).to(AnimationsInit)
	bind(WixCodeSdkHandlersProviderSym).to(wixCodeHandlersProvider)
}

export * from './types'
export { Animations, name, EditorAnimationsSym }
