import { isIOS } from './isIOS'

export const sendBeacon = (url: string): void => {
	let sent = false
	if (!window.viewerModel?.experiments['specs.thunderbolt.useImgNotBeacon']) {
		if (!window.viewerModel?.experiments['specs.thunderbolt.checkIOSToAvoidBeacon'] || !isIOS()) {
			try {
				sent = navigator.sendBeacon(url)
			} catch (e) {}
		}
	}
	if (!sent) {
		new Image().src = url
	}
}
