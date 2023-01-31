import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { ScrollRestoration } from './scrollRestoration'
import { LifeCycle } from '@wix/thunderbolt-symbols'
import { FullScreenScrollRestoration } from './fullScreenScrollRestoration'
import { ScrollRestorationAPI } from './scrollRestorationAPI'
import { ScrollRestorationAPISymbol } from './symbols'

export const site: ContainerModuleLoader = (bind) => {
	bind(LifeCycle.AppDidMountHandler).to(FullScreenScrollRestoration)
	bind(ScrollRestorationAPISymbol).to(ScrollRestorationAPI)
}

export const page: ContainerModuleLoader = (bind) => {
	bind(LifeCycle.PageDidUnmountHandler).to(ScrollRestoration)
}

export const editor = site

export const editorPage = page

export { ScrollRestorationAPISymbol } from './symbols'
export type { IScrollRestorationAPI } from './types'
