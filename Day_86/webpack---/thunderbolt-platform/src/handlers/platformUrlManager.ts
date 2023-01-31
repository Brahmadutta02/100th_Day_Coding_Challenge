import { withDependencies } from '@wix/thunderbolt-ioc'
import { ISamePageUrlChangeListener, SdkHandlersProvider } from '@wix/thunderbolt-symbols'
import type { PlatformUrlManagerSdkHandlers } from '../types'

export const platformUrlManager = withDependencies([], (): SdkHandlersProvider<PlatformUrlManagerSdkHandlers> & ISamePageUrlChangeListener => {
	const onChangeHandlers: Set<Function> = new Set()

	return {
		getSdkHandlers: () => ({
			platformUrlManager: {
				registerLocationOnChangeHandler(handler: Function) {
					onChangeHandlers.add(handler)
					return () => onChangeHandlers.delete(handler)
				},
			},
		}),
		onUrlChange(url) {
			onChangeHandlers.forEach((handler) => handler(url.href))
		},
	}
})
