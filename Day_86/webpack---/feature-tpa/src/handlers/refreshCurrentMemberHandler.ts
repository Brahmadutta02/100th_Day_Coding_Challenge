import { withDependencies } from '@wix/thunderbolt-ioc'
import { TpaHandlerProvider } from '@wix/thunderbolt-symbols'
import { SiteMembersApiSymbol, ISiteMembersApi } from 'feature-site-members'
import { ITPAEventsListenerManager } from '../types'
import { TpaEventsListenerManagerSymbol } from '../symbols'

export type HandlerResponse = void

export const RefreshCurrentMemberHandler = withDependencies(
	[SiteMembersApiSymbol, TpaEventsListenerManagerSymbol],
	(siteMembersApi: ISiteMembersApi, tpaEventsListenerManager: ITPAEventsListenerManager): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				async refreshCurrentMember(): Promise<HandlerResponse> {
					const memberDetails = await siteMembersApi.getMemberDetails(true)

					// null means not logged in, in that case the event should not be fired
					if (memberDetails) {
						tpaEventsListenerManager.dispatch('MEMBER_DETAILS_UPDATED', () => memberDetails)
					}
				},
			}
		},
	})
)
