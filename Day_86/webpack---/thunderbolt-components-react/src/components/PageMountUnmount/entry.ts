import { ComponentEntry } from '../../core/common-types'

const entry: ComponentEntry = {
	componentType: 'PageMountUnmount',
	loadComponent: () => import('./PageMountUnmount' /* webpackChunkName: "PageMountUnmount" */),
}

export default entry
