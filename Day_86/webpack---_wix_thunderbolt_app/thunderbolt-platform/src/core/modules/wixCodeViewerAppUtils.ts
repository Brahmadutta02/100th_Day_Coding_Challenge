import _ from 'lodash'
import { ViewerAppSpecData } from '@wix/thunderbolt-symbols'
import { BootstrapData } from '../../types'
import type { EventHandlers } from '../types'
import { MasterPageId } from '../constants'
import { IStaticEventsManager } from './staticEventsManager'
import { BOOTSTRAP_DATA, STATIC_EVENTS_MANAGER, WIX_CODE_VIEWER_APP_UTILS } from './moduleNames'

export interface IWixCodeViewerAppUtils {
	createWixCodeAppData(
		appData: ViewerAppSpecData
	): {
		userCodeMap: Array<{
			url: string
			displayName: string
			id: string
			scriptName: string
		}>
	}

	setStaticEventHandlers(eventHandlers: EventHandlers): void
}

const WixCodeViewerAppUtils = (bootstrapData: BootstrapData, staticEventsManager: IStaticEventsManager): IWixCodeViewerAppUtils => {
	const {
		wixCodeBootstrapData: { wixCodePageIds, wixCodeModel, codePackagesData },
		platformEnvData,
		currentPageId,
	} = bootstrapData
	const {
		bi: { pageData },
		site: { pageIdToTitle },
		router: { isLandingOnProtectedPage },
	} = platformEnvData

	const pagesToRunUserCodeOn = pageData.isLightbox || isLandingOnProtectedPage ? [currentPageId] : [MasterPageId, currentPageId]

	return {
		createWixCodeAppData() {
			const codeAppId = _.get(wixCodeModel, 'appData.codeAppId')

			return {
				userCodeMap: pagesToRunUserCodeOn
					.filter((pageId) => wixCodePageIds[pageId])
					.map((pageId: string) => ({
						url: wixCodePageIds[pageId],
						displayName: pageId === MasterPageId ? 'site' : `${pageIdToTitle[pageId]} page`,
						id: pageId,
						scriptName: `${pageId}.js`,
					})),
				shouldUseGlobalsObject: true,
				codeAppId,
				codePackagesData,
			}
		},
		setStaticEventHandlers: async (eventHandlers: EventHandlers) => {
			staticEventsManager.setStaticEventsCallbacks(eventHandlers)
		},
	}
}

export default {
	factory: WixCodeViewerAppUtils,
	deps: [BOOTSTRAP_DATA, STATIC_EVENTS_MANAGER],
	name: WIX_CODE_VIEWER_APP_UTILS,
}
