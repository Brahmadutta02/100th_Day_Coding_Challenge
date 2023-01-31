import { ComponentEntry } from '../../core/common-types'

const entry: ComponentEntry = {
	componentType: 'SiteStyles',
	loadComponent: () => import('./SiteStyles' /* webpackChunkName: "SiteStyles" */),
}

export default entry
