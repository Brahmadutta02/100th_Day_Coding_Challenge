import { ComponentEntry } from '../../core/common-types'

const entry: ComponentEntry = {
	componentType: 'TPAPopup',
	loadComponent: () => import('./TPAPopup' /* webpackChunkName: "TPAPopup" */),
}

export default entry
