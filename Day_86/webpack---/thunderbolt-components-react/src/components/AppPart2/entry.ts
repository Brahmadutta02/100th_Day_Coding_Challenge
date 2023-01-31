import { ComponentEntry } from '../../core/common-types'

const entry: ComponentEntry = {
	componentType: 'AppPart2',
	loadComponent: () => import('./AppPart2' /* webpackChunkName: "AppPart2" */),
}

export default entry
