import { IWindowMessageRegistrar, WindowMessageRegistrarSymbol } from 'feature-window-message-registrar'
import { ISessionManager, SiteFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import { parseMessage } from '@wix/thunderbolt-commons'
import { isSiteContextOverrideMessage } from './dynamicModelUtils'
import { named, optional, withDependencies } from '@wix/thunderbolt-ioc'
import { name, SessionManagerSymbol } from './symbols'
import { SessionManagerSiteConfig } from './types'

export const SiteContextOtpRefresh = withDependencies(
	[SessionManagerSymbol, named(SiteFeatureConfigSymbol, name), optional(WindowMessageRegistrarSymbol)],
	(
		sessionManager: ISessionManager,
		{ isRunningInDifferentSiteContext }: SessionManagerSiteConfig,
		windowMessageRegistrar?: IWindowMessageRegistrar
	) => {
		if (!isRunningInDifferentSiteContext) {
			return
		}

		windowMessageRegistrar?.addWindowMessageHandler({
			canHandleEvent: (event: MessageEventInit) =>
				!!event.source && isSiteContextOverrideMessage(parseMessage(event)),
			handleEvent: (event: MessageEventInit) => {
				const originalMessage = parseMessage(event)
				const { siteContextOTP } = originalMessage

				sessionManager.loadNewSession({ reason: 'OTP expiry', otp: siteContextOTP })
			},
		})
	}
)
