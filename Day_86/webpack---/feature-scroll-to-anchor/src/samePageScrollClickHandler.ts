import { withDependencies } from '@wix/thunderbolt-ioc'
import { ILinkClickHandler } from '@wix/thunderbolt-symbols'
import type { ISamePageScroll } from './types'
import { SamePageScrollSymbol } from './symbols'
import {
	IUrlHistoryManager,
	UrlHistoryManagerSymbol,
	removeQueryParams,
	replaceProtocol,
	removeUrlHash,
	getUrlHash,
} from 'feature-router'
import { TOP_ANCHOR } from './constants'

export const samePageScrollClickHandlerFactory = (
	samePageScroll: ISamePageScroll,
	urlHistoryManager: IUrlHistoryManager
): ILinkClickHandler => ({
	handleClick: (anchor) => {
		const anchorHref = anchor.getAttribute('href')
		if (!anchorHref) {
			return false
		}

		if (anchorHref === '#') {
			return samePageScroll.scrollToAnchor({ anchorDataId: TOP_ANCHOR })
		}

		const href = replaceProtocol(anchorHref, urlHistoryManager.getParsedUrl().protocol)
		const cleanAnchorHref = removeUrlHash(removeQueryParams(href))
		const cleanCurrentUrl = urlHistoryManager.getFullUrlWithoutQueryParams()

		const isCurrentPageNavigation = cleanAnchorHref === cleanCurrentUrl
		const isLinkToNewTab = anchor.getAttribute('target') === '_blank'
		if (isLinkToNewTab || !isCurrentPageNavigation) {
			return false
		}

		const anchorCompId = anchor.getAttribute('data-anchor-comp-id') || getUrlHash(href) || ''
		const anchorDataId = anchor.getAttribute('data-anchor') || ''
		if (!anchorCompId && !anchorDataId && isCurrentPageNavigation) {
			// reflect any query params changes in the url history on same page navigation
			urlHistoryManager.pushUrlState(new URL(href as string))

			// Need to scroll to top of the page if anchor href is for current page
			return samePageScroll.scrollToAnchor({ anchorDataId: TOP_ANCHOR })
		}

		return samePageScroll.scrollToAnchor({ anchorDataId, anchorCompId })
	},
})

export const SamePageScrollClickHandler = withDependencies(
	[SamePageScrollSymbol, UrlHistoryManagerSymbol],
	samePageScrollClickHandlerFactory
)
