export const isIFrame = (): '' | 'iframe' => {
	try {
		if (window.self === window.top) {
			return ''
		}
	} catch (e) {
		// empty
	}
	return 'iframe'
}
