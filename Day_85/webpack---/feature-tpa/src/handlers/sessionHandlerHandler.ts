import { withDependencies } from '@wix/thunderbolt-ioc'
import { TpaHandlerProvider } from '@wix/thunderbolt-symbols'
import { ISessionManager, SessionManagerSymbol } from 'feature-session-manager'

export const SessionHandlerHandler = withDependencies(
	[SessionManagerSymbol],
	(sessionManager: ISessionManager): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				getCtToken() {
					return sessionManager.getCtToken()
				},
				getUserSession() {
					return sessionManager.getUserSession()
				},
			}
		},
	})
)
