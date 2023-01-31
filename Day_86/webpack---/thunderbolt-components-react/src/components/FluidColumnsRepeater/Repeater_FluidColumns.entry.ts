import { ComponentEntry } from '../../core/common-types'

const entry: ComponentEntry = {
	componentType: 'Repeater',
	uiType: 'FluidColumns',
	loadComponent: () => import('./FluidColumnsRepeater' /* webpackChunkName: "Repeater_FluidColumns" */),
}

export default entry
