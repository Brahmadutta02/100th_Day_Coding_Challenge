import { named, withDependencies } from '@wix/thunderbolt-ioc'
import type { ITpaSrcQueryParamProvider, TpaCommonsSiteConfig } from './types'
import { ISessionManager, SessionManagerSymbol } from 'feature-session-manager'
import {
	BrowserWindow,
	BrowserWindowSymbol,
	CurrentRouteInfoSymbol,
	IStructureAPI,
	SiteFeatureConfigSymbol,
	StructureAPI,
	WixBiSession,
	WixBiSessionSymbol,
} from '@wix/thunderbolt-symbols'
import { name } from './symbols'
import _ from 'lodash'
import { ConsentPolicySymbol, IConsentPolicy } from 'feature-consent-policy'
import { PolicyDetails } from '@wix/cookie-consent-policy-client'
import { CommonConfigSymbol, ICommonConfig } from 'feature-common-config'
import { ICurrentRouteInfo } from 'feature-router'

export const BaseTpaSrcQueryParamProvider = withDependencies(
	[named(SiteFeatureConfigSymbol, name)],
	(conf: TpaCommonsSiteConfig): ITpaSrcQueryParamProvider => ({
		getQueryParams({ compId, pageId, tpaCompData, options: { extraQueryParams } }) {
			const { siteRevision, editorOrSite, deviceType, locale, tpaDebugParams, timeZone, regionalLanguage } = conf
			const { templateId, width, height, isResponsive } = tpaCompData
			return {
				pageId,
				// when templateCompId exists, it should be the compId passed to the tpa e.g in case the controller lives within a shared block
				// compId is still needed for js-sdk
				compId: templateId || compId,
				viewerCompId: compId,
				siteRevision: `${siteRevision}`,
				viewMode: editorOrSite,
				deviceType,
				locale,
				tz: timeZone,
				regionalLanguage,
				width: !isResponsive && _.isNumber(width) ? `${width}` : null,
				height: !isResponsive && _.isNumber(height) ? `${height}` : null,
				...tpaDebugParams,
				...extraQueryParams,
			}
		},
	})
)

export const ExternalIdTpaSrcQueryParamProvider = withDependencies(
	[],
	(): ITpaSrcQueryParamProvider => ({
		getQueryParams({ tpaCompData }) {
			const { externalId } = tpaCompData
			return {
				externalId,
			}
		},
	})
)

export const InstanceTpaSrcQueryParamProvider = withDependencies(
	[named(SiteFeatureConfigSymbol, name), SessionManagerSymbol],
	(
		{ widgetsClientSpecMapData }: TpaCommonsSiteConfig,
		sessionManager: ISessionManager
	): ITpaSrcQueryParamProvider => ({
		getQueryParams({ tpaCompData, options }) {
			const widgetCSMData = widgetsClientSpecMapData[tpaCompData.widgetId!] || {}
			const appDefinitionId = widgetCSMData.appDefinitionId || options.appDefinitionId || ''
			const instance = sessionManager.getAppInstanceByAppDefId(appDefinitionId)
			return { instance }
		},
	})
)

export const CurrencyTpaSrcQueryParamProvider = withDependencies(
	[named(SiteFeatureConfigSymbol, name), BrowserWindowSymbol],
	(conf: TpaCommonsSiteConfig, browserWindow: BrowserWindow): ITpaSrcQueryParamProvider => ({
		getQueryParams() {
			const { requestUrl, extras } = conf
			const currentUrl = new URL(browserWindow?.location?.href || requestUrl)
			return {
				currency: extras.currency,
				currentCurrency: currentUrl.searchParams.get('currency') || extras.currency,
			}
		},
	})
)

export const BITpaSrcQueryParamProvider = withDependencies(
	[WixBiSessionSymbol],
	({ viewerSessionId }: WixBiSession): ITpaSrcQueryParamProvider => ({
		getQueryParams() {
			return { vsi: viewerSessionId }
		},
	})
)

export const ConsentPolicyTpaSrcQueryParamProvider = withDependencies(
	[ConsentPolicySymbol],
	(consentPolicyApi: IConsentPolicy): ITpaSrcQueryParamProvider => ({
		getQueryParams() {
			const consentPolicy = consentPolicyApi.getCurrentConsentPolicy()

			const isDefaultConsentPolicy = (policytoTest: PolicyDetails) =>
				policytoTest.defaultPolicy && _.every(policytoTest.policy)

			const policyValue =
				!isDefaultConsentPolicy(consentPolicy) && !!consentPolicyApi._getConsentPolicyHeader()['consent-policy']
					? decodeURIComponent(consentPolicyApi._getConsentPolicyHeader()['consent-policy']!)
					: undefined

			return {
				'consent-policy': policyValue,
			}
		},
	})
)

export const CommonConfigTpaSrcQueryParamProvider = withDependencies(
	[CommonConfigSymbol],
	(commonConfigAPI: ICommonConfig): ITpaSrcQueryParamProvider => ({
		getQueryParams() {
			return { commonConfig: JSON.stringify(commonConfigAPI.getCommonConfigForUrl()) }
		},
	})
)

export const RouteTpaSrcQueryParamProvider = withDependencies(
	[CurrentRouteInfoSymbol],
	(currentRouteInfo: ICurrentRouteInfo): ITpaSrcQueryParamProvider => ({
		getQueryParams() {
			const routerPublicData = currentRouteInfo.getCurrentRouteInfo()?.dynamicRouteData?.publicData
			if (routerPublicData) {
				const routerData = JSON.stringify(routerPublicData)
				return {
					routerData: routerData.length < 400 ? routerData : null,
				}
			}
			return {
				routerData: null,
			}
		},
	})
)

export const AppSectionTpaSrcQueryParamProvider = withDependencies(
	[named(SiteFeatureConfigSymbol, name), StructureAPI, BrowserWindowSymbol],
	(
		siteConfig: TpaCommonsSiteConfig,
		structureApi: IStructureAPI,
		browserWindow: BrowserWindow
	): ITpaSrcQueryParamProvider => ({
		getQueryParams({ compId, tpaCompData, options }) {
			const {
				widgetsClientSpecMapData,
				appSectionParams,
				isMobileView,
				requestUrl,
				viewMode,
				externalBaseUrl,
			} = siteConfig
			const resolveAppSectionParams = () => {
				if (browserWindow) {
					const json = new URL(browserWindow?.location?.href || requestUrl).searchParams.get(
						'appSectionParams'
					)
					return JSON.parse(json || '{}') || {}
				}
				return appSectionParams
			}

			const optionalParams: Record<string, string | null> = {
				target: null,
				'section-url': null,
			}

			if (tpaCompData.widgetId) {
				const { widgetUrl, mobileUrl } = widgetsClientSpecMapData[tpaCompData.widgetId!]
				const baseUrl = isMobileView ? mobileUrl || widgetUrl : widgetUrl
				const compType = structureApi.get(compId)?.componentType || ''
				const isSectionCompType = compType.toLowerCase().endsWith('section')
				// tpaCompData might belong to the parent TPA in case of tpaPopup/model (runtime comps) so we shouldn't rely on it
				if (tpaCompData.isSection && isSectionCompType) {
					if (viewMode === 'site') {
						optionalParams['section-url'] = `${externalBaseUrl}/${options.tpaInnerRouteConfig!.tpaPageUri}/`
						optionalParams.target = '_top'
					} else {
						optionalParams['section-url'] = baseUrl
						optionalParams.target = '_self'
					}
				}
			}

			return {
				...resolveAppSectionParams(),
				...optionalParams,
			}
		},
	})
)
