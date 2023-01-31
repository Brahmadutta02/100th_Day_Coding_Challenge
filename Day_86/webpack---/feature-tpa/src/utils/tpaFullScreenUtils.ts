import { isSSR } from '@wix/thunderbolt-commons'
import { BrowserWindow } from '@wix/thunderbolt-symbols'

export const setFullScreenMode = (window: BrowserWindow) => {
	if (isSSR(window)) {
		return
	}

	const classesToAdd = ['fullScreenMode']
	classesToAdd.forEach((className) => document.body.classList.add(className))
}

export const removeFullScreenMode = (window: BrowserWindow) => {
	if (isSSR(window)) {
		return
	}

	document.body.classList.remove('fullScreenMode')
}

export const hideSiteRoot = (window: BrowserWindow, hide: boolean) => {
	if (isSSR(window)) {
		return
	}
	const siteRoot = document.getElementById('site-root') as HTMLElement
	if (siteRoot) {
		if (hide) {
			siteRoot.style.setProperty('overflow-y', 'hidden')
			siteRoot.style.setProperty('height', '0')
		} else {
			siteRoot.style.removeProperty('overflow-y')
			siteRoot.style.removeProperty('height')
		}
	}
}
