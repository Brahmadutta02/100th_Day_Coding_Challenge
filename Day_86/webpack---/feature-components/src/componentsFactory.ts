import _ from 'lodash'
import { AppStructure } from '@wix/thunderbolt-symbols'
import type { ViewerComponentProvider, TraitProvider, ViewerComponent, ComponentDriverFactory } from './types'

export const viewerComponentProvider = (
	baseTraits: Array<TraitProvider>,
	componentDriversArray: Array<ComponentDriverFactory<ViewerComponent>>,
	componentsConfig: { [featureName: string]: { [componentId: string]: unknown } }
): ViewerComponentProvider => {
	const driversByComponentType = _.groupBy(componentDriversArray, 'componentType')

	const createComponent = (id: string, componentType: string, uiType?: string) => {
		const getConfig = (name: string) => componentsConfig[name][id]
		const baseComponent: ViewerComponent = Object.assign(
			{ id, componentType, uiType, getConfig },
			...baseTraits.map((trait) => trait(id))
		)
		if (!driversByComponentType[componentType]) {
			return baseComponent
		}
		return Object.assign(
			{},
			baseComponent,
			...driversByComponentType[componentType].map((x) => x.getComponentDriver(baseComponent))
		)
	}

	return {
		createComponent,
		createComponents: (pageStructure: AppStructure) =>
			_.mapValues(pageStructure, ({ componentType, uiType }, id) => createComponent(id, componentType, uiType)),
	}
}
