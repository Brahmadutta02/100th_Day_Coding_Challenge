import { withDependencies } from '@wix/thunderbolt-ioc'
import { PlatformEnvDataProvider } from '@wix/thunderbolt-symbols'
import type { ISessionManager } from './types'
import { SessionManagerSymbol } from './symbols'

export const sessionEnvDataProvider = withDependencies(
	[SessionManagerSymbol],
	(sessionManager: ISessionManager): PlatformEnvDataProvider => {
		return {
			get platformEnvData() {
				return {
					session: {
						applicationsInstances: sessionManager.getAllInstances(),
						siteMemberId: sessionManager.getSiteMemberId(),
						visitorId: sessionManager.getVisitorId(),
						svSession: sessionManager.getUserSession(),
						smToken: sessionManager.getSmToken(),
					},
				}
			},
		}
	}
)
