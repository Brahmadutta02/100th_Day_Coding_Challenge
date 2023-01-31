import type { ViewerModel } from '@wix/thunderbolt-symbols'

export const CORE_JS_BUNDLE_URL = 'https://static.parastorage.com/unpkg/core-js-bundle@3.2.1/minified.js'

const getReactVersion = (viewerModel: ViewerModel) =>
	viewerModel.experiments['specs.thunderbolt.react_experimental'] ? '18.1.0' : '16.14.0'

export const REACT_PROD_URL = (viewerModel: ViewerModel) =>
	`https://static.parastorage.com/unpkg/react@${getReactVersion(viewerModel)}/umd/react.production.min.js`
export const REACT_DEV_URL = (viewerModel: ViewerModel) =>
	`https://static.parastorage.com/unpkg/react@${getReactVersion(viewerModel)}/umd/react.development.js`
export const REACT_DOM_PROD_URL = (viewerModel: ViewerModel) =>
	`https://static.parastorage.com/unpkg/react-dom@${getReactVersion(viewerModel)}/umd/react-dom.production.min.js`
export const REACT_DOM_DEV_URL = (viewerModel: ViewerModel) =>
	`https://static.parastorage.com/unpkg/react-dom@${getReactVersion(viewerModel)}/umd/react-dom.development.js`
