/**
 * @deprecated util method.
 * Prefer using feature detection over browser detection when possible.
 * see documentation on documentMode: https://www.geeksforgeeks.org/html-dom-documentmode-property/
 */
export const isIE = (window: Window): boolean => {
	// @ts-ignore - documentMode is a feature only in IE
	return !!window && !!window.document && !!window.document.documentMode
}

/**
 * @deprecated util method.
 * Prefer using feature detection over browser detection when possible.
 * see documentation on edge user agent: https://docs.microsoft.com/en-us/microsoft-edge/web-platform/user-agent-string
 */
export const isEdge = (window: Window): boolean => getUserAgent(window).indexOf('edg') > -1

/**
 * @deprecated util method.
 * Prefer using feature detection over browser detection when possible.
 * see documentation on firefox user agent: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent/Firefox
 */
export const isFirefox = (window: Window): boolean => getUserAgent(window).indexOf('firefox') > -1

/**
 * @deprecated util method.
 * Prefer using feature detection over browser detection when possible.
 * see documentation on safari user agent: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent#Safari_UA_string
 * notice that safari user agent has "Version" directive
 */
export const isSafari = (window: Window): boolean => {
	const userAgent = getUserAgent(window)
	return userAgent.indexOf('safari') > -1 && userAgent.indexOf('version') > -1
}

/**
 * @deprecated util method.
 * Prefer using feature detection over browser detection when possible.
 * see documentation on safari user agent: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent#Safari_UA_string
 */
export const getSafariMajorVersion = (window: Window): number => {
	if (isSafari(window)) {
		const userAgent = getUserAgent(window)
		let version: any = userAgent.split(' ')
		version = version.find((directive: string) => directive.startsWith('version/'))
		version = version.split('/')[1]
		return parseInt(version, 10)
	}
	return -1
}

/**
 * @deprecated util method.
 * Prefer using feature detection over browser detection when possible.
 * see documentation on chrome user agent: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent#chrome_ua_string
 */
export const isChrome = (window: Window): boolean => getUserAgent(window).indexOf('chrome') > -1

/**
 *
 * Chrome on ios user agent https://developer.chrome.com/multidevice/user-agent#chrome_for_ios_user_agent
 */

export const isChromeOnIos = (window: Window): boolean => {
	const userAgent = getUserAgent(window)
	return userAgent.indexOf('safari') > -1 && userAgent.indexOf('crios') > -1
}

const getUserAgent = (window: Window): string =>
	window && window.navigator && window.navigator.userAgent ? window.navigator.userAgent.toLowerCase() : ''

const getPlatform = (window: Window): string => (window && window.navigator && window.navigator.platform) || ''

export const isIOS11Device = (window: Window) => {
	const userAgent = getUserAgent(window)
	return /ip(hone|od|ad).*os 11/.test(userAgent)
}

export const isIOS = (window: Window): boolean => {
	const platform = getPlatform(window)
	return !!platform && /iPad|iPhone|iPod/.test(platform)
}

export const getIOSVersion = (window: Window) => {
	const userAgent = getUserAgent(window)
	const iOSRegex = /(iphone|ipod|ipad).*os (\d+)_/
	if (!iOSRegex.test(userAgent)) {
		return NaN
	}

	const iOSgroups = userAgent.match(iOSRegex)
	return iOSgroups && Number(iOSgroups[2])
}

export const isFacebookApp = (window: Window): boolean => {
	const userAgent = getUserAgent(window)
	return userAgent.includes('fban') || userAgent.includes('fbav')
}

export const isInstagramApp = (window: Window): boolean => {
	const userAgent = getUserAgent(window)
	return userAgent.includes('instagram')
}

/**
 * Specific check for iPad as Safari on iOS >=13 uses desktop user-agent
 */
export const getIsIpad = (window: Window) => {
	const userAgent = window.navigator.userAgent.toLowerCase()
	const ipadInUserAgent = userAgent.indexOf('ipad') !== -1
	const macInUserAgent = userAgent.indexOf('mac') !== -1

	if (!ipadInUserAgent && macInUserAgent && window.navigator.maxTouchPoints && window.navigator.maxTouchPoints > 2) {
		return true
	}

	return ipadInUserAgent
}
