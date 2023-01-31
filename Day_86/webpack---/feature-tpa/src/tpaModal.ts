import { named, optional, withDependencies } from '@wix/thunderbolt-ioc'
import {
	BrowserWindow,
	BrowserWindowSymbol,
	contextIdSymbol,
	CurrentRouteInfoSymbol,
	FeatureStateSymbol,
	IPageDidMountHandler,
	IPropsStore,
	IStructureAPI,
	MasterPageFeatureConfigSymbol,
	PageFeatureConfigSymbol,
	Props,
	SiteFeatureConfigSymbol,
	StructureAPI,
	IPageWillUnmountHandler,
} from '@wix/thunderbolt-symbols'
import type { ITpaModal, OpenModalOptions, TpaFeatureState, TpaMasterPageConfig, TpaPageConfig } from './types'
import {
	createPromise,
	disableCyclicTabbing,
	enableCyclicTabbing,
	isSSR,
	runtimeTpaCompIdBuilder,
} from '@wix/thunderbolt-commons'
import { ISiteScrollBlocker, SiteScrollBlockerSymbol } from 'feature-site-scroll-blocker'
import { name } from './symbols'
import { hideSiteRoot } from './utils/tpaFullScreenUtils'
import { ISessionManager, SessionManagerSymbol } from 'feature-session-manager'
import { IFeatureState } from 'thunderbolt-feature-state'
import _ from 'lodash'
import {
	ITpaContextMapping,
	ITpaSrcBuilder,
	name as tpaCommonsName,
	TpaCommonsSiteConfig,
	TpaContextMappingSymbol,
	TpaSrcBuilderSymbol,
} from 'feature-tpa-commons'
import type { ICurrentRouteInfo } from 'feature-router'
import { ILightboxesLinkUtilsAPI, LightboxesLinkUtilsAPISymbol } from 'feature-lightbox'

const MIN_MARGIN = 50
export const TPA_MODAL_COMP_ID_PREFIX = 'tpaModal'

export const TpaModal = withDependencies(
	[
		named(SiteFeatureConfigSymbol, tpaCommonsName),
		named(MasterPageFeatureConfigSymbol, name),
		named(PageFeatureConfigSymbol, name),
		named(FeatureStateSymbol, name),
		Props,
		BrowserWindowSymbol,
		SiteScrollBlockerSymbol,
		StructureAPI,
		SessionManagerSymbol,
		contextIdSymbol,
		TpaSrcBuilderSymbol,
		TpaContextMappingSymbol,
		CurrentRouteInfoSymbol,
		optional(LightboxesLinkUtilsAPISymbol),
	],
	(
		tpaModalSiteConfig: TpaCommonsSiteConfig,
		{ masterPageTpaComps }: TpaMasterPageConfig,
		tpaModalPageConfig: TpaPageConfig,
		featureState: IFeatureState<TpaFeatureState>,
		props: IPropsStore,
		window: BrowserWindow,
		siteScrollBlocker: ISiteScrollBlocker,
		structureAPI: IStructureAPI,
		sessionManager: ISessionManager,
		contextId: string,
		tpaSrcBuilder: ITpaSrcBuilder,
		tpaContextMapping: ITpaContextMapping,
		currentRouteInfo: ICurrentRouteInfo,
		popupsLinkUtilsAPI?: ILightboxesLinkUtilsAPI
	): ITpaModal & IPageDidMountHandler & IPageWillUnmountHandler => {
		let unregisterEscapePress = () => {}

		const setCloseModalImpl = (closeModalImpl: (msg: any) => void) => {
			featureState.update((currentState) => ({
				...currentState,
				tpaModal: {
					...(currentState?.tpaModal || {}),
					closeModalImpl,
				},
			}))
		}

		const setCurrentModalId = (currentModalId: string | null) => {
			featureState.update((currentState) => ({
				...currentState,
				tpaModal: {
					...(currentState?.tpaModal || {}),
					currentModalId,
				},
			}))
		}

		const getCloseModalImpl = (): ((msg?: any) => void) =>
			_.get(featureState.get(), ['tpaModal', 'closeModalImpl'], () => {})

		const getCurrentModalId = (): string | null => _.get(featureState.get(), ['tpaModal', 'currentModalId'], null)

		const calculateModalSize = (
			width: number,
			height: number,
			isAppWixTPA: boolean
		): { width: number; height: number } => {
			const windowSize = {
				width: window!.innerWidth,
				height: window!.innerHeight,
			}

			width = Math.min(width, windowSize.width)
			height = Math.min(height, windowSize.height)

			if (!isAppWixTPA) {
				const minWidth = windowSize.width - MIN_MARGIN
				const minHeight = windowSize.height - MIN_MARGIN

				if (width >= minWidth && height >= minHeight) {
					width = minWidth
					height = minHeight
				}
			}

			return { width, height }
		}

		const listenToEscapeKeyPress = (cb: () => void) => {
			if (isSSR(window)) {
				return () => {}
			}
			const onKeyDown = (e: Event) => {
				const keyboardEvent = e as KeyboardEvent
				if (keyboardEvent.key === 'Escape') {
					cb()
				}
			}

			window.addEventListener('keydown', onKeyDown)
			return () => window.removeEventListener('keydown', onKeyDown)
		}

		const { resolver: pageDidMountResolver, promise: pageDidMountPromise } = createPromise()
		if (process.env.PACKAGE_NAME === 'thunderbolt-ds') {
			pageDidMountResolver()
		}

		return {
			pageDidMount() {
				pageDidMountResolver()
			},
			pageWillUnmount() {
				getCloseModalImpl()()
			},
			isModal(compId) {
				return compId.startsWith(TPA_MODAL_COMP_ID_PREFIX)
			},
			openModal(url: string, { width, height, title, theme }: OpenModalOptions, compId?: string): Promise<void> {
				if (isSSR(window)) {
					// prevent opening tpaModal in SSR
					return new Promise(() => {})
				}

				let focusedElement: HTMLElement | null
				const { tpaModalConfig, isMobileDevice, previewMode: isPreviewMode, viewMode } = tpaModalSiteConfig
				const { pageId, widgets } = tpaModalPageConfig
				const { wixTPAs } = tpaModalConfig

				const modalCompId = runtimeTpaCompIdBuilder.buildRuntimeCompId(
					TPA_MODAL_COMP_ID_PREFIX,
					runtimeTpaCompIdBuilder.getOriginCompId(compId || pageId)
				)

				// in cases where openPopup is triggered with compId belonging to another container, use the container of the compId instead of the current
				const originContextId = compId ? structureAPI.getContextIdOfCompId(compId) || contextId : contextId
				tpaContextMapping.registerTpasForContext({ contextId: originContextId, pageId }, [modalCompId])

				// close any open modals before opening another tpaModal
				getCloseModalImpl()()
				enableCyclicTabbing()

				const callerCompProps = compId ? props.get(compId) : null
				const applicationId = callerCompProps ? callerCompProps.applicationId : null
				const isAppWixTPA = wixTPAs[applicationId]

				const onWindowResize = () => {
					const dialogSize = calculateModalSize(width, height, isAppWixTPA)

					props.update({
						[modalCompId]: {
							width: dialogSize.width,
							height: dialogSize.height,
						},
					})
				}

				window.addEventListener('resize', onWindowResize)

				if (isMobileDevice) {
					/*
					 TODO revisit this solution if scrolling is still an issue in 2020
					  https://jira.wixpress.com/browse/WEED-15023
					  https://github.com/wix-private/santa/blob/be35a223fd3107e8addd3692a0f8a991a761c2b2/packages/core/src/main/components/siteAspects/siteScrollingBlockerAspect.js#L73
					 */
					siteScrollBlocker.setSiteScrollingBlocked(true, modalCompId)
				}

				return new Promise(async (resolve) => {
					await pageDidMountPromise

					const currentLightboxId = popupsLinkUtilsAPI?.getCurrentOrPendingLightboxId()
					const currentContext = currentRouteInfo.getCurrentRouteInfo()?.contextId
					if (contextId !== currentContext && contextId !== 'masterPage' && contextId !== currentLightboxId) {
						if (tpaModalSiteConfig.debug) {
							console.warn(
								`Tried to open modal but the current context ID: ${currentContext} doesn't equal the modal context ID: ${contextId}`
							)
						}
						return
					}

					setCurrentModalId(modalCompId)
					setCloseModalImpl((msg) => {
						setCloseModalImpl(() => {})
						window.removeEventListener('resize', onWindowResize)
						disableCyclicTabbing()
						unregisterEscapePress()
						if (isMobileDevice) {
							siteScrollBlocker.setSiteScrollingBlocked(false, modalCompId)
							hideSiteRoot(window, false)
						}
						structureAPI.removeComponentFromDynamicStructure(modalCompId)
						props.update({
							[modalCompId]: {
								src: null,
								closeModal: () => {},
							},
						})
						focusedElement?.focus()
						focusedElement = null
						setCurrentModalId(null)
						resolve(msg)
					})

					unregisterEscapePress = listenToEscapeKeyPress(getCloseModalImpl())
					if (isMobileDevice && theme === 'LIGHT_BOX') {
						hideSiteRoot(window, true)
					}

					const modalSize = calculateModalSize(width, height, isAppWixTPA)

					const originTpaCompData: any = compId ? widgets[compId] || masterPageTpaComps[compId] || {} : {}
					const src = tpaSrcBuilder.buildSrc(modalCompId, pageId, originTpaCompData, url, {
						extraQueryParams: { isInModal: 'true', origCompId: compId, viewMode },
					})

					props.update({
						[modalCompId]: {
							src,
							width: modalSize.width,
							height: modalSize.height,
							closeModal: getCloseModalImpl(),
							isMobileDevice,
							isPreviewMode,
							title,
							theme,
						},
					})

					focusedElement = document.activeElement as HTMLElement

					await structureAPI.addComponentToDynamicStructure(modalCompId, {
						components: [],
						componentType: 'TPAModal',
					})
				})
			},
			closeModal(msg) {
				getCloseModalImpl()(msg)
			},
			getCurrentModalId,
		}
	}
)
