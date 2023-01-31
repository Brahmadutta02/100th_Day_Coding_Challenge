import { ComponentEntry } from '../../core/common-types'

const entry: ComponentEntry = {
	componentType: 'DynamicStructureContainer',
	loadComponent: () => import('./DynamicStructureContainer' /* webpackChunkName: "DynamicStructureContainer" */),
}

export default entry
