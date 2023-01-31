import { withDependencies } from '@wix/thunderbolt-ioc'
import { PagesMapSymbol } from '@wix/thunderbolt-symbols'
import type { IRoutingMiddleware, IPagesMap } from './types'
import { errorPagesIds } from '@wix/thunderbolt-commons'

const pageJsonFileNameMiddleware = (pagesMap: IPagesMap): IRoutingMiddleware => ({
	handle: async (routeInfo) => {
		if (!routeInfo.pageId) {
			throw new Error(`did not find the pageId for the requested url ${routeInfo.parsedUrl?.pathname}`)
		}

		const isErrorPage = errorPagesIds[routeInfo.pageId!]
		const pageJsonFileName = isErrorPage
			? routeInfo.pageId
			: pagesMap.getPageById(routeInfo.pageId!)?.pageJsonFileName

		return {
			...routeInfo,
			pageJsonFileName,
		}
	},
})

export const PageJsonFileNameMiddleware = withDependencies([PagesMapSymbol], pageJsonFileNameMiddleware)
