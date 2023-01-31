export const isSuspectedBot = () => {
	if (!Function.prototype.bind) {
		return 'bind'
	}

	const { document, navigator } = window
	if (!document || !navigator) {
		return 'document'
	}
	const { webdriver, userAgent, plugins, languages } = navigator
	if (webdriver) {
		return 'webdriver'
	}

	if (!plugins || Array.isArray(plugins)) {
		return 'plugins'
	}
	// Because of https://www.npmjs.com/package/puppeteer-extra-plugin-stealth
	if (Object.getOwnPropertyDescriptor(plugins, '0')?.writable) {
		return 'plugins-extra'
	}

	if (!userAgent) {
		return 'userAgent'
	}
	if (userAgent.indexOf('Snapchat') > 0 && document.hidden) {
		return 'Snapchat'
	}

	if (!languages || languages.length === 0 || !Object.isFrozen(languages)) {
		return 'languages'
	}

	try {
		// @ts-ignore
		throw Error()
	} catch (err) {
		if (err instanceof Error) {
			const { stack } = err
			if (stack && / (\(internal\/)|(\(?file:\/)/.test(stack)) {
				return 'stack'
			}
		}
	}

	return ''
}
