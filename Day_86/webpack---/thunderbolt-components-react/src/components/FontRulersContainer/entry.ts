import { ComponentEntry } from '../../core/common-types'

const entry: ComponentEntry = {
	componentType: 'FontRulersContainer',
	loadComponent: () => import('./FontRulersContainer' /* webpackChunkName: "FontRulersContainer" */),
}

export default entry
