import _ from 'lodash'
import type { Component, Structure, BreakpointRange, BaseDataItem } from '@wix/thunderbolt-becky-types'
import type { CompVariantsViewItem, MegaStore } from '@wix/thunderbolt-catharsis'
import { Experiments } from '@wix/thunderbolt-symbols'
import { MediaQueryToSelectorObj, SelectorObj, CompIdTo } from '../shared.types'
import { getTemplateRepeaterIdSelector, getRegularIdSelector } from './selectorsUtils'
import { ComponentCss, CssContext } from '../features/componentCss.types'
import { viewerCssFeatures, editorCssFeatures } from '../features/cssFeatures'
import { SingleComponentCss } from '../features/cssFeatures.types'
import { accumulateCssContext } from './accumulateCssContextUtils'

const EMPTY_ARRAY = [] as const
const THE_DEFAULT_BREAKPOINT = { id: 'default', mediaQuery: 'default' } as const
const cssFeatures = { ...viewerCssFeatures, ...editorCssFeatures }

const isBreakpointRange = (item: BaseDataItem): item is BreakpointRange => item.type === 'BreakpointRange'
const toMediaQueryWithId = (item: BreakpointRange) => ({ id: item.id, mediaQuery: toMediaQuery(item) })

export const getChildrenAndSlots = (comp: Component): Array<string> => [
	...(comp.components || EMPTY_ARRAY),
	...(comp.slots ? Object.values(comp.slots) : EMPTY_ARRAY),
]

export const toMediaQuery = (item: BreakpointRange) => {
	const min = item.min ? ` and (min-width: ${item.min}px)` : ''
	const max = item.max ? ` and (max-width: ${item.max}px)` : ''
	return `@media screen${min}${max}`
}

const selectorObjToCss = (selectorObj: SelectorObj) =>
	Object.entries(selectorObj)
		.flatMap(
			([selector, css]) =>
				`${selector}{${Object.entries(css)
					.map(([key, value]) => `${key}:${value};`)
					.join('')}}`
		)
		.join('')

export const getComponentsCss = (
	megaStore: MegaStore,
	structure: Structure,
	pageCompId: string,
	experiments: Experiments
): CompIdTo<SingleComponentCss> => {
	const cssStore = megaStore.getChildStore('componentCss')

	const traverseComponents = (
		comp: Component,
		ancestorBreakpointsOrder: ComponentCss['breakpointsOrder'],
		acc: CompIdTo<SingleComponentCss>,
		cssContext: CssContext
	) => {
		const compId = comp.id
		const {
			breakpointsOrder = ancestorBreakpointsOrder,
			compSpecificData,
			...compCss
		} = cssStore.getById<ComponentCss>(compId)

		const accumulatedCssContext = accumulateCssContext(comp, cssContext, compSpecificData)

		acc[compId] = getSingleComponentCss(compId, breakpointsOrder, accumulatedCssContext, compCss, experiments)

		accumulatedCssContext.isInRepeater = accumulatedCssContext.isInRepeater || comp.type === 'RepeaterContainer'

		getChildrenAndSlots(comp).forEach((childId) =>
			traverseComponents(structure[childId], breakpointsOrder, acc, accumulatedCssContext)
		)
		return acc
	}

	return traverseComponents(structure[pageCompId], undefined, {}, {})
}

const getMediaQueriesFromVariants = (variants: CompVariantsViewItem | null | undefined) =>
	_.filter(variants, isBreakpointRange).map(toMediaQueryWithId)

export const getSingleComponentCss = (
	compId: string,
	breakpointsOrder: ComponentCss['breakpointsOrder'],
	cssContext: CssContext,
	compCss: Omit<ComponentCss, 'breakpointsOrder' | 'compSpecificData'>,
	experiments: Experiments
): SingleComponentCss => {
	const idSelector = cssContext.isInRepeater ? getTemplateRepeaterIdSelector(compId) : getRegularIdSelector(compId)

	const declaredMediaQueries = [
		THE_DEFAULT_BREAKPOINT,
		...(breakpointsOrder?.values || EMPTY_ARRAY).map(toMediaQueryWithId),
	]
	const breakpoints = experiments['specs.thunderbolt.new_responsive_layout_render_all_breakpoints']
		? _.uniqBy(
				[
					...declaredMediaQueries,
					...getMediaQueriesFromVariants(compCss.responsiveLayout?.layoutVariants),
					...getMediaQueriesFromVariants(compCss.variables?.variablesVariants),
				],
				'id'
		  )
		: declaredMediaQueries

	return _.mapValues(compCss, (css, key) =>
		breakpoints.reduce<MediaQueryToSelectorObj>((acc, { id, mediaQuery }) => {
			if (!css) {
				return acc
			}
			// @ts-expect-error
			const selectorObj = cssFeatures[key].domApplier(compId, idSelector, id, css, cssContext)
			acc[mediaQuery] = acc[mediaQuery] ? _.merge({}, acc[mediaQuery], selectorObj) : selectorObj
			return acc
		}, {})
	)
}

const stringifyMediaQueryToSelectorObj = (mediaQueryToSelectorObj: MediaQueryToSelectorObj) => {
	let css = ''
	for (const mediaQuery in mediaQueryToSelectorObj) {
		const selectorObj = mediaQueryToSelectorObj[mediaQuery]
		const cssString = selectorObjToCss(selectorObj)
		css += mediaQuery === 'default' ? cssString : `${mediaQuery}{${cssString}}`
	}
	return css
}

export const stringifySingleComponentCss = (singleCompCss: SingleComponentCss) =>
	Object.values(singleCompCss).map(stringifyMediaQueryToSelectorObj).join('')

export const stringifyAllComponentsCss = (compsToCss: CompIdTo<SingleComponentCss>) => {
	let css = ''
	for (const compId in compsToCss) {
		const mediaQueriesToSelectorObjForComp = compsToCss[compId]
		css += stringifySingleComponentCss(mediaQueriesToSelectorObjForComp)
	}
	return css
}
