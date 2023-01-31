import { WixCodeApiFactoryArgs } from '@wix/thunderbolt-symbols'
import { namespace, name } from '../symbols'
import { AuthenticationWixCodeSdkHandlers, AuthenticationWixCodeSdkWixCodeApi } from '../types'

export function AuthenticationSdkFactory({
	platformEnvData,
	handlers,
}: WixCodeApiFactoryArgs<never, never, AuthenticationWixCodeSdkHandlers>): {
	[namespace]: AuthenticationWixCodeSdkWixCodeApi
} {
	return {
		[namespace]: {
			openCaptchaChallenge: () => {
				if (platformEnvData.window.isSSR) {
					return Promise.resolve(null)
				}

				return handlers[name].openCaptchaDialog()
			},
			withCaptchaChallengeHandler: handlers[name].withCaptchaChallengeHandler,
		},
	}
}
