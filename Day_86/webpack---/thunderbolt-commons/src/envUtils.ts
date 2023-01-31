export function isSSR(window: Window | null): window is null {
	return !window
}

export function getCSRFToken(cookie: string | undefined): string {
	if (!cookie) {
		return ''
	}

	const csrfTokenCookieValue = cookie.split(';').filter((item) => item.includes('XSRF-TOKEN'))
	return csrfTokenCookieValue?.[0]?.replace('XSRF-TOKEN=', '').trim() || ''
}

export function hasNavigator(window: Window | null): boolean {
	return !!window && typeof window.navigator !== 'undefined'
}

export function getBrowserLanguage(window: Window | null): string | null {
	return hasNavigator(window) ? window!.navigator.language : null
}

export function getBrowserReferrer(window: Window | null): string | undefined {
	return window?.document?.referrer
}
