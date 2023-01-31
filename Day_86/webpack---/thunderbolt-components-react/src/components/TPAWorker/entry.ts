import { ComponentEntry } from '../../core/common-types'

const entry: ComponentEntry = {
	componentType: 'TPAWorker',
	loadComponent: () => import('./TPAWorker' /* webpackChunkName: "TPAWorker" */),
}

export default entry
