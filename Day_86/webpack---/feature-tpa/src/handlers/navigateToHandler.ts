import { optional, withDependencies, named } from '@wix/thunderbolt-ioc'
import { INavigation, NavigationSymbol } from 'feature-navigation'
import { createLinkUtils } from '@wix/thunderbolt-commons'
import { SiteFeatureConfigSymbol, TpaHandlerProvider, StructureAPI, IStructureAPI } from '@wix/thunderbolt-symbols'
import { IRoutingLinkUtilsAPI, RoutingLinkUtilsAPISymbol } from 'feature-router'
import { ILightboxesLinkUtilsAPI, LightboxesLinkUtilsAPISymbol } from 'feature-lightbox'
import { LinkData, PageLinkData } from '@wix/thunderbolt-becky-types'
import { PageTransitionsSymbol, IPageTransition } from 'feature-page-transitions'
import { name as tpaCommonsName, TpaCommonsSiteConfig } from 'feature-tpa-commons'
import { TPA_HANDLER_EMPTY_RESPONSE, LINK_TYPES } from '../utils/constants'
import { IMultilingualLinkUtilsAPI, MultilingualLinkUtilsAPISymbol } from 'feature-multilingual'

export type NavigateToMessageData = {
	link: LinkData
}

export type NavigateToAnchorMessageData = {
	anchorId: string
}

export type NavigateToPageMessageData = {
	pageId: string
	anchorId?: string
	noTransition?: boolean
}

export type NavigateToComponentMessageData = {
	compId: string
	pageId?: string
	noPageTransition?: boolean
}

export const NavigateToHandler = withDependencies(
	[
		named(SiteFeatureConfigSymbol, tpaCommonsName),
		NavigationSymbol,
		RoutingLinkUtilsAPISymbol,
		StructureAPI,
		optional(LightboxesLinkUtilsAPISymbol),
		optional(MultilingualLinkUtilsAPISymbol),
		optional(PageTransitionsSymbol),
	],
	(
		tpaCommonsSiteConfig: TpaCommonsSiteConfig,
		navigation: INavigation,
		routingLinkUtilsAPI: IRoutingLinkUtilsAPI,
		structureApi: IStructureAPI,
		popupsLinkUtilsAPI?: ILightboxesLinkUtilsAPI,
		multilingualLinkUtilsAPI?: IMultilingualLinkUtilsAPI,
		pageTransitions?: IPageTransition
	): TpaHandlerProvider => {
		const getLinkProps = (link: LinkData) => {
			const {
				metaSiteId,
				userFileDomainUrl,
				routersConfig,
				isMobileView,
				isPremiumDomain,
				experiments,
			} = tpaCommonsSiteConfig
			const linkUtils = createLinkUtils({
				routingInfo: routingLinkUtilsAPI.getLinkUtilsRoutingInfo(),
				metaSiteId,
				userFileDomainUrl,
				routersConfig,
				popupPages: popupsLinkUtilsAPI?.getLightboxPages(),
				multilingualInfo: multilingualLinkUtilsAPI?.getMultilingualInfo(),
				isMobileView,
				isPremiumDomain,
				experiments,
			})

			const linkUrl = linkUtils.getLinkUrlFromDataItem(link)
			return linkUtils.getLinkProps(linkUrl)
		}

		const getNavigateToPageLinkData = ({ pageId, anchorId }: { pageId: string; anchorId?: string }) => {
			const pageLinkData = { type: 'PageLink', pageId, target: '_self' } as PageLinkData
			const linkProps = getLinkProps(pageLinkData)

			if (anchorId) {
				if (routingLinkUtilsAPI.getLinkUtilsRoutingInfo().pageId === pageId) {
					linkProps.anchorCompId = anchorId
				} else {
					linkProps.anchorDataId = anchorId
				}
			}
			return linkProps
		}

		const navigateToPage = ({
			pageId,
			anchorId,
			noTransition,
		}: {
			pageId: string
			anchorId?: string
			noTransition?: boolean
		}) => {
			const linkProps = getNavigateToPageLinkData({ pageId, anchorId })

			if (noTransition && pageTransitions) {
				pageTransitions.disableNextTransition()
			}

			return navigation.navigateTo(linkProps)
		}

		return {
			getTpaHandlers() {
				return {
					navigateToPage(_compId: string, { pageId, anchorId, noTransition }: NavigateToPageMessageData) {
						navigateToPage({ pageId, anchorId, noTransition })
					},
					navigateTo(_compId: string, { link }: NavigateToMessageData) {
						if (link.type === LINK_TYPES.EXTERNAL_LINK) {
							// navigation is handled within the sdk due to popup blockers
							// https://github.com/wix-private/js-sdk/blob/8b2b20ba869214b82746f2b1a3eeb0216e67d70c/js/modules/Base.js#L241
							return
						}
						const linkProps = getLinkProps(link)
						navigation.navigateTo(linkProps)
					},
					async navigateToAnchor(_compId: string, { anchorId }: NavigateToAnchorMessageData) {
						const didNavigate = await navigateToPage({
							pageId: routingLinkUtilsAPI.getLinkUtilsRoutingInfo().pageId,
							anchorId,
						})
						if (!didNavigate) {
							throw new Error(`anchor with id "${anchorId}" was not found on the current page.`)
						}
						return TPA_HANDLER_EMPTY_RESPONSE
					},
					async navigateToComponent(
						_compId: string,
						{ compId, pageId: targetPageId, noPageTransition }: NavigateToComponentMessageData
					) {
						const page = targetPageId || routingLinkUtilsAPI.getLinkUtilsRoutingInfo().pageId
						const didNavigate = await navigateToPage({
							pageId: page,
							anchorId: compId,
							noTransition: noPageTransition,
						})
						if (!didNavigate) {
							throw new Error(`Page id "${page}" does not contain the component id "${compId}".`)
						}
						return TPA_HANDLER_EMPTY_RESPONSE
					},
				}
			},
		}
	}
)
