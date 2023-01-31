import { ComponentEntry } from '../../core/common-types'

const entry: ComponentEntry = {
	componentType: 'AppPart',
	loadComponent: () => import('./AppPart' /* webpackChunkName: "AppPart" */),
}

export default entry
