import { ContainerModuleLoader, multi, named, withDependencies } from '@wix/thunderbolt-ioc'
import { LifeCycle, PageFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import { PageWillMountPropsExtender } from './pageWillMountPropsExtender'
import { ComponentWillMountFactory } from './componentWillMount'
import { viewerComponentProvider } from './componentsFactory'
import { BaseTraitSymbol, ComponentDriverProviderSymbol, ComponentDriverSymbol } from './symbols'
import { groupByMultipleComponentTypes } from './groupByMultipleComponentTypes'
import { EventsTraitFactory } from './traits/eventsTrait'
import { PropsTraitFactory } from './traits/propsTrait'
import { StylesTraitFactory } from './traits/stylesTrait'
import { CompRefTraitFactory } from './traits/compRefTrait'

export const page: ContainerModuleLoader = (bind) => {
	const ComponentProviderFactory = withDependencies(
		[multi(BaseTraitSymbol), multi(ComponentDriverSymbol), named(PageFeatureConfigSymbol, '__componentsConfig__')],
		viewerComponentProvider
	)
	bind(LifeCycle.PageWillMountHandler).to(PageWillMountPropsExtender)
	bind(LifeCycle.PageWillMountHandler, LifeCycle.PageWillUnmountHandler).to(ComponentWillMountFactory)
	bind(ComponentDriverProviderSymbol).to(ComponentProviderFactory)
	bind(BaseTraitSymbol).to(EventsTraitFactory)
	bind(BaseTraitSymbol).to(StylesTraitFactory)
	bind(BaseTraitSymbol).to(PropsTraitFactory)
	bind(BaseTraitSymbol).to(CompRefTraitFactory)
}

export const editor: ContainerModuleLoader = (bind) => {
	const ComponentProviderFactory = withDependencies(
		[multi(BaseTraitSymbol), multi(ComponentDriverSymbol)],
		viewerComponentProvider
	)
	bind(ComponentDriverProviderSymbol).to(ComponentProviderFactory)
	bind(BaseTraitSymbol).to(EventsTraitFactory)
	bind(BaseTraitSymbol).to(StylesTraitFactory)
	bind(BaseTraitSymbol).to(PropsTraitFactory)
	bind(BaseTraitSymbol).to(CompRefTraitFactory)
}

export const editorPage: ContainerModuleLoader = (bind) => {
	bind(LifeCycle.PageWillMountHandler, LifeCycle.PageWillUnmountHandler).to(ComponentWillMountFactory)
}

export { groupByMultipleComponentTypes }

export {
	ComponentPropsExtenderSymbol,
	ComponentDriverProviderSymbol,
	ComponentWillMountSymbol,
	ComponentDriverSymbol,
	ComponentsStoreSymbol,
	BaseTraitSymbol,
} from './symbols'

export type {
	IComponentPropsExtender,
	ViewerComponent,
	ViewerComponentProvider,
	ComponentWillMount,
	ComponentDriverFactory,
	ComponentsStore,
	TraitProvider,
	ComponentWillMountReturnType,
} from './types'
