// @ts-nocheck

import { throttleToAnimationFrame } from './utils/utils'
import wixBgImageWrapper from './elements/wixBgImage/wixBgImage'
import wixBgMediaWrapper from './elements/wixBgMedia/wixBgMedia'
import wixDropdownMenuWrapper from './elements/wixDropdownMenu/wixDropdownMenu'
import wixElementWrapper from './elements/wixElement'
import wixIframeWrapper from './elements/wixIframe/wixIframe'
import wixImageWrapper from './elements/wixImage/wixImage'
import wixVideoWrapper from './elements/wixVideo/wixVideo'
import nativeShim from './shims/native-shim'

function init(services, contextWindow = window) {
	nativeShim(contextWindow)

	const resizeObserver = services.resizeService.init((entries) => {
		const rootElements = resizeService.getLayoutTargets(entries.map((entry) => entry.target))

		rootElements.forEach((e) => e.reLayout())
	})

	const windowResizeService = {
		registry: new Set(),
		observe(element) {
			windowResizeService.registry.add(element)
		},
		unobserve(element) {
			windowResizeService.registry.delete(element)
		},
	}

	services.windowResizeService.init(
		throttleToAnimationFrame(() => windowResizeService.registry.forEach((element) => element.reLayout())),
		contextWindow
	)

	const resizeService = {
		observedElementToRelayoutTarget: new Map(),
		getLayoutTargets(elements) {
			const elementsNeedRelayout = new Set()
			elements.forEach((e) => elementsNeedRelayout.add(resizeService.observedElementToRelayoutTarget.get(e)))

			return elementsNeedRelayout
		},
		observe: (element) => {
			resizeService.observedElementToRelayoutTarget.set(element, element)
			resizeObserver.observe(element)
		},
		unobserve: (element) => {
			resizeService.observedElementToRelayoutTarget.delete(element)
			resizeObserver.unobserve(element)
		},
		observeChild: (childElement, rootElement) => {
			resizeService.observedElementToRelayoutTarget.set(childElement, rootElement)
			resizeObserver.observe(childElement)
		},
		unobserveChild: (childElement) => {
			resizeService.observedElementToRelayoutTarget.delete(childElement)
			resizeObserver.unobserve(childElement)
		},
	}

	const defineCustomElement = (elementName, elementClass) => {
		if (contextWindow.customElements.get(elementName) === undefined) {
			contextWindow.customElements.define(elementName, elementClass)
		}
	}

	const WixElement = wixElementWrapper({ resizeService }, contextWindow)
	defineCustomElement('wix-element', WixElement)

	const defineWixImage = (externalServices, environmentConsts) => {
		const WixImage = wixImageWrapper(WixElement, externalServices, environmentConsts, contextWindow)
		defineCustomElement('wix-image', WixImage)
	}

	const defineWixBgImage = (externalServices, environmentConsts) => {
		const WixBgImage = wixBgImageWrapper(WixElement, externalServices, environmentConsts, contextWindow)
		defineCustomElement('wix-bg-image', WixBgImage)
	}

	const defineWixBgMedia = (externalServices) => {
		const WixBgMedia = wixBgMediaWrapper(WixElement, { windowResizeService, ...externalServices }, contextWindow)
		defineCustomElement('wix-bg-media', WixBgMedia)
	}

	const defineWixDropdownMenu = (externalServices) => {
		const WixDropdownMenu = wixDropdownMenuWrapper(WixElement, externalServices, contextWindow)
		defineCustomElement('wix-dropdown-menu', WixDropdownMenu)
	}

	const defineWixVideo = (externalServices, environmentConsts) => {
		const WixVideo = wixVideoWrapper(WixElement, externalServices, environmentConsts, contextWindow)
		defineCustomElement('wix-video', WixVideo)
	}

	const defineWixIframe = (externalServices) => {
		const WixIframe = wixIframeWrapper(WixElement, externalServices)
		defineCustomElement('wix-iframe', WixIframe)
	}

	return {
		defineWixImage,
		defineWixBgImage,
		defineWixBgMedia,
		defineWixDropdownMenu,
		defineWixVideo,
		defineWixIframe,
	}
}

export default {
	init,
}
