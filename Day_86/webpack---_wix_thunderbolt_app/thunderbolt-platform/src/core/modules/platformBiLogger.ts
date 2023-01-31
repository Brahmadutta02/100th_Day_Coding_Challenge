import type { BiUtils, SessionServiceAPI } from '@wix/thunderbolt-symbols'
import { ViewerPlatformEssentials } from '@wix/fe-essentials-viewer-platform'
import type { BootstrapData } from '../../types'
import { platformBiLoggerFactory } from '../bi/biLoggerFactory'
import { BOOTSTRAP_DATA, SESSION_SERVICE, PLATFORM_ESSENTIALS, PLATFORM_BI_LOGGER } from './moduleNames'

const PlatformBiLogger = (boostrapData: BootstrapData, sessionService: SessionServiceAPI, essentials: ViewerPlatformEssentials): BiUtils => {
	const { bi: biData, site, location } = boostrapData.platformEnvData

	return platformBiLoggerFactory({
		site,
		biData,
		location,
		sessionService,
		factory: essentials.biLoggerFactory,
	})
}
export default {
	factory: PlatformBiLogger,
	deps: [BOOTSTRAP_DATA, SESSION_SERVICE, PLATFORM_ESSENTIALS],
	name: PLATFORM_BI_LOGGER,
}
