import {
	findFirstMatch,
	MatchingResult,
	PatternType,
	replaceEmails,
	replacePhoneNumbers,
	replaceUrls,
	getUrlWithProtocol,
} from './textPatterns'
import {
	LinkProps,
	PhoneLinkData,
	EmailLinkData,
	DocumentLinkData,
	DynamicPageLinkData,
	WhatsAppLinkData,
	AddressLinkData,
	PopupLinkProps,
	BaseDataItem,
	AnchorLinkData,
} from '@wix/thunderbolt-becky-types'
import { RoutersConfigMap } from '@wix/thunderbolt-ssr-api'
import { WHATSAPP_LINK_PREFIX } from './platform/linkPatternUtils'

const PatternToPrefix: { [key in keyof typeof PatternType]: string } = {
	[PatternType.PHONE]: 'tel:',
	[PatternType.MAIL]: 'mailto:',
	[PatternType.URL]: '',
}

const parseLinkValue = ({ pattern, value }: MatchingResult): LinkProps => {
	const baseLinkProps = pattern === PatternType.URL ? ({ target: '_blank' } as const) : {}
	return { ...baseLinkProps, href: `${PatternToPrefix[pattern]}${value}` }
}

const getPropertyName = (key: string) => {
	switch (key) {
		case 'linkPopupId':
			return 'data-popupid'
		case 'anchorDataId':
			return 'data-anchor'
		case 'anchorCompId':
			return 'data-anchor-comp-id'
		default:
			return key
	}
}

export const toQueryString = (queryObject: Record<string, string>) =>
	Object.keys(queryObject)
		.map((key) => `${key}=${encodeURIComponent(queryObject[key])}`)
		.join('&')

const getLinkAttributes = (linkProps?: PopupLinkProps): string => {
	if (linkProps) {
		// if link to popup modify attributes
		if (linkProps.linkPopupId) {
			linkProps.role = 'button'
			linkProps['aria-haspopup'] = 'dialog'
			linkProps.tabindex = '0'
			delete linkProps.href
		}
		return Object.keys(linkProps)
			.map((key) => `${getPropertyName(key)}="${linkProps[key as keyof LinkProps]}"`)
			.join(' ')
	}
	return ''
}

const joinAttributesParts = (attributesParts: Array<string>): string =>
	attributesParts
		.filter((attributesPart) => attributesPart !== '')
		.map((attributesPart) => attributesPart.trim())
		.join(' ')

export const convertDataQueryLinksToHtmlAnchors = (text: string, linkList: Record<string, LinkProps>) =>
	text.replace(/<a ([^>]*)dataquery="#([^"]+)"([^>]*)>/g, (_full, preAttributes, dataQuery, postAttributes) => {
		const linkProps = linkList[dataQuery]
		const fixedAttributes = joinAttributesParts([preAttributes, getLinkAttributes(linkProps), postAttributes])
		return `<a${fixedAttributes ? ` ${fixedAttributes}` : ''}>`
	})

export const getImpliedLink = (text: string, isMobileView: boolean): LinkProps | null => {
	const firstMatch = findFirstMatch(text, { MAIL: true, URL: true, PHONE: isMobileView })
	return firstMatch && parseLinkValue(firstMatch)
}

const getLinkWrapperFunction = (type: 'email' | 'url' | 'phone') => (content: string) => {
	let aTagContent: string = ''
	const href = content.trim()
	switch (type) {
		case 'email':
			aTagContent = `href="mailto:${href}"`
			break
		case 'phone':
			aTagContent = `href="tel:${href}"`
			break
		case 'url':
			aTagContent = `href="${getUrlWithProtocol(href)}" target="_blank"`
			break
		default:
	}
	return `<a data-auto-recognition="true" ${aTagContent}>${content}</a>`
}

export interface GetImpliedLinksConfig {
	parseEscaped: boolean
}

const wrapEmailImpliedLink = getLinkWrapperFunction('email')
const wrapUrlImpliedLink = getLinkWrapperFunction('url')
const wrapPhoneImpliedLink = getLinkWrapperFunction('phone')

const getTextLinkMatcher = (isMobileView: boolean, parseEscaped: boolean) => (fullMatch: string, text?: string) => {
	// If the text matched is escaped and should not be formatted as HTML, return as is
	if (!text || (!parseEscaped && text.startsWith('&lt;'))) {
		return fullMatch
	}
	let textWithLinks = replaceEmails(text, wrapEmailImpliedLink)
	textWithLinks = replaceUrls(textWithLinks, wrapUrlImpliedLink)
	if (isMobileView) {
		textWithLinks = replacePhoneNumbers(textWithLinks, wrapPhoneImpliedLink)
	}

	return fullMatch.split(text).join(textWithLinks)
}

export function getImpliedLinks(
	text: string,
	isMobileView: boolean,
	{ parseEscaped }: GetImpliedLinksConfig = { parseEscaped: false }
) {
	/**
	 * >((?![<>]).+?)< - Lazly search for any text within '>' '<' to extract text nodes
	 * (?:<a.*>.*<\/a>) - Match all inside `a` tags (inclusive), without adding to the capture group
	 * The result - getting only the text, excluding any text/nodes within `a` tags.
	 */
	return text.replace(/>((?![<>]).+?)<|(?:<a.*>.*<\/a>)/g, getTextLinkMatcher(isMobileView, parseEscaped))
}

export const getPostSignupUrl = (postSignupUrl: string): string => {
	const placeholder = '{ifcontext}'
	if (!postSignupUrl.includes(placeholder)) {
		return postSignupUrl
	}

	const [, queryString] = postSignupUrl.split('?')
	const urlSearchParams = new URLSearchParams(queryString)

	let target
	let postSignupUrlWithContext = ''
	urlSearchParams.forEach((value, key) => {
		if (key.toLowerCase() !== 'ifcontext') {
			return
		}

		target = value.replace('#', '')
		if (/^[a-zA-Z0-9]+$/.test(target)) {
			postSignupUrlWithContext = postSignupUrl.replace(placeholder, target)
		} else {
			postSignupUrlWithContext = postSignupUrl.replace(placeholder, 'illegalContextValue')
		}
	})

	return postSignupUrlWithContext || postSignupUrl
}

export const resolveEmailLink = ({ recipient, subject, body }: Omit<EmailLinkData, 'type' | 'id'>): string => {
	const queryString = Object.entries({ subject, body })
		.filter(([, value]) => value)
		.map(([key, value]) => `${key}=${value}`)
		.join('&')

	const query = queryString.length > 0 ? `?${queryString}` : ''
	return `mailto:${recipient}${query}`
}

export const resolvePhoneLink = ({ phoneNumber }: Omit<PhoneLinkData, 'type' | 'id'>): string => `tel:${phoneNumber}`

export const resolveWhatsAppLink = ({ phoneNumber }: Omit<WhatsAppLinkData, 'type'>): string => {
	const sanitizedPhoneNumber = phoneNumber.replace(new RegExp('[+|-]', 'g'), '')
	return `${WHATSAPP_LINK_PREFIX}${sanitizedPhoneNumber}`
}

export const resolveAddressLink = ({ address }: Omit<AddressLinkData, 'type'>): string =>
	`http://maps.google.com/maps?daddr=${encodeURI(address)}`

const getInnerRouteSuffix = (innerRoute?: string) => innerRoute && innerRoute.replace(/^\//, '')

export const resolveDynamicPageLink = (
	externalBaseUrl: string,
	{ innerRoute }: Omit<DynamicPageLinkData, 'type'>,
	routerInfo: RoutersConfigMap['string']
): string => {
	const { prefix } = routerInfo

	const innerRouteSuffix = getInnerRouteSuffix(innerRoute)
	return innerRouteSuffix ? `${externalBaseUrl}/${prefix}/${innerRouteSuffix}` : `${externalBaseUrl}/${prefix}`
}
const isNotFreeSite = (url: string) => {
	const hostname = new URL(url).hostname
	return !hostname.endsWith('.wixsite.com') && !hostname.endsWith('.editorx.io')
}

export const resolveDocumentLink = (
	{ docId, name, indexable }: Omit<DocumentLinkData, 'type' | 'id'>,
	metaSiteId: string,
	userFileDomainUrl: string,
	externalBaseUrl: string,
	isPremiumDomain: boolean
): string => {
	// TODO: bring isPreview and isAFreeSite here instead of naming each site that shouldn't receive premium document feature.
	const isPreview = new URL(externalBaseUrl).hostname.startsWith('editor.wix')

	const conditionToChangeURL =
		docId.endsWith('pdf') && isPremiumDomain && isNotFreeSite(externalBaseUrl) && !isPreview
	const baseUrl = conditionToChangeURL
		? new URL('_files', new URL(externalBaseUrl))
		: `https://${metaSiteId}.${userFileDomainUrl}`

	const prefixedDocId = docId.includes('/') ? docId : `ugd/${docId}`
	const prefixedDocIdWithSlash = prefixedDocId.startsWith('/') ? prefixedDocId : `/${prefixedDocId}`

	const isPDF = docId.endsWith('.pdf')
	const suffix = isPDF ? (indexable ? '?index=true' : '') : `?${toQueryString({ dn: name })}`

	return `${baseUrl}${prefixedDocIdWithSlash}${suffix}`
}

export const hasLinkDataWithCurrentRouteAnchors = (
	dataItem: BaseDataItem & {
		anchorDataId?: AnchorLinkData['anchorDataId']
		innerRoute?: DynamicPageLinkData['innerRoute']
		link?: DynamicPageLinkData | AnchorLinkData
		items?: Array<BaseDataItem>
		linkList?: Array<BaseDataItem>
	}
): boolean => {
	const subDataItems = dataItem?.items || dataItem?.linkList || []
	const anchorDataId = dataItem?.anchorDataId || dataItem?.link?.anchorDataId || ''
	const innerRoute = dataItem?.innerRoute || ((dataItem?.link as BaseDataItem) as DynamicPageLinkData)?.innerRoute
	const isLinkWithTopBottomAnchor = ['SCROLL_TO_TOP', 'SCROLL_TO_BOTTOM'].includes(anchorDataId)
	const isCurrentInnerRouteDynamicPageLink = innerRoute === 'CURRENT_INNER_ROUTE'

	return (
		isLinkWithTopBottomAnchor ||
		isCurrentInnerRouteDynamicPageLink ||
		subDataItems.some((item) => hasLinkDataWithCurrentRouteAnchors(item))
	)
}
