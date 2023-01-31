import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { WindowMessageRegistrar } from './windowMessageRegistrar'
import { WindowMessageRegistrarSymbol } from './symbols'
import { SsrWindowMessageRegistrar } from './ssr/windowMessageRegistrar'

export const site: ContainerModuleLoader = (bind) => {
	bind(WindowMessageRegistrarSymbol).to(process.env.browser ? WindowMessageRegistrar : SsrWindowMessageRegistrar)
}

export { WindowMessageRegistrarSymbol } from './symbols'
export type { WindowMessageConsumer, IWindowMessageRegistrar } from './types'
