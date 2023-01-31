import { ComponentEntry } from '../../core/common-types'

const entry: ComponentEntry = {
	componentType: 'DivWithChildren',
	loadComponent: () => import('./DivWithChildren' /* webpackChunkName: "DivWithChildren" */),
}

export default entry
