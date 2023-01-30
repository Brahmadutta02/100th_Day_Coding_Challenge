import { TpaEventsListenerManagerSymbol } from '../symbols'
import { withDependencies } from '@wix/thunderbolt-ioc'
import { TpaHandlerProvider } from '@wix/thunderbolt-symbols'
import { ITPAEventsListenerManager } from '../types'
import { SessionManagerSymbol, ISessionManager } from 'feature-session-manager'

export type HandlerResponse = {
	instance: string
}

export const RevalidateSessionHandler = withDependencies(
	[SessionManagerSymbol, TpaEventsListenerManagerSymbol],
	(sessionManager: ISessionManager, tpaEventsListenerManager: ITPAEventsListenerManager): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				async revalidateSession(compId, msgData, { appDefinitionId }): Promise<HandlerResponse> {
					await sessionManager.loadNewSession()
					const payload = {
						instance: sessionManager.getAppInstanceByAppDefId(appDefinitionId)!,
					}
					tpaEventsListenerManager.dispatch('INSTANCE_CHANGED', () => payload, { appDefinitionId })
					return payload
				},
			}
		},
	})
)
