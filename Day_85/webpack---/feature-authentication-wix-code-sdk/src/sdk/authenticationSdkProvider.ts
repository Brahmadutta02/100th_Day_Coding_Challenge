import type { SdkHandlersProvider } from '@wix/thunderbolt-symbols'
import type { ICaptchaDialog } from '@wix/thunderbolt-commons'
import { withDependencies } from '@wix/thunderbolt-ioc'
import { AuthenticationWixCodeSdkHandlers } from '../types'
import { name, AuthenticationApiSymbol } from '../symbols'

export const authenticationCodeSdkHandlersProvider = withDependencies(
	[AuthenticationApiSymbol],
	({
		openCaptchaDialog,
		withCaptchaChallengeHandler,
	}: ICaptchaDialog): SdkHandlersProvider<AuthenticationWixCodeSdkHandlers> => ({
		getSdkHandlers: () => ({
			[name]: {
				openCaptchaDialog,
				withCaptchaChallengeHandler,
			},
		}),
	})
)
