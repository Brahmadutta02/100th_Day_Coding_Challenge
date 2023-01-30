import { withDependencies } from '@wix/thunderbolt-ioc'
import { TpaHandlerProvider } from '@wix/thunderbolt-symbols'
import { ISessionManager, SessionManagerSymbol } from 'feature-session-manager'

export type MessageData = { appDefinitionId: string }
export type HandlerResponse = string | null

export const GetAppVendorProductIdHandler = withDependencies(
	[SessionManagerSymbol],
	(sessionManager: ISessionManager): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				getAppVendorProductId(_compId, { appDefinitionId }: MessageData): HandlerResponse {
					const encodedInstance = sessionManager
						.getAppInstanceByAppDefId(appDefinitionId)
						?.replace(/^[^.]+./, '')

					if (!encodedInstance) {
						return null
					}

					const vendorProductId = JSON.parse(atob(encodedInstance))?.vendorProductId
					return vendorProductId || null
				},
			}
		},
	})
)
