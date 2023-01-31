import { ComponentEntry } from '../../core/common-types'

const entry: ComponentEntry = {
	componentType: 'GhostRefComp',
	loadComponent: () => import('./ghostRefComp' /* webpackChunkName: "ghostRefComp" */),
}

export default entry
