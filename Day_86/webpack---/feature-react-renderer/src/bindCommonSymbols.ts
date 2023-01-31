import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { LifeCycle, HeadContentSymbol, ComponentsStylesOverridesSymbol } from '@wix/thunderbolt-symbols'
import { RendererPropsProviderSym } from '.'
import { PageMountUnmountSubscriber } from './clientRenderer/pageMountUnmountSubscriber'
import { ComponentsStylesOverrides } from './ComponentsStylesOverrides'
import { HeadContent } from './HeadContent'
import { RendererPropsProvider } from './RendererPropsProvider'

export const bindCommonSymbols: ContainerModuleLoader = (bind) => {
	bind(RendererPropsProviderSym).to(RendererPropsProvider)
	bind(HeadContentSymbol).to(HeadContent)
	bind(LifeCycle.AppWillLoadPageHandler).to(PageMountUnmountSubscriber)
	bind(ComponentsStylesOverridesSymbol).to(ComponentsStylesOverrides)
}
