import { ComponentEntry } from '../../core/common-types'

const entry: ComponentEntry = {
	componentType: 'RemoteRefDeadComp',
	loadComponent: () => import('./RemoteRefDeadComp' /* webpackChunkName: "ghostRefComp" */),
}

export default entry
