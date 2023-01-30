import type { BootstrapData } from '../../types'
import type { SessionServiceAPI } from '@wix/thunderbolt-symbols'
import { ViewerPlatformEssentials } from '@wix/fe-essentials-viewer-platform'
import { BOOTSTRAP_DATA, SESSION_SERVICE, PLATFORM_ESSENTIALS } from './moduleNames'

function PlatformEssentials(bootstrapData: BootstrapData, sessionService: SessionServiceAPI) {
	const {
		platformEnvData: {
			site: { experiments },
			location: { externalBaseUrl },
			window: { isSSR },
		},
	} = bootstrapData

	const setBaseUrlToExternalBaseUrl = experiments['specs.thunderbolt.essentials_base_url_external_base_url']
	const baseUrl = setBaseUrlToExternalBaseUrl ? externalBaseUrl : isSSR ? new URL(externalBaseUrl).origin : ''

	return new ViewerPlatformEssentials({
		conductedExperiments: experiments,
		isSSR,
		baseUrl,
		metaSiteId: bootstrapData.platformEnvData.location.metaSiteId,
		appsConductedExperiments: bootstrapData.essentials.appsConductedExperiments,
		getAppToken(appDefId) {
			return sessionService.getInstance(appDefId)
		},
	})
}

export default {
	factory: PlatformEssentials,
	deps: [BOOTSTRAP_DATA, SESSION_SERVICE],
	name: PLATFORM_ESSENTIALS,
}
