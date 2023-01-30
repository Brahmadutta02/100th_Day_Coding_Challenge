import { named, optional, withDependencies } from '@wix/thunderbolt-ioc'
import { CurrentRouteInfoSymbol, FeatureStateSymbol, IAppWillMountHandler } from '@wix/thunderbolt-symbols'
import { name } from './symbols'
import { IFeatureState } from 'thunderbolt-feature-state'
import { HandlePermissions, PermissionsHandlerState } from './types'
import { ICurrentRouteInfo, IRouter, Router } from 'feature-router'
import { AUTH_RESULT_REASON, ISiteMembersApi, SiteMembersApiSymbol } from 'feature-site-members'

export const PermissionsHandler = withDependencies(
	[named(FeatureStateSymbol, name), Router, CurrentRouteInfoSymbol, optional(SiteMembersApiSymbol)],
	(
		featureState: IFeatureState<PermissionsHandlerState>,
		router: IRouter,
		currentRouteInfo: ICurrentRouteInfo,
		siteMembersApi?: ISiteMembersApi
	): IAppWillMountHandler => {
		const doLogin = async (): Promise<{ success: boolean; reason: string }> => {
			try {
				await siteMembersApi!.promptLogin()
				return { success: true, reason: '' }
			} catch (error) {
				return { success: false, reason: error }
			}
		}

		const handlePermissions: HandlePermissions = async (routeInfoFromResponse, intentRouteInfo) => {
			const { success, reason } = await doLogin()
			if (reason === AUTH_RESULT_REASON.CANCELED && currentRouteInfo.isLandingOnProtectedPage()) {
				return router.navigate('./')
			}

			if (success) {
				return router.navigate(intentRouteInfo.parsedUrl!.href)
			}

			return false
		}

		featureState.update(() => ({
			handlePermissions,
			isMemberLoggedIn: async () => !!(await siteMembersApi?.getMemberDetails()),
			isSiteMembersInstalled: !!siteMembersApi,
		}))

		return {
			appWillMount: async () => {},
		}
	}
)
