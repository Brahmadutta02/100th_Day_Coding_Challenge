import fastdom from 'fastdom'
import { BIReporter, ViewerModel } from '@wix/thunderbolt-symbols'
import { prefersReducedMotion } from '@wix/thunderbolt-environment'
import { mediaResizeMap } from '@wix/animations-kit'
import wixCustomElementsRegistry from '@wix/custom-elements'
import { initCustomElement as initWowImageCustomElement } from '@wix/image'

type CustomElementsMediaData = Pick<ViewerModel, 'experiments' | 'media' | 'requestUrl'>
type MediaServicesOverride = {
	getScreenHeightOverride: () => number
}

const getSiteService = () => ({
	getSiteScale: () => {
		// We can replace later with better logic
		const siteRootElement = document.querySelector<HTMLDivElement>('#site-root')
		if (siteRootElement) {
			return siteRootElement.getBoundingClientRect().width / siteRootElement.offsetWidth
		}
		return 1
	},
})

const initWixCustomElementsRegistry = () => {
	const resizeService = {
		init: (callback: any) => new ResizeObserver(callback),
	}

	const windowResizeService = {
		init: (callback: any) => window.addEventListener('resize', callback),
	}

	const siteService = getSiteService()

	return wixCustomElementsRegistry.init({ resizeService, windowResizeService, siteService })
}

const getMediaDimensionsByEffect = (bgEffectName: string, width: number, height: number, screenHeight: number) => {
	const { getMediaDimensions, ...rest } = mediaResizeMap[bgEffectName as keyof typeof mediaResizeMap] || {}
	return getMediaDimensions
		? { ...getMediaDimensions(width, height, screenHeight), ...rest }
		: { width, height, ...rest }
}

const buildCustomElementsMediaParams = (
	partialViewerModel: CustomElementsMediaData,
	biService: BIReporter,
	wixCustomElements?: any,
	mediaOverrideParam?: MediaServicesOverride
) => {
	const getDevicePixelRatio = () => {
		const isMSMobileDevice = /iemobile/i.test(navigator.userAgent)
		if (isMSMobileDevice) {
			return Math.round(
				window.screen.availWidth / (window.screen.width || window.document.documentElement.clientWidth)
			)
		}
		return window.devicePixelRatio
	}

	const isExperimentOpen = (experiment: string) => Boolean(partialViewerModel.experiments[experiment])

	const environmentConsts = {
		staticMediaUrl: partialViewerModel.media.staticMediaUrl,
		mediaRootUrl: partialViewerModel.media.mediaRootUrl,
		experiments: {},
		isViewerMode: true,
		devicePixelRatio: getDevicePixelRatio(),
	}

	const services = {
		mutationService: fastdom,
		// @ts-ignore window.bi is initialized by bi.inline script
		biService,
		isExperimentOpen,
		siteService: getSiteService(),
	}
	const mediaServices = { getMediaDimensionsByEffect, ...services, ...mediaOverrideParam }

	return {
		...partialViewerModel,
		wixCustomElements: wixCustomElements || initWixCustomElementsRegistry(),
		services,
		environmentConsts,
		mediaServices,
	}
}

export const initCustomElements = (
	partialViewerModelParam: CustomElementsMediaData,
	biService: BIReporter,
	wixCustomElementsParam?: any,
	mediaOverrideParam?: MediaServicesOverride
) => {
	const {
		services,
		environmentConsts,
		wixCustomElements,
		media,
		requestUrl,
		mediaServices,
	} = buildCustomElementsMediaParams(partialViewerModelParam, biService, wixCustomElementsParam, mediaOverrideParam)

	initWowImageCustomElement({ getMediaDimensionsByEffect })

	wixCustomElements.defineWixVideo(mediaServices, {
		...environmentConsts,
		staticVideoUrl: media.staticVideoUrl,
		prefersReducedMotion: prefersReducedMotion(window, requestUrl, services.isExperimentOpen),
	})
	wixCustomElements.defineWixDropdownMenu(services, environmentConsts)
	wixCustomElements.defineWixIframe(services, environmentConsts)

	wixCustomElements.defineWixImage(mediaServices, environmentConsts)
	wixCustomElements.defineWixBgImage(mediaServices, environmentConsts)
	wixCustomElements.defineWixBgMedia(mediaServices, environmentConsts)
	window.__imageClientApi__ = wixCustomElementsRegistry.imageClientApi
	window.externalsRegistry.imageClientApi.onload() // notify the users of imageClientApi that it is loaded so they can wait for it
}
