import {
	RendererPropsExtenderSym,
	WixCodeSdkHandlersProviderSym,
	PlatformPropsSyncManagerSymbol,
} from '@wix/thunderbolt-symbols'
import type {
	ComponentLibraries,
	ComponentsLoaderRegistry,
	ComponentLoaderFunction,
	ThunderboltHostAPI,
	CompControllersRegistry,
	ComponentsRegistry,
	UpdateCompProps,
	IComponentsRegistrar,
	IWrapComponent,
	GetCompBoundedUpdateProps,
	GetCompBoundedUpdateStyles,
	ComponentModule,
	CompControllerUtils,
	CompControllerHook,
} from './types'
import { ComponentsLoaderSymbol, ComponentsRegistrarSymbol, ComponentWrapperSymbol } from './symbols'
import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { ComponentsLoaderInit } from './componentsLoaderInit'
import { ComponentsLoader } from './componentsLoader'
import type { IComponentsLoader } from './IComponentLoader'
import platformPropsSyncManager from './platformPropsSyncManager'
import { controlledComponentFactory } from './updateControlledComponentProps'
import { compControllerUtilsFactory } from './compControllerUtilsFactory'

// Public loader
export const site: ContainerModuleLoader = (bind) => {
	bind(RendererPropsExtenderSym).to(ComponentsLoaderInit)
	bind(ComponentsLoaderSymbol).to(ComponentsLoader)
	bind(WixCodeSdkHandlersProviderSym, PlatformPropsSyncManagerSymbol).to(platformPropsSyncManager)
	bind(RendererPropsExtenderSym).to(compControllerUtilsFactory)

	// TODO: TB-7121 remove this binding once we fix race condition of dynamic model / platform race condition
	bind(RendererPropsExtenderSym).to(controlledComponentFactory)
}

export const editor = site

// Public Symbols
export { ComponentsLoaderSymbol, ComponentsRegistrarSymbol, ComponentWrapperSymbol }

// Public Types
export type {
	IWrapComponent,
	IComponentsLoader,
	ComponentLibraries,
	IComponentsRegistrar,
	ComponentsLoaderRegistry,
	ComponentLoaderFunction,
	ThunderboltHostAPI,
	CompControllersRegistry,
	ComponentsRegistry,
	UpdateCompProps,
	GetCompBoundedUpdateProps,
	GetCompBoundedUpdateStyles,
	ComponentModule,
	CompControllerUtils,
	CompControllerHook,
}
