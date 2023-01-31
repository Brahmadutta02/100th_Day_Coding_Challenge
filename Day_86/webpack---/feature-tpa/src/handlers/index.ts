import type { FactoryWithDependencies } from '@wix/thunderbolt-ioc'
import { OnEscapeClickedHandler } from './onEscapeClickedHandler'
import { GetCustomizedUrlSegmentsHandler } from './getCustomizedUrlSegmentsHandler'
import { BuildCustomizedUrlHandler } from './buildCustomizedUrlHandler'
import { GetStateUrlHandler } from './getStateUrlHandler'
import { GetStyleParamsByStyleIdHandler } from './getStyleParamsByStyleIdHandler'
import { PostActivityHandler } from './postActivityHandler'
import { SessionHandlerHandler } from './sessionHandlerHandler'
import { GetCurrentPageNavigationInfoHandler } from './getCurrentPageNavigationInfoHandler'
import { GetAdsOnPageHandler } from './getAdsOnPageHandler'
import { ReplaceSectionStateHandler } from './replaceSectionStateHandler'
import { ApplicationLoadingStepHandler } from './applicationLoadingStepHandler'
import { ApplicationLoadedHandler } from './applicationLoadedHandler'
import { RefreshCurrentMemberHandler } from './refreshCurrentMemberHandler'
import { OpenPopupHandler } from './openPopupHandler'
import { GetAppVendorProductIdHandler } from './getAppVendorProductIdHandler'
import { ResizeWindowHandler } from './resizeWindowHandler'
import { OnReadyHandler } from './onReadyHandler'
import { NavigateToSectionHandler } from './navigateToSectionHandler'
import { BoundingRectAndOffsetsHandler } from './boundingRectAndOffsetsHandler'
import { SetPageMetadataHandler } from './setPageMetadataHandler'
import { OpenModalHandler } from './openModalHandler'
import { NavigateToHandler } from './navigateToHandler'
import { GetApplicationFieldsHandler } from './getApplicationFieldsHandler'
import { RemoveEventListenerHandler } from './removeEventListenerHandler'
import { PublishHandler } from './publishHandler'
import { RevalidateSessionHandler } from './revalidateSessionHandler'
import { AppIsAliveHandler } from './appIsAliveHandler'
import { RegisterEventListenerHandler } from './registerEventListenerHandler'
import { CloseWindowHandler } from './closeWindowHandler'
import { GetCurrentPageIdHandler } from './getCurrentPageIdHandler'
import { ScrollToHandler } from './scrollToHandler'
import { ScrollByHandler } from './scrollByHandler'
import { GetExternalIdHandler } from './getExternalId'
import { GetValueHandler } from './getValueHandler'
import { GetPublicDataHandler } from './getPublicDataHandler'
import { GetStyleIdHandler } from './getStyleId'
import { GetViewModeHandler } from './getViewMode'
import { GetComponentInfoHandler } from './getComponentInfo'
import { IsAppSectionInstalledHandler } from './isAppSectionInstalled'
import { GetSiteMapHandler } from './getSiteMap'
import { SiteInfoHandler } from './siteInfo'
import { GetSectionUrlHandler } from './getSectionUrl'
import { SetFullScreenMobileHandler } from './setFullScreenMobileHandler'
import { EmptyHandlers } from './emptyHandler'
import { ReportVisitorActivityHandler } from './reportVisitorActivity'
import { GetCurrentPageAnchorsHandler } from './getCurrentPageAnchorsHandler'
import { ApplePayHandlers } from './applePay'

export const handlers: Array<FactoryWithDependencies> = [
	EmptyHandlers,
	AppIsAliveHandler,
	RegisterEventListenerHandler,
	CloseWindowHandler,
	GetCurrentPageIdHandler,
	ScrollToHandler,
	ScrollByHandler,
	GetExternalIdHandler,
	GetValueHandler,
	GetPublicDataHandler,
	SetPageMetadataHandler,
	RevalidateSessionHandler,
	GetViewModeHandler,
	GetStyleIdHandler,
	GetComponentInfoHandler,
	IsAppSectionInstalledHandler,
	SiteInfoHandler,
	PublishHandler,
	RemoveEventListenerHandler,
	GetSiteMapHandler,
	GetApplicationFieldsHandler,
	OpenModalHandler,
	NavigateToHandler,
	RefreshCurrentMemberHandler,
	GetSectionUrlHandler,
	BoundingRectAndOffsetsHandler,
	GetAppVendorProductIdHandler,
	ResizeWindowHandler,
	OnReadyHandler,
	NavigateToSectionHandler,
	OpenPopupHandler,
	SetFullScreenMobileHandler,
	ReportVisitorActivityHandler,
	ReplaceSectionStateHandler,
	ApplicationLoadedHandler,
	ApplicationLoadingStepHandler,
	GetAdsOnPageHandler,
	SessionHandlerHandler,
	GetCurrentPageNavigationInfoHandler,
	GetStyleParamsByStyleIdHandler,
	PostActivityHandler,
	GetStateUrlHandler,
	GetCurrentPageAnchorsHandler,
	BuildCustomizedUrlHandler,
	GetCustomizedUrlSegmentsHandler,
	OnEscapeClickedHandler,
	ApplePayHandlers,
]
