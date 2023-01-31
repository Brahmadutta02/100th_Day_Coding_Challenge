import { AdditionalLayoutProperties } from '@wix/thunderbolt-becky-root'
import { layoutDataItemToCss } from '@wix/thunderbolt-becky-root/src/functionLibraryExtensions'
import { Component, ContainerLayouts, LayoutDataItems, Size } from '@wix/thunderbolt-becky-types'
import { envRefs } from '@wix/thunderbolt-catharsis'
import { mapValues, merge, set, get, isUndefined } from 'lodash'
import { createCssCompNode } from '../cssCompNode'
import { FeatureRefs } from '../cssFeatures.types'
import { BreakpointsVariantsToSelectorsMap, BreakpointsVariantsToLayoutsMap } from './responsiveLayout.types'

const CONTAINER_LAYOUTS_TYPES = new Set([
	'GridContainerLayout',
	'FlexContainerLayout',
	'OrganizerContainerLayout',
	'StackContainerLayout',
])
const COMPONENTS_WITH_WRAPPER_LAYERS = new Set(['Page', 'Repeater', 'ResponsivePopupPage', 'MenuContainer'])

const CONTAINER_SELECTORS = ['component-one-cell-grid', 'container']

const COMPONENT_DEFAULT_CSS_PATH = ['default', '', 'component']
const ITEM_DEFAULT_CSS_PATH = ['default', '', 'item']
const PATHS = {
	POSITION: [...COMPONENT_DEFAULT_CSS_PATH, 'position'],
	ASPECT_RATIO: [...COMPONENT_DEFAULT_CSS_PATH, 'aspect-ratio'],
	DISPLAY: [...COMPONENT_DEFAULT_CSS_PATH, 'display'],
	TOP: [...COMPONENT_DEFAULT_CSS_PATH, 'top'],
	TOP_VARIABLE: [...ITEM_DEFAULT_CSS_PATH, '--top'],
	STICKY_TOP_VARIABLE: [...ITEM_DEFAULT_CSS_PATH, '--sticky-top'],
}

const variablize = (variable: string, fallback?: string | number) =>
	typeof fallback !== 'undefined' ? `var(${variable},${fallback})` : `var(${variable})`

export const VARIABLES = {
	DISPLAY: '--display',
	CONTAINER_DISPLAY: '--container-display',
	LAYOUT_DISPLAY: '--l_display',
	ASPECT_RATIO: '--aspect-ratio',
	TOP: '--top',
	STICKY_TOP: '--sticky-top',
	IS_STICKY: '--is-sticky',
	WIX_ADS_TOP_HEIGHT: '--wix-ads-top-height',
} as const

const CONTAINER_DISPLAY = variablize(VARIABLES.LAYOUT_DISPLAY, variablize(VARIABLES.CONTAINER_DISPLAY))
const COMPONENT_DEFAULTS = {
	TOP: `calc(${variablize(VARIABLES.TOP)} + ${variablize(VARIABLES.STICKY_TOP)} + ${variablize(
		VARIABLES.WIX_ADS_TOP_HEIGHT
	)} * ${variablize(VARIABLES.IS_STICKY)})`,
	DISPLAY: variablize(VARIABLES.LAYOUT_DISPLAY, variablize(VARIABLES.DISPLAY)),
	ASPECT_RATIO: `1/${variablize(VARIABLES.ASPECT_RATIO)}`,
}
const WILL_CHANGE_OPACITY = { 'will-change': 'opacity' }
const COMPONENT_DEFAULT_BEFORE_CSS_PATH = ['default', '', '::before']
const BEFORE_PATHS = {
	CONTENT: [...COMPONENT_DEFAULT_BEFORE_CSS_PATH, 'content'],
	DISPLAY: [...COMPONENT_DEFAULT_BEFORE_CSS_PATH, 'display'],
	PADDING_TOP: [...COMPONENT_DEFAULT_BEFORE_CSS_PATH, 'padding-top'],
}
const ASPECT_RATIO_BEFORE_PATH = ['::before', VARIABLES.ASPECT_RATIO]

const applyAspectRatio = (css: BreakpointsVariantsToSelectorsMap) => {
	for (const breakpointId in css) {
		const breakpointCss = css[breakpointId]
		for (const variantsKey in breakpointCss) {
			const variantCss = breakpointCss[variantsKey]
			const aspectRatio = get(variantCss, ASPECT_RATIO_BEFORE_PATH)
			const componentHeight = get(variantCss, ['component', 'height'])
			// unset the aspect ratio if no aspect ratio is set or if the component height is set
			if (isUndefined(aspectRatio) && !isUndefined(componentHeight)) {
				set(variantCss, ASPECT_RATIO_BEFORE_PATH, 'unset')
			}
		}
	}

	// replace these three lines with the following one when aspect-ratio is mostly supported
	set(css, BEFORE_PATHS.CONTENT, 'attr(x)')
	set(css, BEFORE_PATHS.DISPLAY, 'block')
	set(css, BEFORE_PATHS.PADDING_TOP, 'calc(var(--aspect-ratio) * 100%)')
	// set(css, PATHS.ASPECT_RATIO, COMPONENT_DEFAULTS.ASPECT_RATIO)
}

const getContainerLayouts = (breakpointToLayouts: BreakpointsVariantsToLayoutsMap) =>
	Object.values(breakpointToLayouts)
		.flatMap((x) => Object.values(x).flatMap((y) => y))
		.filter((l) => CONTAINER_LAYOUTS_TYPES.has(l.type)) as Array<ContainerLayouts>

const hasNonVisibleOverflow = (item: ContainerLayouts) =>
	(item.overflowY && item.overflowY !== 'visible') || (item.overflowX && item.overflowX !== 'visible')
const isPercentage = (item: Size) => item.type === 'percentage'
const isRowInPercentage = (row: Size) =>
	row.type === 'MinMaxSize' ? isPercentage(row.min) || isPercentage(row.max) : isPercentage(row)

const shouldNotOmitWrapperLayers = (
	hasOverflow: boolean,
	component: Readonly<Component>,
	containerLayouts: Array<ContainerLayouts>
) =>
	hasOverflow ||
	COMPONENTS_WITH_WRAPPER_LAYERS.has(component.componentType) ||
	// Padding in % calculated related to parent's width, do not mess with hierarchy in this case
	containerLayouts.some((l) => l.padding && Object.values(l.padding).some(isPercentage)) ||
	// Firefox has a bug "percentage row tracks are not resolved when grid height is auto", so we need to distinguish this case
	containerLayouts.some((l) => l.type === 'GridContainerLayout' && l.rows.some(isRowInPercentage))

export const responsiveLayout = createCssCompNode('responsiveLayout', 'responsiveLayout', {
	getDependencies: (component: Component, refs: FeatureRefs<'responsiveLayout'>) =>
		component.layoutQuery
			? {
					breakpointsVariantsToLayouts: refs.compLayouts(component),
					renderScrollSnap: envRefs.renderScrollSnap,
					renderSticky: envRefs.renderSticky,
			  }
			: null,
	toViewItem: (component, deps) => {
		if (!deps) {
			return null
		}
		const { breakpointsVariantsToLayouts, renderScrollSnap, renderSticky } = deps

		if (!breakpointsVariantsToLayouts) {
			return { css: {}, shouldOmitWrapperLayers: false }
		}
		const containerLayouts = getContainerLayouts(breakpointsVariantsToLayouts)

		const hasOverflow = containerLayouts.some(hasNonVisibleOverflow)

		const shouldOmitWrapperLayers = !shouldNotOmitWrapperLayers(hasOverflow, component, containerLayouts)

		const options: AdditionalLayoutProperties = {
			hasOverflow,
			renderScrollSnap,
			renderSticky,
			shouldOmitWrapperLayers,
			newResponsiveLayout: true,
		}

		let hasAspectRatioSomewhere = false
		const layoutToCss = (layout: LayoutDataItems) => layoutDataItemToCss(layout, options)
		const css = mapValues(breakpointsVariantsToLayouts, (variantInSpecificBreakpoint, breakpointId) => {
			return mapValues(variantInSpecificBreakpoint, (layouts, variantId) => {
				const itemsCss = layouts.map(layoutToCss)
				const mergedCss = merge({}, ...itemsCss)

				for (const selector of CONTAINER_SELECTORS) {
					if (mergedCss?.[selector]?.display) {
						mergedCss[selector][VARIABLES.CONTAINER_DISPLAY] = mergedCss[selector].display
						mergedCss[selector].display = CONTAINER_DISPLAY
					}
				}

				// assert default position
				if (!mergedCss?.item?.position && breakpointId === 'default' && variantId === '') {
					set(mergedCss, ['item', 'position'], 'relative')
				}

				const position = mergedCss?.item?.position
				if (position === 'sticky') {
					mergedCss.item[VARIABLES.IS_STICKY] = 1
					mergedCss.item[VARIABLES.TOP] = '0px'

					// https://jira.wixpress.com/browse/LAYOUT-441
					mergedCss['next-siblings'] = WILL_CHANGE_OPACITY
				} else if (position) {
					mergedCss.item[VARIABLES.IS_STICKY] = 0
					mergedCss.item[VARIABLES.STICKY_TOP] = '0px'
				}

				const aspectRatio = mergedCss?.component?.[VARIABLES.ASPECT_RATIO]
				if (aspectRatio) {
					hasAspectRatioSomewhere = true
					set(mergedCss, ASPECT_RATIO_BEFORE_PATH, aspectRatio)
					delete mergedCss.component[VARIABLES.ASPECT_RATIO]
				}

				return mergedCss
			})
		})

		set(css, PATHS.TOP, COMPONENT_DEFAULTS.TOP)

		// set top variables to 0px if don't exist on default breakpoint so it won't cascade from parent
		if (isUndefined(get(css, PATHS.TOP_VARIABLE))) {
			set(css, PATHS.TOP_VARIABLE, '0px')
		}
		if (isUndefined(get(css, PATHS.STICKY_TOP_VARIABLE))) {
			set(css, PATHS.STICKY_TOP_VARIABLE, '0px')
		}

		if (hasAspectRatioSomewhere) {
			applyAspectRatio(css)
		}

		// allow leaf components to specify their own display via css variable
		if (!containerLayouts.length) {
			set(css, PATHS.DISPLAY, COMPONENT_DEFAULTS.DISPLAY)
		}

		return { css, shouldOmitWrapperLayers }
	},
})
