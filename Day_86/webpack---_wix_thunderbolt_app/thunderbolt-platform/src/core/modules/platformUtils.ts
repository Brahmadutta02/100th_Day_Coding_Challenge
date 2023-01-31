import type { ViewerPlatformEssentials } from '@wix/fe-essentials-viewer-platform'
import type { BiUtils, IConsentPolicyManager, LinkUtils, ILocationManager, IPlatformUtils, SessionServiceAPI, IWarmupData, ClientSpecMapAPI, ICommonConfigModule } from '@wix/thunderbolt-symbols'
import {
	LINK_UTILS,
	WARMUP_DATA,
	PLATFORM_UTILS,
	APPS_PUBLIC_API,
	SESSION_SERVICE,
	LOCATION_MANAGER,
	PLATFORM_BI_LOGGER,
	CLIENT_SPEC_MAP_API,
	PLATFORM_ESSENTIALS,
	CONSENT_POLICY_MANAGER,
	COMMON_CONFIG,
} from './moduleNames'
import type { IAppsPublicApi } from './appsPublicApi'

const PlatformUtils = (
	linkUtils: LinkUtils,
	sessionService: SessionServiceAPI,
	appsPublicApi: IAppsPublicApi,
	biUtils: BiUtils,
	locationManager: ILocationManager,
	essentials: ViewerPlatformEssentials,
	warmupData: IWarmupData,
	consentPolicyManager: IConsentPolicyManager,
	clientSpecMapApi: ClientSpecMapAPI,
	commonConfig: ICommonConfigModule
): IPlatformUtils => ({
	linkUtils,
	sessionService,
	appsPublicApisUtils: {
		getPublicAPI: appsPublicApi.getPublicApi,
	},
	biUtils,
	locationManager,
	essentials,
	warmupData,
	consentPolicyManager,
	clientSpecMapApi,
	commonConfig,
})

export default {
	factory: PlatformUtils,
	deps: [LINK_UTILS, SESSION_SERVICE, APPS_PUBLIC_API, PLATFORM_BI_LOGGER, LOCATION_MANAGER, PLATFORM_ESSENTIALS, WARMUP_DATA, CONSENT_POLICY_MANAGER, CLIENT_SPEC_MAP_API, COMMON_CONFIG],
	name: PLATFORM_UTILS,
}
