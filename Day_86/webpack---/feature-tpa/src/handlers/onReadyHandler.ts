import { withDependencies } from '@wix/thunderbolt-ioc'
import { TpaHandlerProvider } from '@wix/thunderbolt-symbols'

export const OnReadyHandler = withDependencies(
	[],
	(): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				onReady() {
					return Promise.resolve()
				},
			}
		},
	})
)
