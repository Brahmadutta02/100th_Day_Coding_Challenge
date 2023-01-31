import { withDependencies } from '@wix/thunderbolt-ioc'
import type { IRouter, ICommonNavigationClickHandler } from './types'
import { Router } from './symbols'
import { getUrlHash } from './urlUtils'

const commonNavigationClickHandlerFactory = (router: IRouter): ICommonNavigationClickHandler => {
	return {
		commonNavigationClickHandler: (anchor) => {
			const href = anchor.getAttribute('href')
			if (!href) {
				return false
			}
			if (anchor.getAttribute('target') === '_blank') {
				return false
			}
			const isInternalRoute = router.isInternalValidRoute(href)

			if (isInternalRoute) {
				const hashAnchor = getUrlHash(href)
				const dataAnchor = anchor.getAttribute('data-anchor')
				const anchorDataId = dataAnchor || hashAnchor || 'SCROLL_TO_TOP'

				router.navigate(href, { anchorDataId })
				return true
			}
			return false
		},
	}
}

export const CommonNavigationClickHandler = withDependencies([Router], commonNavigationClickHandlerFactory)
