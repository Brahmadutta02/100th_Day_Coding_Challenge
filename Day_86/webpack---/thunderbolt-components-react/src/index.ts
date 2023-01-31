import { ComponentsRegistrarSymbol } from '@wix/thunderbolt-components-loader'
import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { ComponentsRegistrar } from './components/componentsRegistrar'

export { defineRepeaterCustomElement } from './components/FluidColumnsRepeater/fluid-columns-repeater'

export const site: ContainerModuleLoader = (bind) => {
	bind(ComponentsRegistrarSymbol).to(ComponentsRegistrar)
}

export const editor = site
