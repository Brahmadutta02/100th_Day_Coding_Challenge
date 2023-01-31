import { withDependencies } from '@wix/thunderbolt-ioc'
import { BrowserWindow, BrowserWindowSymbol, IPageDidMountHandler } from '@wix/thunderbolt-symbols'
import { OnLinkClick } from './symbols'
import { IOnLinkClickHandler } from './types'

const clickHandlerRegistrarFactory = (
	browserWindow: NonNullable<BrowserWindow>,
	{ onLinkClick }: IOnLinkClickHandler
): IPageDidMountHandler => {
	return {
		pageDidMount: () => {
			browserWindow.addEventListener('click', onLinkClick)

			return () => {
				browserWindow.removeEventListener('click', onLinkClick)
			}
		},
	}
}

export const ClickHandlerRegistrar = withDependencies([BrowserWindowSymbol, OnLinkClick], clickHandlerRegistrarFactory)
