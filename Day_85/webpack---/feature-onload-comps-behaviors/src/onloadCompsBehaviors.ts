import _ from 'lodash'
import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	PageFeatureConfigSymbol,
	SiteFeatureConfigSymbol,
	IPageWillMountHandler,
	ComponentsStylesOverridesSymbol,
	IComponentsStylesOverrides,
} from '@wix/thunderbolt-symbols'
import type { OnloadCompsBehaviorsPageConfig, OnloadCompsBehaviorsSiteConfig } from './types'
import { name } from './symbols'
import { createStyleUtils } from '@wix/thunderbolt-commons'

const onloadCompsBehaviorsFactory = (
	pageFeatureConfig: OnloadCompsBehaviorsPageConfig,
	siteFeatureConfig: OnloadCompsBehaviorsSiteConfig,
	componentsStylesOverrides: IComponentsStylesOverrides
): IPageWillMountHandler => {
	return {
		name: 'onloadCompsBehaviors',
		pageWillMount() {
			const { compsBehaviors } = pageFeatureConfig
			const { isResponsive } = siteFeatureConfig

			const styleUtils = createStyleUtils({ isResponsive })

			const styleOverrides = _.mapValues(compsBehaviors, ({ collapseOnLoad, hiddenOnLoad }) => {
				const styles = {}
				if (collapseOnLoad) {
					Object.assign(styles, styleUtils.getCollapsedStyles())
				}
				if (hiddenOnLoad) {
					Object.assign(styles, styleUtils.getHiddenStyles())
				}
				return styles
			})

			componentsStylesOverrides.update(styleOverrides)
		},
	}
}

export const OnloadCompsBehaviors = withDependencies(
	[named(PageFeatureConfigSymbol, name), named(SiteFeatureConfigSymbol, name), ComponentsStylesOverridesSymbol],
	onloadCompsBehaviorsFactory
)
