import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	IPageDidMountHandler,
	BrowserWindow,
	BrowserWindowSymbol,
	IComponentsStylesOverrides,
	ComponentsStylesOverridesSymbol,
} from '@wix/thunderbolt-symbols'
import fastdom from 'fastdom'
import { name } from './symbols'

/**
 * This feature sets the height of the site's header placeholder to the same height of the header.
 * It fixes a bug described on https://jira.wixpress.com/browse/TB-3122
 */
export const HeaderPlaceholderHeight = withDependencies(
	[BrowserWindowSymbol, named(ComponentsStylesOverridesSymbol, name)],
	(
		window: NonNullable<BrowserWindow>,
		componentsStylesOverrides: IComponentsStylesOverrides
	): IPageDidMountHandler => {
		const resizeHeader = () => {
			fastdom.measure(() => {
				const siteHeader = window.document.getElementById('SITE_HEADER')
				if (!siteHeader) {
					return
				}

				const resizeObserver = new window.ResizeObserver(() => {
					componentsStylesOverrides.update({
						'SITE_HEADER-placeholder': {
							height: `${siteHeader.offsetHeight}px`,
						},
					})
				})

				resizeObserver.observe(siteHeader)
			})
		}

		return {
			pageDidMount: resizeHeader,
		}
	}
)
