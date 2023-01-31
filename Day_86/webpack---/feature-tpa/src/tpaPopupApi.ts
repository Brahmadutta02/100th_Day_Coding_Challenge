import _ from 'lodash'
import { withDependencies, named } from '@wix/thunderbolt-ioc'
import type { TpaFeatureState, TpaMasterPageConfig, TpaPageConfig, TpaPopupProps } from './types'
import {
	BrowserWindowSymbol,
	contextIdSymbol,
	FeatureStateSymbol,
	IPropsStore,
	IStructureAPI,
	MasterPageFeatureConfigSymbol,
	PageFeatureConfigSymbol,
	Props,
	SiteFeatureConfigSymbol,
	StructureAPI,
	ITpaPopup,
	TpaPopupRegistry,
} from '@wix/thunderbolt-symbols'
import { ISessionManager, SessionManagerSymbol } from 'feature-session-manager'
import { name } from './symbols'
import { computeTpaPopupStyleOverrides, isFullScreen } from './utils/tpaStyleOverridesBuilder'
import { runtimeTpaCompIdBuilder } from '@wix/thunderbolt-commons'
import { IFeatureState } from 'thunderbolt-feature-state'
import { ISiteScrollBlocker, SiteScrollBlockerSymbol } from 'feature-site-scroll-blocker'
import {
	name as tpaCommonsName,
	TpaCommonsSiteConfig,
	ITpaSrcBuilder,
	TpaSrcBuilderSymbol,
	ITpaContextMapping,
	TpaContextMappingSymbol,
} from 'feature-tpa-commons'
import { PlatformPubsubSymbol, IPubsub } from 'feature-platform-pubsub'

export const TPA_POPUP_COMP_ID_PREFIX = 'tpapopup'

export const TpaPopupApiFactory = withDependencies(
	[
		Props,
		StructureAPI,
		named(FeatureStateSymbol, name),
		named(SiteFeatureConfigSymbol, tpaCommonsName),
		named(MasterPageFeatureConfigSymbol, name),
		named(PageFeatureConfigSymbol, name),
		SessionManagerSymbol,
		BrowserWindowSymbol,
		SiteScrollBlockerSymbol,
		contextIdSymbol,
		TpaSrcBuilderSymbol,
		TpaContextMappingSymbol,
		PlatformPubsubSymbol,
	],
	(
		props: IPropsStore,
		structureAPI: IStructureAPI,
		featureState: IFeatureState<TpaFeatureState>,
		tpaCommonsSiteConfig: TpaCommonsSiteConfig,
		tpaMasterPageConfig: TpaMasterPageConfig,
		pageConfig: TpaPageConfig,
		sessionManager: ISessionManager,
		window: Window,
		siteScrollBlocker: ISiteScrollBlocker,
		contextId: string,
		tpaSrcBuilder: ITpaSrcBuilder,
		tpaContextMapping: ITpaContextMapping,
		pubsubFeature: IPubsub
	): ITpaPopup => {
		const openedPopups: TpaPopupRegistry = {}

		const updatePersistentPopups = (persistentPopups: TpaPopupRegistry) => {
			featureState.update((currentState) => ({
				...currentState,
				tpaPopup: { persistentPopups, popups: currentState?.tpaPopup?.popups || {} },
			}))
		}

		const updateNonPersistentPopups = (popups: TpaPopupRegistry) => {
			featureState.update((currentState) => ({
				...currentState,
				tpaPopup: { popups, persistentPopups: currentState?.tpaPopup?.persistentPopups || {} },
			}))
		}

		const getNonPersistentPopups = (): TpaPopupRegistry => _.get(featureState.get(), ['tpaPopup', 'popups'], {})

		const getPersistentPopups = (): TpaPopupRegistry =>
			_.get(featureState.get(), ['tpaPopup', 'persistentPopups'], {})

		const popupCompIdRegex = new RegExp(
			runtimeTpaCompIdBuilder.buildRuntimeCompId(`${TPA_POPUP_COMP_ID_PREFIX}-[0-9]+`, '.+')
		)

		const refreshAllPopups = () => {
			Object.values(getPersistentPopups()).forEach(({ refreshPopUp }) => refreshPopUp())
			Object.values(openedPopups).forEach(({ refreshPopUp }) => refreshPopUp())
		}

		const closeNonPersistentPopups = () =>
			Object.values(openedPopups).forEach(({ closePopup }) => {
				closePopup()
			})

		return {
			isPopup(compId) {
				return popupCompIdRegex.test(compId)
			},
			refreshAllPopups,
			closeNonPersistentPopups,
			openPopup(url, options, compId) {
				const { isMobileView, isMobileDevice, previewMode: isPreviewMode, viewMode } = tpaCommonsSiteConfig
				const { masterPageTpaComps } = tpaMasterPageConfig
				const { widgets, pageId } = pageConfig
				return new Promise(async (resolve) => {
					const popupCompId = runtimeTpaCompIdBuilder.buildRuntimeCompId(
						`${TPA_POPUP_COMP_ID_PREFIX}-${Date.now()}`,
						runtimeTpaCompIdBuilder.getOriginCompId(compId)
					)
					// in cases where openPopup is triggered with compId belonging to another container, use the container of the compId instead of the current
					const originContextId = compId ? structureAPI.getContextIdOfCompId(compId) || contextId : contextId
					tpaContextMapping.registerTpasForContext({ contextId: originContextId, pageId }, [popupCompId])
					const closePopup = (data: any) => {
						if (options.persistent) {
							const persistentPopups = getPersistentPopups()
							delete persistentPopups[popupCompId]
							updatePersistentPopups(persistentPopups)
						} else {
							delete openedPopups[popupCompId]
							updateNonPersistentPopups(_.omit(getNonPersistentPopups(), popupCompId))
						}
						structureAPI.removeComponentFromDynamicStructure(popupCompId)
						siteScrollBlocker.setSiteScrollingBlocked(false, popupCompId)
						if (!options.persistent) {
							pubsubFeature.clearListenersByCompId(popupCompId)
						}
						resolve(data)
					}

					const isZero = (val: number | string) => /^0(?:px|%)?$/.test(`${val}`)

					const editorMobileOverrides =
						isMobileDevice && isPreviewMode && !isZero(options.width) && !isZero(options.height)
							? {
									position: 'fixed',
									width: '319px',
									height: '512px',
									marginLeft: 0,
									marginTop: 0,
									boxShadow: 'none',
									left: '50%',
									transform: 'translateX(-50%)',
									top: 0,
							  }
							: {}

					const styleOverrides = {
						...computeTpaPopupStyleOverrides(options, window, compId),
						...editorMobileOverrides,
					}

					const buildSrc = () => {
						const originTpaCompData = widgets[compId] || masterPageTpaComps[compId]
						return tpaSrcBuilder.buildSrc(popupCompId, pageId, originTpaCompData, url, {
							extraQueryParams: { isInPopup: 'true', origCompId: compId, viewMode },
						})
					}

					const refreshPopUp = () => {
						if (widgets[compId] || masterPageTpaComps[compId]) {
							props.update({
								[popupCompId]: { src: buildSrc() },
							})
						}
					}

					const tpaProps: TpaPopupProps = {
						// put the original options and compId if we ever need to recalculate style later
						options,
						originCompId: compId,
						src: buildSrc(),
						styleOverrides,
						isBareTheme: options.theme === 'BARE',
						closePopup,
					}

					props.update({
						[popupCompId]: tpaProps,
					})

					siteScrollBlocker.setSiteScrollingBlocked(
						isMobileView && isFullScreen(styleOverrides, window),
						popupCompId
					)

					await structureAPI.addComponentToDynamicStructure(popupCompId, {
						components: [],
						componentType: 'TPAPopup',
					})

					const popupRegistryData: TpaPopupRegistry['string'] = {
						isPersistent: options.persistent,
						closePopup,
						refreshPopUp,
					}
					if (popupRegistryData.isPersistent) {
						updatePersistentPopups({
							...getPersistentPopups(),
							[popupCompId]: popupRegistryData,
						})
					} else {
						openedPopups[popupCompId] = popupRegistryData
						updateNonPersistentPopups({
							...getNonPersistentPopups(),
							[popupCompId]: popupRegistryData,
						})
					}
				})
			},
			closePopup(compId, onCloseMessage) {
				const popup = getPersistentPopups()[compId] || getNonPersistentPopups()[compId]
				if (popup) {
					popup.closePopup(onCloseMessage)
				}
			},
			getOpenedPopups() {
				return { ...getPersistentPopups(), ...openedPopups }
			},
		}
	}
)
