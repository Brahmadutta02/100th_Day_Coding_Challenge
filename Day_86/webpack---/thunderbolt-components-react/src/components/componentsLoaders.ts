import { ComponentLoadingFunction, ComponentEntry } from '../core/common-types'
import { importAll } from '../build-utils'

function createComponentsLoader(componentEntries: Array<ComponentEntry>): Record<string, ComponentLoadingFunction> {
	return componentEntries.reduce<Record<string, ComponentLoadingFunction>>((loader, entry) => {
		const { componentType, loadComponent, uiType } = entry
		if (!componentType || !loadComponent) {
			throw new Error(
				'Error generating components loader! component entry (ComponentName/entry.ts) must be of type `ComponentEntry`'
			)
		}

		const compClassType = uiType ? `${componentType}_${uiType}` : componentType
		loader[compClassType] = loadComponent
		return loader
	}, {})
}

const componentEntriesContext = require.context('./', true, /entry\.ts$/)

const componentEntries = importAll<ComponentEntry>(componentEntriesContext)

const componentsLoaders = createComponentsLoader(componentEntries)

export { componentsLoaders }
