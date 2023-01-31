import { ComponentEntry } from '../../core/common-types'

const entry: ComponentEntry = {
	componentType: 'TPAMultiSection',
	loadComponent: () => import('../TpaCommon/TPABaseComponent' /* webpackChunkName: "TPABaseComponent" */),
}

export default entry
