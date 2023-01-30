import { withDependencies } from '@wix/thunderbolt-ioc'
import {
	BrowserWindow,
	BrowserWindowSymbol,
	CurrentRouteInfoSymbol,
	IPropsStore,
	ISamePageUrlChangeListener,
	IStructureAPI,
	pageIdSym,
	Props,
	StructureAPI,
	TpaPopupSymbol,
	ITpaPopup,
} from '@wix/thunderbolt-symbols'
import { ICurrentRouteInfo } from 'feature-router'
import type { ITpa, ITPAEventsListenerManager } from './types'
import { TpaEventsListenerManagerSymbol, TpaSymbol } from './symbols'

export const TpaCurrentCurrencyManager = withDependencies(
	[
		Props,
		StructureAPI,
		TpaEventsListenerManagerSymbol,
		CurrentRouteInfoSymbol,
		BrowserWindowSymbol,
		pageIdSym,
		TpaPopupSymbol,
		TpaSymbol,
	],
	(
		props: IPropsStore,
		structureAPI: IStructureAPI,
		tpaEventsListenerManager: ITPAEventsListenerManager,
		currentRouteInfo: ICurrentRouteInfo,
		browserWindow: BrowserWindow,
		pageId: string,
		{ getOpenedPopups }: ITpaPopup,
		{ rebuildTpasSrc }: ITpa
	): ISamePageUrlChangeListener => {
		const state: { previousCurrency: string | null } = { previousCurrency: null }

		return {
			onUrlChange(url) {
				const routerInfo = currentRouteInfo.getCurrentRouteInfo()
				if (!routerInfo) {
					return
				}

				const currency = url.searchParams.get('currency')
				if (currency === state.previousCurrency) {
					return
				}

				// Refresh static TPAs
				rebuildTpasSrc()

				// Refresh runtime TPAs
				Object.values(getOpenedPopups()).forEach((tpaCompData) => tpaCompData.refreshPopUp())

				state.previousCurrency = currency
			},
		}
	}
)
