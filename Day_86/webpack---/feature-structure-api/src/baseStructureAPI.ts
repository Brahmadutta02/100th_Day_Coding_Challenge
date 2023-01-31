import {
	IBaseStructureAPI,
	IPageAssetsLoader,
	IStructureStore,
	PageAssetsLoaderSymbol,
	Structure,
} from '@wix/thunderbolt-symbols'
import { withDependencies } from '@wix/thunderbolt-ioc'
import { ComponentsLoaderSymbol, IComponentsLoader } from '@wix/thunderbolt-components-loader'

const BLOCKING_LAYER_BG_ID = 'BLOCKING_LAYER_BACKGROUND'

const baseStructureAPI = (
	structureStore: IStructureStore,
	componentsLoader: IComponentsLoader,
	pageAssetsLoader: IPageAssetsLoader
): IBaseStructureAPI => {
	return {
		get: (compId) => structureStore.get(compId),
		getCompPageId: (compId) => structureStore.get(compId)?.pageId,
		subscribeToChanges: (partial) => structureStore.subscribeToChanges(partial),
		getEntireStore: () => structureStore.getEntireStore(),
		getContextIdOfCompId: (compId: string) => structureStore.getContextIdOfCompId(compId),
		replaceComponentInParent: (parentId, oldCompId, newCompId) => {
			const parent = structureStore.get(parentId)
			const components = [...parent.components]

			const compIndex = components.indexOf(oldCompId)
			if (compIndex > -1) {
				components[compIndex] = newCompId

				structureStore.update({
					[parentId]: { ...parent, components },
				})
			}
		},
		getPageWrapperComponentId: (pageId: string, contextId: string = pageId) =>
			pageId === contextId ? `${pageId}_wrapper` : contextId,
		addComponentToDynamicStructure: async (compId, compStructure, additionalComponents) => {
			const structure = {
				[compId]: compStructure,
				...additionalComponents,
			}
			structureStore.update(structure)
			await componentsLoader.loadComponents(structure)

			const newComponents = [...structureStore.get('DYNAMIC_STRUCTURE_CONTAINER').components]

			const blockLayerBgIndex = newComponents.findIndex((comp) => comp === BLOCKING_LAYER_BG_ID)
			if (blockLayerBgIndex !== -1) {
				// We insert the new comp before both the BLOCKING_LAYER and BLOCKING_LAYER_BG components
				newComponents.splice(blockLayerBgIndex - 1, 0, compId)
			} else {
				newComponents.push(compId)
			}

			structureStore.update({
				DYNAMIC_STRUCTURE_CONTAINER: {
					componentType: 'DynamicStructureContainer',
					components: newComponents,
				},
			})
		},
		isComponentInDynamicStructure: (compId) => {
			if (!structureStore.get('DYNAMIC_STRUCTURE_CONTAINER')) {
				return false
			}

			const { components } = structureStore.get('DYNAMIC_STRUCTURE_CONTAINER')

			return components.includes(compId)
		},
		removeComponentFromDynamicStructure: (compId) => {
			const { components } = structureStore.get('DYNAMIC_STRUCTURE_CONTAINER')
			structureStore.update({
				DYNAMIC_STRUCTURE_CONTAINER: {
					componentType: 'DynamicStructureContainer',
					components: components.filter((id) => id !== compId),
				},
			})
			// should we delete the comp structure..?
		},
		removeComponentFromParent: (parentId, compId) => {
			const parent = structureStore.get(parentId)
			const components = parent.components.filter((id) => id !== compId)

			structureStore.update({
				[parentId]: { ...parent, components },
			})
		},
		addComponentToParent: (parentId, compId, index) => {
			const parent = structureStore.get(parentId)
			const components = index
				? [...parent.components.slice(0, index), compId, ...parent.components.slice(index)]
				: [...parent.components, compId]

			structureStore.update({
				[parentId]: { ...parent, components },
			})
		},
		cleanPageStructure: (contextId: string) => {
			structureStore.setChildStore(contextId)
		},
		loadPageStructure: async (pageId: string, contextId: string) => {
			const pageStructure = await pageAssetsLoader.load(pageId).components
			structureStore.setChildStore(contextId, pageStructure)
			return pageStructure
		},
	}
}

export const BaseStructureAPI = withDependencies(
	[Structure, ComponentsLoaderSymbol, PageAssetsLoaderSymbol],
	baseStructureAPI
)
