import { IPlatformUtils } from '@wix/thunderbolt-symbols'
import { createFedopsLogger as createCommonFedopsLogger } from '@wix/thunderbolt-commons'
import type { FedopsLogger } from '@wix/fe-essentials-viewer-platform/fedops'

export const createFedopsLogger = (
	essentials: IPlatformUtils['essentials'],
	biUtils: IPlatformUtils['biUtils']
): FedopsLogger => {
	return createCommonFedopsLogger({
		appName: 'crm-wix-code-sdk',
		biLoggerFactory: biUtils.createBiLoggerFactoryForFedops(),
		customParams: {
			viewerName: 'thunderbolt',
		},
		factory: essentials.createFedopsLogger,
	})
}
