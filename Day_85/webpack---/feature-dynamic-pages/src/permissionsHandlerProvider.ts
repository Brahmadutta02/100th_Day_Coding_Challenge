import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { FeatureStateSymbol } from '@wix/thunderbolt-symbols'
import { name } from './symbols'
import { IFeatureState } from 'thunderbolt-feature-state'
import { IPermissionsHandlerProvider, PermissionsHandlerState } from './types'
import { errorPagesIds } from './utils'

const permissionsHandlerProviderFactory = (
	featureState: IFeatureState<PermissionsHandlerState>
): IPermissionsHandlerProvider => {
	return {
		getHandler: () => {
			return {
				handle: async (routeInfoFromResponsePromise, routeInfo) => {
					const routeInfoFromResponse = await routeInfoFromResponsePromise
					const { handlePermissions, isMemberLoggedIn, isSiteMembersInstalled } = featureState.get()
					const isUserLoggedIn = await isMemberLoggedIn()
					if (
						isSiteMembersInstalled &&
						routeInfoFromResponse?.pageId === errorPagesIds.FORBIDDEN &&
						!isUserLoggedIn
					) {
						handlePermissions(routeInfoFromResponse, routeInfo)
						return null
					}

					return routeInfoFromResponse
				},
			}
		},
	}
}

export const PermissionsHandlerProvider = withDependencies(
	[named(FeatureStateSymbol, name)],
	permissionsHandlerProviderFactory
)
