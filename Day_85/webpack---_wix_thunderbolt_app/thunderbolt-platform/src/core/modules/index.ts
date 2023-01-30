import _ from 'lodash'

import AppsUrls from './appsUrls'
import LinkUtils from './linkUtils'
import BsiManager from './bsiManager'
import PlatformBi from './platformBi'
import WarmupData from './warmupData'
import PlatformApi from './platformApi'
import WixSelector from './wixSelector'
import Applications from './applications'
import CommonConfig from './commonConfig'
import AppsPublicApi from './appsPublicApi'
import InstanceCache from './instanceCache'
import PlatformUtils from './platformUtils'
import RegisterEvent from './registerEvent'
import SsrCacheHints from './ssrCacheHints'
import BlocksAppsUtils from './blocksAppsUtils'
import FedopsWebVitals from './fedopsWebVitals'
import LocationManager from './locationManager'
import SetPropsManager from './setPropsManager'
import ClientSpecMapApi from './clientSpecMapApi'
import ControllerEvents from './controllerEvents'
import PlatformBiLogger from './platformBiLogger'
import SdkFactoryParams from './sdkFactoryParams'
import ComponentSdkState from './componentSdkState'
import EffectsTriggerApi from './effectsTriggerApi'
import ModelPropsUpdater from './modelPropsUpdater'
import WixCodeApiFactory from './wixCodeApiFactory'
import ControllersExports from './controllersExports'
import PlatformAnimations from './platformAnimations'
import PlatformEssentials from './platformEssentials'
import StaticEventsManager from './staticEventsManager'
import ComponentSdksManager from './componentSdksManager'
import ConsentPolicyManager from './consentPolicyManager'
import WixCodeViewerAppUtils from './wixCodeViewerAppUtils'
import ModuleFederationManager from './moduleFederationManager'
import DataBindingViewerAppUtils from './dataBindingViewerAppUtils'
import WixCodeNamespacesRegistry from './wixCodeNamespacesRegistry'
import coreSdkLoaders from './coreSdkLoaders'
import PlatformApiProvider from './platformApiProvider'
import slotsManager from './slotsManager'

export default _.keyBy(
	[
		AppsUrls,
		LinkUtils,
		BsiManager,
		PlatformBi,
		WarmupData,
		WixSelector,
		PlatformApi,
		Applications,
		CommonConfig,
		AppsPublicApi,
		InstanceCache,
		PlatformUtils,
		RegisterEvent,
		SsrCacheHints,
		BlocksAppsUtils,
		FedopsWebVitals,
		LocationManager,
		SetPropsManager,
		ClientSpecMapApi,
		ControllerEvents,
		PlatformBiLogger,
		SdkFactoryParams,
		ComponentSdkState,
		EffectsTriggerApi,
		ModelPropsUpdater,
		WixCodeApiFactory,
		ControllersExports,
		PlatformAnimations,
		PlatformEssentials,
		StaticEventsManager,
		ComponentSdksManager,
		ConsentPolicyManager,
		WixCodeViewerAppUtils,
		ModuleFederationManager,
		DataBindingViewerAppUtils,
		WixCodeNamespacesRegistry,
		coreSdkLoaders,
		PlatformApiProvider,
		slotsManager,
	],
	'name'
)
