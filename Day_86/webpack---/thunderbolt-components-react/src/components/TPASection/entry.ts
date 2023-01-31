import { ComponentEntry } from '../../core/common-types'

const entry: ComponentEntry = {
	componentType: 'TPASection',
	loadComponent: () => import('../TpaCommon/TPABaseComponent' /* webpackChunkName: "TPABaseComponent" */),
}

export default entry
