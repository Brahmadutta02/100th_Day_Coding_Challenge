import { withDependencies } from '@wix/thunderbolt-ioc'
import type { ICommonNavigationClickHandler } from './types'
import { CommonNavigationClickHandlerSymbol } from './symbols'
import { ILinkClickHandler } from '@wix/thunderbolt-symbols'

const navigationClickHandlerFactory = ({
	commonNavigationClickHandler,
}: ICommonNavigationClickHandler): ILinkClickHandler => {
	return {
		handleClick: (anchor) => {
			return commonNavigationClickHandler(anchor)
		},
	}
}

export const NavigationClickHandler = withDependencies(
	[CommonNavigationClickHandlerSymbol],
	navigationClickHandlerFactory
)
