export const isBot = (window: Window): '' | 'ua' => {
	const { userAgent } = window.navigator

	if (/instagram.+google\/google/i.test(userAgent)) {
		return ''
	}

	return /bot|google(?!play)|phantom|crawl|spider|headless|slurp|facebookexternal|Lighthouse|PTST|^mozilla\/4\.0$|^\s*$/i.test(
		userAgent
	)
		? 'ua'
		: ''
}
