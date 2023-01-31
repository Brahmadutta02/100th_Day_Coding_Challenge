import { ComponentEntry } from '../../core/common-types'

const entry: ComponentEntry = {
	componentType: 'TPAWidget',
	loadComponent: () => {
		return import('../TpaCommon/TPABaseComponent' /* webpackChunkName: "TPABaseComponent" */)
	},
}

export default entry
