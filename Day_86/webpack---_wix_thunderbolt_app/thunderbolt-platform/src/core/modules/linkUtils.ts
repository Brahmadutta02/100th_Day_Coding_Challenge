import type { IModelsAPI } from '@wix/thunderbolt-symbols'
import { createLinkUtils } from '@wix/thunderbolt-commons'
import type { BootstrapData } from '../../types'
import { BOOTSTRAP_DATA, MODELS_API, LINK_UTILS } from './moduleNames'

const LinkUtils = (bootstrapData: BootstrapData, modelsApi: IModelsAPI) => {
	const {
		isMobileView,
		platformAPIData: { routersConfigMap },
		platformEnvData: {
			multilingual: multilingualInfo,
			site: { experiments },
			router: { routingInfo },
			location: { metaSiteId, userFileDomainUrl, isPremiumDomain },
		},
	} = bootstrapData

	return createLinkUtils({
		metaSiteId,
		experiments,
		routingInfo,
		isMobileView,
		isPremiumDomain,
		multilingualInfo,
		userFileDomainUrl,
		routersConfig: routersConfigMap,
		getRoleForCompId: modelsApi.getRoleForCompId,
		popupPages: bootstrapData.platformEnvData.popups?.popupPages,
		getCompIdByWixCodeNickname: modelsApi.getCompIdByWixCodeNickname,
	})
}

export default {
	factory: LinkUtils,
	deps: [BOOTSTRAP_DATA, MODELS_API],
	name: LINK_UTILS,
}
