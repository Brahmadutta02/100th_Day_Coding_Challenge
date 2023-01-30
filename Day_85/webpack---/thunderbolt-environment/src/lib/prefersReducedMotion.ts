import { BrowserWindow } from '@wix/thunderbolt-symbols'

const getUserAgent = (window: Window): string =>
	window && window.navigator && window.navigator.userAgent ? window.navigator.userAgent.toLowerCase() : ''
const isWindows = (window: Window): boolean => {
	const userAgent = getUserAgent(window)
	return !!userAgent && /.*\(win.*\).*/i.test(userAgent)
}

export const prefersReducedMotion = (
	browserWindow: BrowserWindow,
	requestUrl = '',
	isExperimentOpen: (experiment: string) => boolean
) => {
	const shouldDisableWindows =
		isWindows(browserWindow!) && !isExperimentOpen('specs.thunderbolt.allow_windows_reduced_motion')
	const shouldForce = requestUrl.toLowerCase().includes('forcereducedmotion')
	return (
		shouldForce ||
		(browserWindow && !shouldDisableWindows
			? browserWindow.matchMedia('(prefers-reduced-motion: reduce)').matches
			: false)
	)
}
