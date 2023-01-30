import { CandidateRouteInfo } from 'feature-router'

export const errorPagesIds = {
	FORBIDDEN: '_403_dp',
	NOT_FOUND: '_404_dp',
	INTERNAL_ERROR: '_500_dp',
	UKNOWN_ERROR: '_uknown_error_dp',
}

const FORBIDDEN = 403
const NOT_FOUND = 404

export const getErrorPageId = (
	{ status, page, redirectUrl }: { status: number; page: string; redirectUrl: string },
	exception: string | undefined
): string | null => {
	if (exception) {
		return errorPagesIds.INTERNAL_ERROR
	}

	if (status === FORBIDDEN) {
		return errorPagesIds.FORBIDDEN
	}

	if (status === NOT_FOUND) {
		return errorPagesIds.NOT_FOUND
	}

	if (!page && !redirectUrl) {
		return errorPagesIds.UKNOWN_ERROR
	}

	return null
}

const getPathParts = (relativeUrl: string): Array<string> => relativeUrl.replace('./', '').split('/')

export const isExternalUrl = (url: string): boolean => /(^https?)|(^data)|(^blob)|(^\/\/)/.test(url)

export const getRelativeUrl = (redirectUrl: string, routerPrefix: string): string =>
	/^\/(.*)/.test(redirectUrl) ? `.${redirectUrl}` : `./${routerPrefix}/${redirectUrl}`

export const getRouterSuffix = (relativeEncodedUrl: string): string => {
	// We need to use relativeEncodedUrl because router suffix can contain any charecter,
	// and in case of suffix with slash we have to use encoded value to prevent splitting the suffix to two url parts
	// e.g http://mysite.com/router-1/good%2Fevil -> relativeUrl will be './router-1/good/evil'
	// and relativeEncodedUrl will be './router-1/good%2Fevil'
	const remainingPathParts = getPathParts(relativeEncodedUrl).slice(1)

	return `/${remainingPathParts.join('/')}`
}

export const getRouterPrefix = (relativeUrl: string): string => getPathParts(relativeUrl)[0]

export const getSuccessResponse = (routeInfo: Partial<CandidateRouteInfo>, data: any): Partial<CandidateRouteInfo> => {
	const { page: pageId, data: pageData, head: pageHeadData, tpaInnerRoute, publicData } = data.result

	return {
		...routeInfo,
		pageId,
		dynamicRouteData: {
			pageData,
			pageHeadData,
			publicData,
			tpaInnerRoute,
		},
	}
}
