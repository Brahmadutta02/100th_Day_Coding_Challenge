import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { FeatureStateSymbol } from '@wix/thunderbolt-symbols'
import { ISiteMembersApi, SiteMembersApiSymbol } from 'feature-site-members'
import { IFeatureState } from 'thunderbolt-feature-state'
import { name } from './symbols'
import type { ProtectedPagesState } from './types'

const protectedPageTPAHandlers = (
	featureState: IFeatureState<ProtectedPagesState>,
	siteMembersApi: ISiteMembersApi
) => ({
	getTpaHandlers() {
		const authorizeMemberPages = async (): Promise<void> => {
			const memberPages = await siteMembersApi.authorizeMemberPagesByCookie()
			featureState.update((state) => ({
				...state,
				pagesMap: { ...state.pagesMap, ...memberPages },
			}))
		}

		return {
			authorizeMemberPages,
		}
	},
})

export const ProtectedPageTPAHandlers = withDependencies(
	[named(FeatureStateSymbol, name), SiteMembersApiSymbol],
	protectedPageTPAHandlers
)
