// Load `core-js` on older browsers that are missing key features
// eslint-disable-next-line no-restricted-syntax
import { getLodashUrl } from '@wix/thunderbolt-commons/src/externalUrls'

if (
	typeof Promise === 'undefined' ||
	typeof Set === 'undefined' ||
	typeof Object.assign === 'undefined' ||
	typeof Array.from === 'undefined' ||
	typeof Symbol === 'undefined' ||
	!Array.prototype.find ||
	!Object.fromEntries
) {
	// @ts-ignore
	importScripts(require('./utils/constants').CORE_JS_BUNDLE_URL)
}
// @ts-ignore
importScripts(getLodashUrl())

require('thunderbolt-platform/src/client/clientWorker')
