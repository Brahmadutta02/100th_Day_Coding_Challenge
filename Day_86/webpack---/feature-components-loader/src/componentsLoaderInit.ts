import { withDependencies } from '@wix/thunderbolt-ioc'
import { IRendererPropsExtender } from '@wix/thunderbolt-symbols'
import { ComponentsLoaderSymbol } from './symbols'
import { IComponentsLoader } from './IComponentLoader'

const componentsLoaderInit = (componentsLoader: IComponentsLoader): IRendererPropsExtender => {
	return {
		async extendRendererProps() {
			return {
				comps: componentsLoader.getComponentsMap(),
				compControllers: componentsLoader.getCompControllersMap(),
			}
		},
	}
}

export const ComponentsLoaderInit = withDependencies([ComponentsLoaderSymbol], componentsLoaderInit)
