import { ContainerModuleLoader, withDependencies } from '@wix/thunderbolt-ioc'
import { getStore } from './stores'
import { AppMaterializer, MaterializedStore } from './materializedStore'

import { CompRefs } from './compRefs'
import { CompEventsRegistrar } from './compEventsRegistrar'
import { CompsLifeCycle } from './compsLifeCycle'
import {
	AppStructure,
	PropsMap,
	CompActions,
	IStructureStore,
	Structure,
	IPropsStore,
	Props,
	ICompActionsStore,
	CompActionsSym,
	IRendererPropsExtender,
	RendererPropsExtenderSym,
	CompsLifeCycleSym,
	CompEventsRegistrarSym,
	ICompsLifeCycle,
	ICompEventsRegistrar,
	CompRefAPISym,
	IStylesStore,
	StylesStoreSymbol,
	StylesMap,
	BeckyPropsInitialStoreSym,
	StateRefsStoreSymbol,
	IStateRefsStore,
	MaterializedStoreSymbol,
	IMaterializedStore,
	StateRefsMap,
	AppMaterializerSymbol,
} from '@wix/thunderbolt-symbols'
import { ComponentsStoreSymbol } from 'feature-components'
import { Materializer } from '@wix/materializer'

export { Structure }

const rendererPropsExtender = withDependencies(
	[Structure, Props, StylesStoreSymbol, CompsLifeCycleSym, CompEventsRegistrarSym, StateRefsStoreSymbol],
	(
		structureStore: IStructureStore,
		propsStore: IPropsStore,
		stylesStore: IStylesStore,
		compsLifeCycle: ICompsLifeCycle,
		compEventsRegistrar: ICompEventsRegistrar,
		stateRefs: IStateRefsStore
	): IRendererPropsExtender => {
		return {
			async extendRendererProps() {
				return {
					styles: stylesStore,
					structure: structureStore,
					props: propsStore,
					compsLifeCycle,
					compEventsRegistrar,
					stateRefs,
				}
			},
		}
	}
)

export const site: ContainerModuleLoader = (bind) => {
	const structure = getStore<AppStructure>()
	const props = getStore<PropsMap>()
	const compActions = getStore<CompActions>()
	// this store is responsible for storing component onload styles as well as platform style overrides
	const styles = getStore<StylesMap>()
	const components = getStore()

	// Serializable
	bind<Materializer>(AppMaterializerSymbol).to(AppMaterializer)
	bind<IMaterializedStore>(MaterializedStoreSymbol).to(MaterializedStore)
	const stateRefs = withDependencies([MaterializedStoreSymbol], (materializer: IMaterializedStore) =>
		materializer.createContextBasedStore<StateRefsMap>('stateRefs')
	)

	bind<IStructureStore>(Structure).toConstantValue(structure)
	bind<IStateRefsStore>(StateRefsStoreSymbol).to(stateRefs)
	bind<IPropsStore>(Props).toConstantValue(props)
	bind<IStylesStore>(StylesStoreSymbol).toConstantValue(styles)
	bind(ComponentsStoreSymbol).toConstantValue(components)

	// Not Serializable
	bind<ICompActionsStore>(CompActionsSym).toConstantValue(compActions)

	bind(CompRefAPISym).to(CompRefs)
	bind(CompEventsRegistrarSym).to(CompEventsRegistrar)
	bind(CompsLifeCycleSym).to(CompsLifeCycle)
	bind<IRendererPropsExtender>(RendererPropsExtenderSym).to(rendererPropsExtender)
}

export const editor: ContainerModuleLoader = (bind) => {
	const beckyPropsInitialStore = getStore<PropsMap>()
	bind<IPropsStore>(BeckyPropsInitialStoreSym).toConstantValue(beckyPropsInitialStore)

	site(bind)
}
