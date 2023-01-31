import { flatten } from 'lodash'
import { withDependencies, multi } from '@wix/thunderbolt-ioc'
import {
	IPageWillMountHandler,
	IPageWillUnmountHandler,
	IPageAssetsLoader,
	PageAssetsLoaderSymbol,
	pageIdSym,
} from '@wix/thunderbolt-symbols'
import type { ViewerComponent, ComponentWillMount, ComponentsStore } from './types'
import { ComponentWillMountSymbol, ComponentsStoreSymbol } from './symbols'
import { groupByMultipleComponentTypes } from './groupByMultipleComponentTypes'

const componentWillMountOnPageWillMount = (
	componentWillMountArray: Array<ComponentWillMount<ViewerComponent>>,
	componentsStore: ComponentsStore,
	pageAssetsLoader: IPageAssetsLoader,
	pageId: string
): IPageWillMountHandler & IPageWillUnmountHandler => {
	let onPageWillUnmount: () => void = () => {}
	return {
		name: 'componentWillMount',
		async pageWillMount() {
			const pageStructure = await pageAssetsLoader.load(pageId).components

			const componentWillMountByCompType = groupByMultipleComponentTypes(componentWillMountArray)

			const componentWillUnmount = await Promise.all(
				flatten(
					Object.entries(pageStructure).map(([compId, { componentType }]) => {
						if (!componentWillMountByCompType[componentType]) {
							return null
						}

						const component = componentsStore.get<ViewerComponent>(compId)
						const all = componentWillMountByCompType[componentType].map(({ componentWillMount }) =>
							componentWillMount(component)
						)

						return all
					})
				)
			)

			onPageWillUnmount = () => componentWillUnmount.forEach((x) => x?.())
		},
		pageWillUnmount: () => {
			onPageWillUnmount()
		},
	}
}

export const ComponentWillMountFactory = withDependencies(
	[multi(ComponentWillMountSymbol), ComponentsStoreSymbol, PageAssetsLoaderSymbol, pageIdSym],
	componentWillMountOnPageWillMount
)
