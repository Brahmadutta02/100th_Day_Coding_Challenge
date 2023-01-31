import { ComponentEntry } from '../../core/common-types'

const entry: ComponentEntry = {
	componentType: 'TPAModal',
	loadComponent: () => import('./TPAModal' /* webpackChunkName: "TPAModal" */),
}

export default entry
