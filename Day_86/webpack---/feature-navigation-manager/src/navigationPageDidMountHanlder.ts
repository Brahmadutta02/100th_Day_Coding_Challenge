import { withDependencies } from '@wix/thunderbolt-ioc'
import { IPageDidMountHandler, IPageDidUnmountHandler } from '@wix/thunderbolt-symbols'
import type { INavigationManager } from './types'
import { NavigationManagerSymbol } from './symbols'

export const NavigationPageDidMountHandler = withDependencies(
	[NavigationManagerSymbol],
	(navigationManager: INavigationManager): IPageDidMountHandler & IPageDidUnmountHandler => {
		return {
			pageDidMount: () => {
				if (navigationManager.isFirstNavigation()) {
					navigationManager.endNavigation()
				}
			},
			pageDidUnmount: () => {
				if (!navigationManager.isFirstNavigation()) {
					navigationManager.endNavigation()
				}
			},
		}
	}
)
