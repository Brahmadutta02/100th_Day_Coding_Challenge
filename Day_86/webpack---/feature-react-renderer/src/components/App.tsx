import StructureComponent from './StructureComponent'
import { AppContextProvider } from './AppContext'
import React, { Fragment, useEffect } from 'react'
import { AppProps, RendererProps } from '../types'
import { extendStoreWithSubscribe } from './extendStoreWithSubscribe'
import { IPropsStore, IStructureStore, IStylesStore } from '@wix/thunderbolt-symbols'
import ComponentsStylesOverrides from './ComponentsStylesOverrides'

function App({
	structure,
	props,
	styles,
	compsLifeCycle,
	compEventsRegistrar,
	comps,
	compControllers,
	logger,
	translate,
	batchingStrategy,
	onDidMount = () => {},
	contextCallbackRef = () => {},
	layoutDoneService,
	stateRefs,
	rootCompId,
	getCompBoundedUpdateProps,
	getCompBoundedUpdateStyles,
	BaseComponent,
}: AppProps) {
	const contextValue: RendererProps = {
		structure: extendStoreWithSubscribe<IStructureStore>(structure, batchingStrategy, layoutDoneService),
		props: extendStoreWithSubscribe<IPropsStore>(props, batchingStrategy, layoutDoneService),
		stateRefs: extendStoreWithSubscribe<IPropsStore>(stateRefs, batchingStrategy, layoutDoneService),
		styles: extendStoreWithSubscribe<IStylesStore>(styles, batchingStrategy),
		compsLifeCycle,
		compEventsRegistrar,
		logger,
		comps,
		compControllers,
		translate,
		getCompBoundedUpdateProps,
		getCompBoundedUpdateStyles,
		BaseComponent,
	}

	useEffect(onDidMount, [onDidMount])

	return (
		<Fragment>
			<AppContextProvider initialContextValue={contextValue} ref={contextCallbackRef}>
				<ComponentsStylesOverrides />
				<StructureComponent
					key={rootCompId}
					id={rootCompId}
					scopeData={{ scope: [], repeaterItemsIndexes: [] }}
				/>
			</AppContextProvider>
		</Fragment>
	)
}

export default App
