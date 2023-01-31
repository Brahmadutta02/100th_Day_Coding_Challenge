import { named, optional, withDependencies } from '@wix/thunderbolt-ioc'
import {
	TpaHandlerProvider,
	CurrentRouteInfoSymbol,
	PageFeatureConfigSymbol,
	Props,
	IPropsStore,
	SiteFeatureConfigSymbol,
	ViewerModel,
	ViewerModelSym,
	CompEventSymbol,
} from '@wix/thunderbolt-symbols'
import { NavigationSymbol, INavigation } from 'feature-navigation'
import { ICurrentRouteInfo, IRoutingLinkUtilsAPI, RoutingLinkUtilsAPISymbol } from 'feature-router'
import _ from 'lodash'
import { createLinkUtils, isLinkProps } from '@wix/thunderbolt-commons'
import { ILightboxesLinkUtilsAPI, LightboxesLinkUtilsAPISymbol } from 'feature-lightbox'
import { name, TpaEventsListenerManagerSymbol } from '../symbols'
import { ITPAEventsListenerManager, TpaPageConfig } from '../types'
import { PageLinkData, TpaPageLinkData } from '@wix/thunderbolt-becky-types'
import { ImageZoomAPISymbol, ImageZoomAPI } from 'feature-image-zoom'
import { name as tpaCommonsName, TpaCommonsSiteConfig } from 'feature-tpa-commons'
import { IMultilingualLinkUtilsAPI, MultilingualLinkUtilsAPISymbol } from 'feature-multilingual'

export type ReplaceSectionStateMessage = { state: string; queryParams?: Record<string, string> }
export type AppStateChangedMessage = { state: string }

export const ReplaceSectionStateHandler = withDependencies(
	[
		named(SiteFeatureConfigSymbol, tpaCommonsName),
		named(PageFeatureConfigSymbol, name),
		ViewerModelSym,
		CurrentRouteInfoSymbol,
		Props,
		NavigationSymbol,
		TpaEventsListenerManagerSymbol,
		RoutingLinkUtilsAPISymbol,
		optional(LightboxesLinkUtilsAPISymbol),
		optional(ImageZoomAPISymbol),
		optional(MultilingualLinkUtilsAPISymbol),
	],
	(
		tpaSiteConfig: TpaCommonsSiteConfig,
		tpaPageConfig: TpaPageConfig,
		viewerModel: ViewerModel,
		currentRouteInfo: ICurrentRouteInfo,
		propsStore: IPropsStore,
		navigation: INavigation,
		tpaEventsListenerManager: ITPAEventsListenerManager,
		routingLinkUtilsAPI: IRoutingLinkUtilsAPI,
		popupsLinkUtilsAPI: ILightboxesLinkUtilsAPI,
		zoomAPI: ImageZoomAPI,
		multilingualLinkUtilsAPI: IMultilingualLinkUtilsAPI
	): TpaHandlerProvider => ({
		getTpaHandlers() {
			const getLinkUtils = (routingInfo = routingLinkUtilsAPI.getLinkUtilsRoutingInfo()) => {
				const {
					metaSiteId,
					userFileDomainUrl,
					routersConfig,
					isMobileView,
					isPremiumDomain,
					experiments,
				} = tpaSiteConfig
				return createLinkUtils({
					routingInfo,
					metaSiteId,
					userFileDomainUrl,
					routersConfig,
					popupPages: popupsLinkUtilsAPI?.getLightboxPages(),
					multilingualInfo: multilingualLinkUtilsAPI?.getMultilingualInfo(),
					isMobileView,
					isPremiumDomain,
					experiments,
				})
			}

			const replaceState = async ({
				compId,
				state,
				skipHistory,
				queryParams = {},
				disableScrollToTop = true,
			}: {
				compId: string
				state: string
				skipHistory: boolean
				disableScrollToTop?: boolean
				queryParams?: Record<string, string>
			}) => {
				const routingInfo = routingLinkUtilsAPI.getLinkUtilsRoutingInfo()
				const linkUtils = getLinkUtils(routingInfo)

				const { widgets } = tpaPageConfig
				const isTpaSection = widgets[compId]?.isSection
				if (!isTpaSection) {
					return
				}

				// current page link data
				const linkData = {
					type: 'TpaPageLink',
					pageId: routingInfo.pageId,
					path: state,
				} as TpaPageLinkData
				const linkUrl = linkUtils.getLinkUrlFromDataItem(linkData)

				const queryParamsUrl = _.isEmpty(queryParams)
					? ''
					: `?appSectionParams=${encodeURIComponent(JSON.stringify(queryParams))}`
				const url = `${linkUrl}${queryParamsUrl}`

				const linkProps = linkUtils.getLinkProps(url)
				await navigation.navigateTo(linkProps, { skipHistory, disableScrollToTop })
			}

			return {
				async replaceSectionState(_compId, { state, queryParams }: ReplaceSectionStateMessage): Promise<void> {
					return replaceState({ compId: _compId, skipHistory: true, state, queryParams })
				},
				async appStateChanged(_compId, { state }: AppStateChangedMessage): Promise<void> {
					// state can either be a string or a stringified cmd/args JSON such as "{"cmd":"zoom","args":[0]}"
					// used in TPA galleries
					let parsedState: { cmd: string; args?: Array<any> } | null
					try {
						parsedState = JSON.parse(state)
					} catch (e) {
						// state is not a JSON string
						parsedState = null
					}

					const triggerEventHandler = (handler: any, ...args: any) => {
						if (handler[CompEventSymbol]) {
							handler({
								args,
								compId: _compId,
							})
						} else {
							handler(...args)
						}
					}

					const triggerOnItemClick = (itemIndex: number) => {
						const onItemClicked = propsStore.get(_compId).onItemClicked
						onItemClicked &&
							triggerEventHandler(onItemClicked, {
								type: 'itemClicked',
								itemIndex,
								item: propsStore.get(_compId).images[itemIndex],
							})
					}

					// state is a stringified cmd/args JSON
					if (parsedState) {
						const tpaGalleryStateCommandToAction: Record<string, () => void> = {
							zoom: () => {
								const [itemIndex] = parsedState!.args!
								const { id } = propsStore.get(_compId).images[itemIndex]
								zoomAPI.openImageZoom(_compId, id)
								triggerOnItemClick(itemIndex)
							},
							itemClicked: () => {
								const [itemIndex] = parsedState!.args!
								triggerOnItemClick(itemIndex)
							},
							itemChanged: () => {
								const [itemIndex] = parsedState!.args!
								const onCurrentItemChanged = propsStore.get(_compId).onCurrentItemChanged
								onCurrentItemChanged &&
									triggerEventHandler(onCurrentItemChanged, {
										type: 'imageChanged',
										itemIndex,
										item: propsStore.get(_compId).images[itemIndex],
									})
							},
							componentReady: () => {
								propsStore.update({
									[_compId]: {
										componentReady: true,
									},
								})
							},
							navigateToDynamicPage: () => {
								const [dynamicPageLinkData] = parsedState!.args!
								const linkUtils = getLinkUtils()
								const linkProps = isLinkProps(dynamicPageLinkData)
									? dynamicPageLinkData
									: linkUtils.getLinkProps(linkUtils.getLinkUrlFromDataItem(dynamicPageLinkData))
								navigation.navigateTo(linkProps)
							},
							navigateToAnchor: () => {
								const [pageId, anchorDataId] = parsedState!.args!
								const actualPageId =
									pageId === 'masterPage'
										? routingLinkUtilsAPI.getLinkUtilsRoutingInfo().pageId
										: pageId
								const linkData = {
									type: 'PageLink',
									pageId: actualPageId,
									target: '_self',
								} as PageLinkData
								const linkUtils = getLinkUtils()
								const pageUrl = linkUtils.getLinkUrlFromDataItem(linkData)
								const linkProps = linkUtils.getLinkProps(pageUrl)
								const anchorLinkProps = Object.assign(linkProps, anchorDataId)
								navigation.navigateTo(anchorLinkProps)
							},
						}

						const commandAction = tpaGalleryStateCommandToAction[parsedState.cmd]
						if (commandAction) {
							commandAction()
						}
						return
					}

					// state is a regular string, need to invoke same logic as replaceSectionState handler
					// but when changing the url we should add it to browser history
					return replaceState({ compId: _compId, skipHistory: false, state })
				},
			}
		},
	})
)
