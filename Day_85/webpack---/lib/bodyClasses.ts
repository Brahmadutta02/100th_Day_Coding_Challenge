/* eslint-disable @typescript-eslint/no-unused-vars */
import { ViewerModel } from '@wix/thunderbolt-symbols'
import { getIsIpad } from '@wix/thunderbolt-commons'

export function getBodyClasses(viewerModel: ViewerModel, isIpad = false): Array<string> {
	const isResponsive = viewerModel.site.isResponsive
	const classes = []

	if (viewerModel.viewMode === 'mobile') {
		classes.push('device-mobile-optimized')
		if (viewerModel.experiments['specs.thunderbolt.dontOverflowHiddenSiteRoot']) {
			classes.push('dont-overflow-hidden-site-root')
		}
	} else if (isResponsive && viewerModel.deviceInfo.deviceClass === 'Smartphone') {
		classes.push('device-mobile-responsive')
	} else if (
		(!isResponsive && viewerModel.deviceInfo.deviceClass === 'Tablet') ||
		viewerModel.deviceInfo.deviceClass === 'Smartphone'
	) {
		classes.push('device-mobile-non-optimized')
	}

	isResponsive && classes.push('responsive')

	return classes
}

export function fixBodyClasses(viewerModel: ViewerModel, window: Window) {
	const isIpad = getIsIpad(window)
	const bodyClasses = getBodyClasses(viewerModel, isIpad)

	window.document.body.classList.add(...bodyClasses)
}
