import { IPageWillMountHandler, IPropsStore, PageFeatureConfigSymbol, Props } from '@wix/thunderbolt-symbols'
import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { name, SamePageAnchorPropsResolverSymbol } from './symbols'
import { ISamePageAnchorPropsResolver, ScrollToAnchorPageConfig } from './types'

export const SamePageAnchorHrefUpdater = withDependencies(
	[named(PageFeatureConfigSymbol, name), Props, SamePageAnchorPropsResolverSymbol],
	(
		{ compsToUpdate }: ScrollToAnchorPageConfig,
		propsStore: IPropsStore,
		{ getPropsOverrides }: ISamePageAnchorPropsResolver
	): IPageWillMountHandler => ({
		name: 'samePageAnchorHrefUpdater',
		pageWillMount: () => {
			if (compsToUpdate.length > 0) {
				const updatedProps = compsToUpdate.reduce((propsToUpdate, compToUpdateData) => {
					const propsOverrides = getPropsOverrides(compToUpdateData)

					return {
						...propsToUpdate,
						...propsOverrides,
					}
				}, {})

				propsStore.update(updatedProps)
			}
		},
	})
)
