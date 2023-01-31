import type { ClientSpecMapAPI, PlatformEnvData, IModelsAPI } from '@wix/thunderbolt-symbols'

import { EnvironmentSdkFactory } from 'feature-environment-wix-code-sdk/factory'
import { PricingPlansSdkFactory } from 'feature-pricing-plans-wix-code-sdk/factory'
import { AnimationsSdkFactory } from 'feature-animations-wix-code-sdk/factory'
import { AuthenticationSdkFactory } from 'feature-authentication-wix-code-sdk/factory'
import { BookingsSdkFactory } from 'feature-bookings-wix-code-sdk/factory'
import { CrmSdkFactory } from 'feature-crm-wix-code-sdk/factory'
import { FedopsSdkFactory } from 'feature-fedops-wix-code-sdk/factory'
import { LocationSdkFactory } from 'feature-location-wix-code-sdk/factory'
import { PaidPlansSdkFactory } from 'feature-paid-plans-wix-code-sdk/factory'
import { PaymentsSdkFactory } from 'feature-payments-wix-code-sdk/factory'
import { PrivateSdkFactory } from 'feature-private-wix-code-sdk/factory'
import { RealtimeSdkFactory } from 'feature-realtime-wix-code-sdk/factory'
import { SearchSdkFactory } from 'feature-search-wix-code-sdk/factory'
import { SeoSdkFactory } from 'feature-seo-wix-code-sdk/factory'
import { SiteMembersSdkFactory } from 'feature-site-members-wix-code-sdk/factory'
import { WixEventsSdkFactory } from 'feature-events-wix-code-sdk/factory'
import { WixStoresSdkFactory } from 'feature-stores-wix-code-sdk/factory'
import { SiteSdkFactory } from 'feature-site-wix-code-sdk/factory'
import { WindowSdkFactory } from 'feature-window-wix-code-sdk/factory'

import { isWixWidgetEditorRequired } from 'feature-widget-wix-code-sdk/predicate'
import { isWixEditorRequired } from 'feature-editor-wix-code-sdk/predicate'
import { isDashboardWixCodeSdkRequired } from 'feature-dashboard-wix-code-sdk/predicate'
import { isTelemetryWixCodeSdkRequired } from 'feature-telemetry-wix-code-sdk/predicate'
import { isWixDataRequired } from 'feature-data-wix-code-sdk/predicate'
import { isElementorySupportWixCodeSdkRequired } from 'feature-elementory-support-wix-code-sdk/predicate'

import { importWidgetSdkFactory } from './loadWidgetFactory'
import { importEditorSdkFactory } from './loadEditorFactory'
import { importDashboardSdkFactory } from './loadDashboardFactory'
import { importTelemetrySdkFactory } from './loadTelemetryFactory'
import { importDataSdkFactory } from './loadDataFactory'
import { importElementorySupportSdkFactory } from './loadElementorySupportFactory'

export interface SdkLoaderUtils {
	modelsApi: IModelsAPI
	clientSpecMapApi: ClientSpecMapAPI
	platformEnvData: PlatformEnvData
}

export type WixCodeSdkLoader = (utils: SdkLoaderUtils) => Promise<Function>
type Predicate = (utils: SdkLoaderUtils) => Boolean
type ImportFactory = () => Promise<Function>

type CreateLoader = (predicate: Predicate, importFactory: ImportFactory) => WixCodeSdkLoader

const createLoader: CreateLoader = (predicate, importFactory) => async (utils) => (predicate(utils) ? importFactory() : () => {})

export const wixCodeSdkLoadersNames: Record<string, string> = {
	window: 'windowWixCodeSdk',
}
export const wixCodeSdkLoaders: { [wixCodeSdkName: string]: WixCodeSdkLoader } = {
	windowWixCodeSdk: () => import('feature-window-wix-code-sdk/factory').then((m) => m.WindowSdkFactory),
}
export const wixCodeSdkFactories: { [wixCodeSdkName: string]: WixCodeSdkLoader } = {
	windowWixCodeSdk: () => Promise.resolve(WindowSdkFactory),
	siteWixCodeSdk: () => Promise.resolve(SiteSdkFactory),
	siteMembersWixCodeSdk: () => Promise.resolve(SiteMembersSdkFactory),
	locationWixCodeSdk: () => Promise.resolve(LocationSdkFactory),
	seoWixCodeSdk: () => Promise.resolve(SeoSdkFactory),
	paymentsWixCodeSdk: () => Promise.resolve(PaymentsSdkFactory),
	paidPlansWixCodeSdk: () => Promise.resolve(PaidPlansSdkFactory),
	wixEventsWixCodeSdk: () => Promise.resolve(WixEventsSdkFactory),
	searchWixCodeSdk: () => Promise.resolve(SearchSdkFactory),
	bookingsWixCodeSdk: () => Promise.resolve(BookingsSdkFactory),
	fedopsWixCodeSdk: () => Promise.resolve(FedopsSdkFactory),
	storesWixCodeSdk: () => Promise.resolve(WixStoresSdkFactory),
	realtimeWixCodeSdk: () => Promise.resolve(RealtimeSdkFactory),
	crmWixCodeSdk: () => Promise.resolve(CrmSdkFactory),
	authenticationSdkFactory: () => Promise.resolve(AuthenticationSdkFactory),
	animationsWixCodeSdk: () => Promise.resolve(AnimationsSdkFactory),
	privateWixCodeSdk: () => Promise.resolve(PrivateSdkFactory),
	pricingPlansWixCodeSdk: () => Promise.resolve(PricingPlansSdkFactory),
	environmentWixCodeSdk: () => Promise.resolve(EnvironmentSdkFactory),
	widgetWixCodeSdk: createLoader(isWixWidgetEditorRequired, importWidgetSdkFactory),
	editorWixCodeSdk: createLoader(isWixEditorRequired, importEditorSdkFactory),
	dashboardWixCodeSdk: createLoader(isDashboardWixCodeSdkRequired, importDashboardSdkFactory),
	telemetryWixCodeSdk: createLoader(isTelemetryWixCodeSdkRequired, importTelemetrySdkFactory),
	dataWixCodeSdk: createLoader(isWixDataRequired, importDataSdkFactory),
	elementorySupportWixCodeSdk: createLoader(isElementorySupportWixCodeSdkRequired, importElementorySupportSdkFactory),
}
