import { CookieAnalysis } from '@wix/thunderbolt-symbols'

const extractServerTiming = () => {
	let serverTiming: Array<any>
	try {
		serverTiming = performance.getEntriesByType('navigation')[0].serverTiming || []
	} catch (e) {
		serverTiming = []
	}
	let microPop
	const matches: Array<string> = []
	serverTiming.forEach((st) => {
		switch (st.name) {
			case 'cache':
				matches[1] = st.description
				break
			case 'varnish':
				matches[2] = st.description
				break
			case 'dc':
				microPop = st.description
				break
			default:
				break
		}
	})
	return {
		microPop,
		matches,
	}
}

export const extractCachingData = (): CookieAnalysis => {
	let microPop,
		caching = 'none'
	let match = document.cookie.match(
		/ssr-caching="?cache[,#]\s*desc=([\w-]+)(?:[,#]\s*varnish=(\w+))?(?:[,#]\s*dc[,#]\s*desc=([\w-]+))?(?:"|;|$)/
	)
	if (!match && window.PerformanceServerTiming) {
		const results = extractServerTiming()
		microPop = results.microPop
		match = results.matches
	}
	if (match && match.length) {
		caching = `${match[1]},${match[2] || 'none'}`
		if (!microPop) {
			microPop = match[3]
		}
	}
	if (caching === 'none') {
		const timing = performance.timing
		if (timing && timing.responseStart - timing.requestStart === 0) {
			caching = 'browser'
		}
	}
	return {
		caching,
		isCached: caching.indexOf('hit') === 0,
		...(microPop ? { microPop } : {}),
	}
}
