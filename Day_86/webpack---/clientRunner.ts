const runner = async () => {
	if (window.__browser_deprecation__) {
		return
	}

	await window.externalsRegistry.lodash.loaded
	require('./client')
}

runner()
