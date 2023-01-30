import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { PageTransitionsDidMount } from './pageTransitions'
import { PageTransitionsApi } from './pageTransitionsApi'
import { PageTransitionsCompleted } from './pageTransitionsCompleted'
import { PageTransitionsSymbol, PageTransitionsCompletedSymbol } from './symbols'
import { LifeCycle } from '@wix/thunderbolt-symbols'
import { ComponentWillMountSymbol } from 'feature-components'
import { PageComponentTransitionsWillMount } from './pageTransitionsNew'
import { PageBackgroundComponentTransitionsWillMount } from './pageBackgroundTransitions'

export const page: ContainerModuleLoader = (bind) => {
	bind(PageTransitionsCompletedSymbol).to(PageTransitionsCompleted)
	bind(PageTransitionsSymbol).to(PageTransitionsApi)
	bind(LifeCycle.PageDidMountHandler, LifeCycle.PageWillUnmountHandler).to(PageTransitionsDidMount)
	bind(ComponentWillMountSymbol).to(PageComponentTransitionsWillMount)
	bind(ComponentWillMountSymbol).to(PageBackgroundComponentTransitionsWillMount)
}

export const editorPage: ContainerModuleLoader = (bind) => {
	bind(LifeCycle.PageDidMountHandler, LifeCycle.PageWillUnmountHandler).to(PageTransitionsDidMount)
	bind(ComponentWillMountSymbol).to(PageComponentTransitionsWillMount)
	bind(ComponentWillMountSymbol).to(PageBackgroundComponentTransitionsWillMount)
}

export const editor: ContainerModuleLoader = (bind) => {
	bind(PageTransitionsSymbol).to(PageTransitionsApi)
	bind(PageTransitionsCompletedSymbol).to(PageTransitionsCompleted)
}

export { PageTransitionsSymbol, PageTransitionsCompletedSymbol }
export type { IPageTransitionsCompleted } from './IPageTransitionsCompleted'
export type { IPageTransition } from './types'
