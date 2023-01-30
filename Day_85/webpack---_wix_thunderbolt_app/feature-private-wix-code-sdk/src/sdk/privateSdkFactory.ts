import { WixCodeApiFactoryArgs } from '@wix/thunderbolt-symbols'
import { namespace, PrivateWixCodeSdkWixCodeApi } from '..'

export function PrivateSdkFactory({
	platformUtils,
}: WixCodeApiFactoryArgs): { [namespace]: PrivateWixCodeSdkWixCodeApi } {
	const { biUtils } = platformUtils

	return {
		[namespace]: {
			biLoggerFactory: (endpoint: string, src: number, defaults: Record<string, any>) => {
				if (!endpoint) {
					throw new Error('First argument "endpoint" is required')
				}

				if (!src) {
					throw new Error('Second argument "src" is required')
				}

				const logger = biUtils
					.createBaseBiLoggerFactory()
					.updateDefaults({ ...defaults, src })
					.logger({ endpoint })

				const log = logger.log.bind(logger)
				// @ts-ignore
				logger.log = (...args) => {
					// apparently logger.log() returns a promise. apparently we have user code that awaits this promise.
					// we don't want to allow this since under the hood the logger does setTimeout() which is noopified in ssr
					// so this promise never resolves.
					// @ts-ignore
					log(...args)
				}
				return logger
			},
		},
	}
}
