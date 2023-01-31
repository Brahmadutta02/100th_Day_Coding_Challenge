import { ComponentEntry } from '../../core/common-types'

const entry: ComponentEntry = {
	componentType: 'AppController',
	loadComponent: () =>
		process.env.PACKAGE_NAME === 'thunderbolt-ds'
			? import('./AppControllerPreviewExtension' /* webpackChunkName: "AppControllerPreviewExtension" */)
			: import('./AppController' /* webpackChunkName: "AppController" */),
}

export default entry
