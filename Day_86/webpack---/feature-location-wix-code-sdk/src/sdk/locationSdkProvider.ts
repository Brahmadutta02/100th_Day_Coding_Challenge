import _ from 'lodash'
import { withDependencies, optional } from '@wix/thunderbolt-ioc'
import { BrowserWindow, BrowserWindowSymbol, SdkHandlersProvider } from '@wix/thunderbolt-symbols'
import { INavigation, NavigationSymbol } from 'feature-navigation'
import { IUrlHistoryManager, UrlHistoryManagerSymbol } from 'feature-router'
import { EditorLocationWixCodeSdkHandlers, LocationWixCodeSdkHandlers } from '../types'
import { EditorLocationSDKHandlersSymbols } from '../symbols'

export const locationWixCodeSdkHandlersProvider = withDependencies(
	[BrowserWindowSymbol, NavigationSymbol, UrlHistoryManagerSymbol, optional(EditorLocationSDKHandlersSymbols)],
	(
		browserWindow: BrowserWindow,
		navigation: INavigation,
		urlHistoryManager: IUrlHistoryManager,
		editorSDKHandlers?: EditorLocationWixCodeSdkHandlers
	): SdkHandlersProvider<LocationWixCodeSdkHandlers> => ({
		getSdkHandlers: () => ({
			navigateTo: navigation.navigateTo,
			navigateToSection: editorSDKHandlers ? editorSDKHandlers.navigateToSection : () => Promise.resolve(),
			addQueryParams: (queryParams: { [k: string]: string }) => {
				if (!browserWindow) {
					return
				}

				const url = new URL(browserWindow.location.href)

				_.forEach(queryParams, (value, key) => {
					url.searchParams.set(key, value)
				})

				urlHistoryManager.pushUrlState(url)
			},
			removeQueryParams: (queryParams: Array<string>) => {
				if (!browserWindow) {
					return
				}

				const url = new URL(browserWindow.location.href)

				_.forEach(queryParams, (value) => {
					url.searchParams.delete(value)
				})

				urlHistoryManager.pushUrlState(url)
			},
		}),
	})
)
