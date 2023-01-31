import _ from 'lodash'
import { withDependencies, optional, named } from '@wix/thunderbolt-ioc'
import { hasNavigator, isSSR } from '@wix/thunderbolt-commons'
import {
	BrowserWindow,
	BrowserWindowSymbol,
	SdkHandlersProvider,
	ViewModeSym,
	ViewMode,
	IMultilingual,
	IStructureAPI,
	StructureAPI,
	PageFeatureConfigSymbol,
	TpaPopupSymbol,
	ITpaPopup,
} from '@wix/thunderbolt-symbols'
import type { Language } from '@wix/thunderbolt-becky-types'
import { ILightbox, LightboxSymbol } from 'feature-lightbox'
import { IReporterApi, ReporterSymbol } from 'feature-reporter'
import { Animations, IAnimations } from 'feature-animations'
import { IWindowScrollAPI, WindowScrollApiSymbol } from 'feature-window-scroll'
import { MultilingualSymbol } from 'feature-multilingual'
import { ITpaModal, TpaModalSymbol } from 'feature-tpa'
import type { WindowWixCodeSdkHandlers, WindowWixCodeSdkPageConfig } from '../types'
import { name } from '../symbols'

function setCurrentLanguage(languageCode: Language): never {
	throw new Error(`language code "${languageCode}" is invalid`)
}

export const windowWixCodeSdkPageHandlers = withDependencies(
	[
		named(PageFeatureConfigSymbol, name),
		optional(Animations),
		BrowserWindowSymbol,
		ViewModeSym,
		StructureAPI,
		optional(WindowScrollApiSymbol),
		optional(TpaModalSymbol),
		optional(TpaPopupSymbol),
		optional(LightboxSymbol),
		optional(ReporterSymbol),
		optional(MultilingualSymbol),
	],
	(
		{ templateIdToCompIdMap }: WindowWixCodeSdkPageConfig,
		animations: IAnimations,
		window: BrowserWindow,
		viewMode: ViewMode,
		structureApi: IStructureAPI,
		windowScrollApi?: IWindowScrollAPI,
		tpaModel?: ITpaModal,
		tpaPopup?: ITpaPopup,
		popupsFeature?: ILightbox,
		analyticFeature?: IReporterApi,
		multilingual?: IMultilingual
	): SdkHandlersProvider<WindowWixCodeSdkHandlers> => {
		const getCompIdFromTemplateId = (templateId: string): string => templateIdToCompIdMap[templateId] || templateId

		return {
			getSdkHandlers: () => ({
				getBoundingRectHandler: () => {
					if (!window) {
						return null
					}
					return Promise.resolve({
						window: {
							height: window.innerHeight,
							width: window.innerWidth,
						},
						document: {
							height: document.documentElement.clientHeight,
							width: document.documentElement.clientWidth,
						},
						scroll: {
							x: window.scrollX,
							y: window.scrollY,
						},
					})
				},
				setCurrentLanguage: multilingual?.setCurrentLanguage || setCurrentLanguage,
				async scrollToComponent(compId: string, callback: Function) {
					if (!process.env.browser) {
						return // historically we don't invoke the callback in ssr, we can experiment with removing this if
					}
					await windowScrollApi?.scrollToComponent(compId)
					callback()
				},
				async scrollToHandler(x, y, shouldAnimate) {
					if (isSSR(window)) {
						return
					}
					if (!shouldAnimate) {
						window.scrollTo(x, y)
					}
					return windowScrollApi?.animatedScrollTo(y)
				},
				async scrollByHandler(x, y) {
					if (isSSR(window)) {
						return
					}
					window.scrollBy(x, y)
					return new Promise((resolve) => {
						window.requestAnimationFrame(() => {
							resolve()
						})
					})
				},
				async copyToClipboard(text: string) {
					const copy = await import('copy-to-clipboard')
					copy.default(text)
				},

				getCurrentGeolocation() {
					if (!hasNavigator(window)) {
						return Promise.reject(new Error('Geolocation not available'))
					}

					return new Promise((resolve, reject) => {
						navigator.geolocation.getCurrentPosition(
							({ timestamp, coords }: GeolocationPosition) => {
								// Convert to a plain object, because GeolocationCoordinates cannot be
								// sent over postMessage.
								resolve({
									timestamp,
									coords: _.toPlainObject(coords),
								})
							},
							({ message, code }) => {
								reject({ message, code })
							}
						)
					})
				},
				openModal(url: string, options: any, compId?: string) {
					if (!tpaModel) {
						throw new Error('TPA Modal feature is not available')
					}
					return tpaModel.openModal(url, options, compId ? getCompIdFromTemplateId(compId) : compId)
				},
				openLightbox(lightboxPageId, lightboxName, closeHandler) {
					return popupsFeature
						? popupsFeature.open(lightboxPageId, closeHandler)
						: Promise.reject(`There is no lightbox with the title "${lightboxName}".`)
				},
				closeLightbox() {
					if (popupsFeature) {
						popupsFeature.close()
					}
				},
				openTpaPopup(url: string, options: any, compId: string) {
					if (!tpaPopup) {
						throw new Error('TPA Popup feature is not available')
					}
					return tpaPopup.openPopup(url, options, getCompIdFromTemplateId(compId))
				},
				trackEvent(eventName: string, params = {}, options = {}) {
					const event = { eventName, params, options }
					analyticFeature && analyticFeature.trackEvent(event)
				},
				postMessageHandler(
					message: any,
					target: string = 'parent',
					targetOrigin: string = '*',
					transfer?: Array<Transferable>
				) {
					if (!window) {
						return
					}

					if (target !== 'parent') {
						return
					}

					window.parent.postMessage(message, targetOrigin, transfer)
				},
			}),
		}
	}
)
