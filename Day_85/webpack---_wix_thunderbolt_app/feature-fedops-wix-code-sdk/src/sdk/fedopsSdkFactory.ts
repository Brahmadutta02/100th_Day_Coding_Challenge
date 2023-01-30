import type { ICreateOptions } from '@wix/fe-essentials-viewer-platform/fedops'
import type { Factory } from '@wix/fe-essentials-viewer-platform/bi'
import { WixCodeApiFactoryArgs } from '@wix/thunderbolt-symbols'
import { FedopsWixCodeSdkSiteConfig, FedopsWixCodeSdkWixCodeApi, namespace } from '..'

export const FedopsSdkFactory = ({
	featureConfig,
	platformUtils,
}: WixCodeApiFactoryArgs<FedopsWixCodeSdkSiteConfig>): { [namespace]: FedopsWixCodeSdkWixCodeApi } => {
	const { biUtils, essentials } = platformUtils

	return {
		[namespace]: {
			create(appName, params) {
				if (featureConfig.isWixSite) {
					const biLoggerFactory: Factory = biUtils.createBiLoggerFactoryForFedops()
					const paramsWithLoggerFactory: Partial<ICreateOptions> = {
						...params,
						biLoggerFactory,
					}
					return essentials.createFedopsLogger(appName, paramsWithLoggerFactory)
				}
				throw new Error('Fedops is only usable in a site that is marked as a WixSite')
			},
		},
	}
}
