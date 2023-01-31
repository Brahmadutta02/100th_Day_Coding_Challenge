import _ from 'lodash'
import { LinkUtils, LinkUtilsConfig } from '@wix/thunderbolt-symbols'
import {
	AnchorLinkData,
	EmailLinkData,
	PhoneLinkData,
	PageLinkData,
	DocumentLinkData,
	ExternalLinkData,
	LinkProps,
	DynamicPageLinkData,
	LinkData,
	TpaPageLinkData,
} from '@wix/thunderbolt-becky-types'
import {
	resolveEmailLink,
	resolvePhoneLink,
	resolveDocumentLink,
	getImpliedLink,
	getImpliedLinks,
	GetImpliedLinksConfig,
} from '../links'
import { isMailtoUrl, isPhoneUrl, PHONE_URL_REGEXP, MAILTO_URL_REGEXP } from './linkPatternUtils'

type LinkTarget = LinkProps['target']
type LinkType = LinkProps['type']

const PAGE_URL_REGEXP = /^\/([^ ?#]*)?[#]?([^ ?#]*)[?]?(.*)/
const SAME_PAGE_WITH_ANCHOR_REGEXP = /^#([^ ?]*)[?]?(.*)/
const ABSOLUTE_URL_REGEXP = /^(http|https):\/\/(.*)/
const DOCUMENT_URL_REGEXP = /^wix:document:\/\/v1\/(.+)\/(.+)/
const LEGACY_DOCUMENT_URL_REGEXP = /^document:\/\/(.*)/

const ANCHOR_NAME_TO_TYPE: Record<string, string> = {
	top: 'SCROLL_TO_TOP',
	bottom: 'SCROLL_TO_BOTTOM',
}

const getPhoneLinkProps = (telUrl: string): LinkProps => {
	const [, phoneNumber] = PHONE_URL_REGEXP.exec(telUrl)!
	return {
		type: 'PhoneLink',
		href: resolvePhoneLink({ phoneNumber }),
		target: '_self',
	}
}

const getMailtoLinkProps = (mailtoUrl: string): LinkProps => {
	const [, recipient, subject] = MAILTO_URL_REGEXP.exec(mailtoUrl)!

	const escapedRecipient = _.escape(recipient)
	const escapedSubject = _.escape(subject)

	return {
		type: 'EmailLink',
		href: resolveEmailLink({ recipient: escapedRecipient, subject: escapedSubject } as EmailLinkData),
		target: '_self',
	}
}

const isDocumentUrl = (url: string) => DOCUMENT_URL_REGEXP.test(url) || LEGACY_DOCUMENT_URL_REGEXP.test(url)

const isAbsoluteUrl = (url: string) => ABSOLUTE_URL_REGEXP.test(url)

const isPageUrl = (href: string) => PAGE_URL_REGEXP.test(href)

const isSamePageAnchorUrl = (href: string) => SAME_PAGE_WITH_ANCHOR_REGEXP.test(href)

const isDynamicPage = (routersConfig: LinkUtilsConfig['routersConfig'], pageUriSeo: string) => {
	if (routersConfig) {
		const [prefix] = pageUriSeo.replace('#', '/#').split(/[/]+/)
		const routersWithPrefixFromUrl = Object.values(routersConfig).filter((router) => router.prefix === prefix)
		return routersWithPrefixFromUrl.length === 1
	}

	return false
}

const getPageRoute = (routingInfo: LinkUtilsConfig['routingInfo'], pageId: string): string => {
	const pageRoute = _.findKey(routingInfo.routes, (route) => {
		if (route.type === 'Dynamic') {
			const pageIds = route.pageIds || []
			return pageIds.includes(pageId)
		}

		return route.pageId === pageId
	})

	if (pageRoute) {
		return removeLeadingDotFromRoute(pageRoute)
	}

	throw new Error(`No url route for pageId: ${pageId}`)
}

class UnsupportedLinkTypeError extends Error {
	constructor() {
		super('Unsupported link type')
		this.name = 'UnsupportedLinkTypeError'

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, UnsupportedLinkTypeError)
		}
	}
}

export const isLinkProps = (linkProps: any): linkProps is LinkProps =>
	!linkProps.id && !!(linkProps.href || linkProps.linkPopupId || linkProps.anchorDataId || linkProps.anchorCompId)

const removeLeadingDotFromRoute = (url: string) => url.replace(/^\.\//, '/')

const isScrollTopOrBottomAnchor = (anchorDataId: string) => ['SCROLL_TO_TOP', 'SCROLL_TO_BOTTOM'].includes(anchorDataId)

export const createLinkUtils = ({
	routingInfo,
	metaSiteId,
	userFileDomainUrl,
	popupPages,
	getCompIdByWixCodeNickname,
	getRoleForCompId,
	routersConfig,
	multilingualInfo,
	isMobileView,
	isPremiumDomain,
}: LinkUtilsConfig): LinkUtils => {
	const BASE_DOCUMENTS_URL = `https://${metaSiteId}.${userFileDomainUrl}/`

	const isPopupId = (pageId: string) => (popupPages ? popupPages[pageId] : false)

	const isDocumentHref = (href: string) => href.startsWith(BASE_DOCUMENTS_URL)
	const getDocumentLink = (docId: string, name: string = '') => `wix:document://v1/${docId}/${name}`

	const removeBaseUrlFromHref = (href: string) => href.replace(routingInfo.externalBaseUrl, '')

	const getDocumentLinkProps = (documentUrl: string): LinkProps => {
		const [, docId, name] = DOCUMENT_URL_REGEXP.exec(documentUrl) || LEGACY_DOCUMENT_URL_REGEXP.exec(documentUrl)!

		return {
			type: 'DocumentLink',
			href: resolveDocumentLink(
				{ docId, name: name || '', indexable: false },
				metaSiteId,
				userFileDomainUrl,
				routingInfo.externalBaseUrl,
				isPremiumDomain
			),
			target: '_blank',
			docInfo: {
				docId,
				name,
			},
		}
	}

	const getExternalLinkProps = (url: string, target: LinkTarget = '_blank'): LinkProps => {
		return {
			type: 'ExternalLink',
			href: url,
			target,
			rel: 'noopener',
		}
	}

	const parsePageUrl = (url: string) => {
		const [, relativePageUrlPrefix = '', anchor = '', queryString = ''] = PAGE_URL_REGEXP.exec(url)!
		const queryParams = new URLSearchParams(queryString)
		if (
			!multilingualInfo?.isOriginalLanguage &&
			multilingualInfo?.currentLanguage?.resolutionMethod === 'QueryParam'
		) {
			queryParams.set('lang', multilingualInfo.currentLanguage.languageCode)
		}

		return { relativePageUrlPrefix, anchor, queryString: queryParams.toString() }
	}

	const isDynamicPageUrl = (url: string) => {
		const { relativePageUrlPrefix } = parsePageUrl(url)
		return isDynamicPage(routersConfig, relativePageUrlPrefix)
	}

	const getHomePageRouteWithPageUriSEO = () => {
		const mainPageRoute = _.findKey(routingInfo.routes, (route) => route.pageId === routingInfo.mainPageId)!
		return removeLeadingDotFromRoute(mainPageRoute)
	}

	const getPageLinkProps = (pageUrl: string, target: LinkTarget = '_self') => {
		const { relativePageUrlPrefix = '', anchor = '', queryString } = parsePageUrl(pageUrl)
		const anchorNickname = ANCHOR_NAME_TO_TYPE[anchor] || anchor

		if (isPopupId(relativePageUrlPrefix)) {
			return {
				type: 'PageLink' as LinkType,
				href: '',
				target: '_self' as LinkTarget,
				linkPopupId: relativePageUrlPrefix,
			}
		}
		const externalBaseUrl = routingInfo.externalBaseUrl

		let type: LinkType
		let href
		let isSamePageNavigation
		if (isDynamicPage(routersConfig, relativePageUrlPrefix)) {
			const relativeHref = `./${relativePageUrlPrefix}`
			isSamePageNavigation = relativeHref === routingInfo.relativeUrl
			type = 'DynamicPageLink'
			href = `${externalBaseUrl}/${relativePageUrlPrefix}`
		} else {
			// Page route / TPA page route with inner route(s)
			const [pageUriSeo, ...tpaInnerRoute] = relativePageUrlPrefix.split('/')
			const tpaInnerRoutePath = tpaInnerRoute.length > 0 ? `/${tpaInnerRoute.join('/')}` : ''

			// support encoded URI with non-latin characters
			const decodedPageUriSeo = decodeURIComponent(pageUriSeo)
			const pageRoute = `./${decodedPageUriSeo}`
			const nextRouteConfig =
				pageRoute === './' ? { pageId: routingInfo.mainPageId } : routingInfo.routes[pageRoute]
			const isHomePageNavigation = nextRouteConfig?.pageId === routingInfo.mainPageId

			type = 'PageLink'
			href =
				isHomePageNavigation && !tpaInnerRoutePath
					? externalBaseUrl
					: `${externalBaseUrl}/${decodedPageUriSeo}${tpaInnerRoutePath}`

			isSamePageNavigation = nextRouteConfig && nextRouteConfig.pageId === routingInfo.pageId
		}

		const anchorCompId = anchorNickname && getCompIdByWixCodeNickname && getCompIdByWixCodeNickname(anchorNickname)
		const hasAnchorOnSamePage = isSamePageNavigation && anchorCompId
		const hasAnchorOnOtherPage = anchorNickname && !hasAnchorOnSamePage

		return {
			href: `${href}${queryString ? `?${new URLSearchParams(queryString).toString()}` : ''}`,
			target,
			type,
			// if we have an anchor on the current page, we set the anchor compId
			...(hasAnchorOnSamePage && { anchorCompId }),
			// if we have an anchor on another page, we set the anchor data item Id
			...(hasAnchorOnOtherPage && { anchorDataId: anchorNickname }),
		}
	}

	const encodeInnerRoute = (innerRoute: string) => {
		const [innerRoutePath, stateQueryParams] = innerRoute.split('?')
		if (stateQueryParams) {
			const encodedQueryParams = encodeURIComponent(`?${stateQueryParams}`)
			return innerRoutePath ? `${innerRoutePath}${encodedQueryParams}` : encodedQueryParams
		}
		return innerRoutePath
	}

	return {
		isAbsoluteUrl,
		isDynamicPage: isDynamicPageUrl,
		getImpliedLink: (text: string) => getImpliedLink(text, isMobileView),
		getImpliedLinks: (text: string, config?: GetImpliedLinksConfig) => getImpliedLinks(text, isMobileView, config),
		getLink: ({
			href: linkHref = '',
			linkPopupId,
			anchorCompId = '',
			anchorDataId = '',
			docInfo,
			type,
		}: LinkProps = {}) => {
			if (linkPopupId) {
				return `/${linkPopupId}`
			}

			if (isMailtoUrl(linkHref)) {
				return linkHref
			}

			if (isDocumentHref(linkHref)) {
				return getDocumentLink(docInfo!.docId, docInfo!.name)
			}

			if (isScrollTopOrBottomAnchor(anchorDataId)) {
				return `#${_.invert(ANCHOR_NAME_TO_TYPE)[anchorDataId]}`
			}

			const isExternalLink = type === 'ExternalLink'
			if (isExternalLink) {
				return linkHref
			}

			// remove query params if exist
			const [href] = linkHref.split('?')
			const anchor = getRoleForCompId?.(anchorCompId, 'wixCode') || anchorDataId
			const anchorId = anchor ? `#${anchor}` : ''
			const isHomePageUrl = href === routingInfo.externalBaseUrl
			const link = isHomePageUrl ? getHomePageRouteWithPageUriSEO() : removeBaseUrlFromHref(href)

			return `${link}${anchorId}`
		},
		getLinkProps: (url, target) => {
			if (isSamePageAnchorUrl(url)) {
				const relativeUrl = removeLeadingDotFromRoute(routingInfo.relativeUrl)
				const currentPageUriSEOWithAnchorUrl = `${relativeUrl}${url}`
				return getPageLinkProps(currentPageUriSEOWithAnchorUrl, target)
			}

			if (isPageUrl(url)) {
				return getPageLinkProps(url, target)
			}

			if (isMailtoUrl(url)) {
				return getMailtoLinkProps(url)
			}

			if (isPhoneUrl(url)) {
				return getPhoneLinkProps(url)
			}

			if (isAbsoluteUrl(url)) {
				return getExternalLinkProps(url, target)
			}

			if (isDocumentUrl(url)) {
				return getDocumentLinkProps(url)
			}

			throw new UnsupportedLinkTypeError()
		},
		getLinkUrlFromDataItem: <T extends LinkData>(linkData: T) => {
			const linkTypeToUrlResolverFn: Record<string, () => string> = {
				AnchorLink: () => {
					const { anchorDataId, pageId } = linkData as AnchorLinkData
					const isScrollTopOrBottom = isScrollTopOrBottomAnchor(anchorDataId)
					const nextPageId = isScrollTopOrBottom ? routingInfo.pageId : pageId.replace(/^#/, '')
					const nextAnchorDataId = anchorDataId.startsWith('#') ? anchorDataId : `#${anchorDataId}`

					// get page route for current page id for top/bottom anchors, otherwise get route for pageId from data item
					const pageRoute = getPageRoute(routingInfo, nextPageId)
					return `${pageRoute}${nextAnchorDataId}`
				},
				DocumentLink: () => {
					const { docId, name } = linkData as DocumentLinkData
					return getDocumentLink(docId, name)
				},
				ExternalLink: () => {
					const { url } = linkData as ExternalLinkData
					return url
				},
				DynamicPageLink: () => {
					const { routerId, innerRoute, anchorDataId = '' } = linkData as DynamicPageLinkData
					const prefix = `/${routersConfig![routerId].prefix}`

					// query params passed in the innerRoute should be encoded as a path to properly apply them to the section after navigation
					const encodedInnerRoute = innerRoute ? encodeInnerRoute(innerRoute) : innerRoute
					const suffix = encodedInnerRoute ? `/${encodedInnerRoute}${anchorDataId}` : anchorDataId
					return `${prefix}${suffix}`
				},
				TpaPageLink: () => {
					const { pageId, path = '' } = linkData as TpaPageLinkData
					const _pageId = pageId.replace(/^#/, '')
					const prefix = getPageRoute(routingInfo, _pageId)
					const encodedPath = encodeInnerRoute(path)
					const isPathWithPageUriSEO = path.startsWith(prefix)
					if (isPathWithPageUriSEO) {
						return encodedPath
					}

					const suffix = encodedPath ? `/${encodedPath}` : ''
					return `${prefix}${suffix}`
				},
				PageLink: () => {
					const { pageId: pageIdOrData } = linkData as PageLinkData
					const pageId = ((typeof pageIdOrData === 'string' ? pageIdOrData : pageIdOrData.id) || '').replace(
						/^#/,
						''
					)
					if (isPopupId(pageId)) {
						return `/${pageId}`
					}

					if (pageId === routingInfo.mainPageId) {
						return '/'
					}

					return getPageRoute(routingInfo, pageId)
				},
				PhoneLink: () => resolvePhoneLink(linkData as PhoneLinkData),
				EmailLink: () => resolveEmailLink(linkData as EmailLinkData),
			}

			const linkUrlResolverFn = linkTypeToUrlResolverFn[linkData.type]
			if (linkUrlResolverFn) {
				return linkUrlResolverFn()
			}

			throw new Error('Provided link type is not supported')
		},
	}
}
