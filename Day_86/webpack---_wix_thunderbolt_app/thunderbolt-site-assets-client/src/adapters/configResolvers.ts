import { FleetConfig } from '@wix/thunderbolt-ssr-api'
import { Experiments } from '@wix/thunderbolt-symbols'
import { SiteAssetsClientConfig } from '@wix/site-assets-client'

export const shouldRouteStagingRequest = (fleetConfig: FleetConfig) => {
	return ['Stage', 'DeployPreview', 'Canary'].includes(fleetConfig.type)
}

export const updateConfig = (experiments: Experiments, config: SiteAssetsClientConfig): SiteAssetsClientConfig => {
	const { mediaRootUrl, staticMediaUrl } = config.moduleTopology.publicEnvironment

	const mediaRootUrlToUse = mediaRootUrl
	const staticMediaUrlToUse = staticMediaUrl
	const useSiteAssetsV2 = experiments['specs.thunderbolt.useSiteAssetsVarnishEnterprise'] === true
	const siteAssetsServerUrl = useSiteAssetsV2
		? config.moduleTopology.environment.siteAssetsV2ServerUrl
		: config.moduleTopology.environment.siteAssetsServerUrl

	return {
		...config,
		moduleTopology: {
			...config.moduleTopology,
			environment: {
				...config.moduleTopology.environment,
				siteAssetsServerUrl,
			},
			publicEnvironment: {
				...config.moduleTopology.publicEnvironment,
				mediaRootUrl: mediaRootUrlToUse,
				staticMediaUrl: staticMediaUrlToUse,
			},
		},
	}
}
