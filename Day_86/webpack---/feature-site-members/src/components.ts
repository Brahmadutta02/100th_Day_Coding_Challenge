import { withDependencies, named } from '@wix/thunderbolt-ioc'
import { IPageWillMountHandler, IPropsStore, Props, PropsMap, PageFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import { SiteMembersApiSymbol, name } from './symbols'
import type { ISiteMembersApi, SiteMembersPageConfig, SocialAuthComponentProps } from './types'

const siteMembersComponents = (
	siteMembersApi: ISiteMembersApi,
	{ componentIds }: SiteMembersPageConfig,
	propsStore: IPropsStore
): IPageWillMountHandler => ({
	name: 'site-members-components',
	pageWillMount() {
		const updatePropsMap = componentIds.reduce<PropsMap>((result, compId) => {
			const props: SocialAuthComponentProps = siteMembersApi.getSocialAuthComponentProps()

			return {
				...result,
				[compId]: props,
			}
		}, {})

		propsStore.update(updatePropsMap)
	},
})

export const SiteMembersComponents = withDependencies(
	[SiteMembersApiSymbol, named(PageFeatureConfigSymbol, name), Props],
	siteMembersComponents
)
