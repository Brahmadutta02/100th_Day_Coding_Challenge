import type { Component, MasterPageDefinition, TPAWidgetDefinition } from '@wix/thunderbolt-becky-types'
import { createCssCompNode } from '../cssCompNode'
import type { FeatureRefs } from '../cssFeatures.types'
import { envRefs } from '@wix/thunderbolt-catharsis'
import type { OtherComponentsResult } from './landingPageCss.types'

const COMPONENTS_TO_DISPLAY_IN_LANDING_PAGE = new Set([
	'PageGroup',
	'PagesContainer',
	'QuickActionBar',
	'BackToTopButton',
	'SiteBackground',
])
const EMPTY_ARRAY: Array<string> = []
const CHAT_WIDGET_ID = '14517f3f-ffc5-eced-f592-980aaa0bbb5c'

type MasterPageDependecies = {
	data: MasterPageDefinition['data']
	isMobileView: boolean
	children: Array<OtherComponentsResult>
}

export const landingPagesCss = createCssCompNode('landingPages', 'landingPagesCss', {
	getDependencies: (component: Component, refs: FeatureRefs<'landingPages'>) => {
		if (component.type === 'Document') {
			return {
				data: refs.dataQuery<MasterPageDefinition['data']>(component.dataQuery!),
				isMobileView: envRefs.isMobileView,
				children: (component.components || EMPTY_ARRAY).map(refs.landingPagesCss),
			}
		}

		return component.componentType === 'TPAGluedWidget'
			? { data: refs.dataQuery<TPAWidgetDefinition['data']>(component.dataQuery!) }
			: null
	},
	toViewItem: (component, deps) => {
		if (!deps) {
			return COMPONENTS_TO_DISPLAY_IN_LANDING_PAGE.has(component.componentType) ? EMPTY_ARRAY : [component.id]
		}

		if (component.componentType === 'TPAGluedWidget') {
			return deps.data.type === 'TPAWidget' && deps.data.widgetId === CHAT_WIDGET_ID
				? EMPTY_ARRAY
				: [component.id]
		}

		const { data, isMobileView, children } = deps as MasterPageDependecies

		const marginTop = data.layoutSettings?.headerToPagesGap || '0'
		const marginBottom = data.layoutSettings?.pagesToFooterGap || '0'

		return {
			css: isMobileView
				? null
				: {
						'#masterPage:not(.landingPage) #PAGES_CONTAINER': {
							'margin-top': `${marginTop}px`,
							'margin-bottom': `${marginBottom}px`,
						},
				  },
			componentsToHide: children.flatMap((x) => x).concat(`SITE_HEADER-placeholder`, `SITE_FOOTER-placeholder`),
		}
	},
})
