import { ComponentEntry } from '../../core/common-types'

const entry: ComponentEntry = {
	componentType: 'Repeater',
	uiType: 'FixedColumns',
	loadComponent: () => import('./ColumnsRepeater' /* webpackChunkName: "Repeater_FixedColumns" */),
}

export default entry
