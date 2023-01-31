import _ from 'lodash'
import type { BaseDataItem, RepeaterVariant, VariantDataItem } from '@wix/thunderbolt-becky-types'
import type { VariantRelationViewItem, CompVariantsViewItem, RefArrayViewItem } from '@wix/thunderbolt-catharsis'
import { InnerVariant } from '@wix/thunderbolt-becky-types'
import { getDisplayedId, getItemId, isDisplayedOnly } from '@wix/thunderbolt-commons'
import { PatternsMap, Selectors } from '../features/cssFeature.types'
import { getTemplateRepeaterIdSelector, getRegularIdSelector, getInflatedRepeaterIdSelector } from './selectorsUtils'
import { CssContext, GetParentCb } from '../features/componentCss.types'

type SelectorInComp = {
	selector: string
	variantSelectorPermutations: Array<string>
	selectorCompId: string
	componentId: string
}
type AggregatedSelectors = { targetComp: Selectors; ancestorComps: Selectors }

const VARIANT_SELECTOR: Record<
	string,
	<T extends VariantDataItem>(variant: T, patterns?: PatternsMap) => string | Array<string>
> = {
	Hover: () => ':hover',
	Class: (variant) => `.${variant.id}`,
	State: (variant) => `.${variant.id}`,
	Preset: (variant) => `.${variant.id}`,
	Mobile: () => '.device-mobile-optimized',
	RepeaterPattern: (variant, patterns?: PatternsMap) =>
		patterns?.[(variant as RepeaterVariant).componentId]?.nthChildren?.[variant.id] || [],
}

const isRepeaterPattern = (variant: InnerVariant) => variant.type === 'RepeaterPattern'

const variantHasSpecificity = (variant: InnerVariant) => !isRepeaterPattern(variant)

const getInflatedRepeaterId = (compIdToFix: string, targetId: string) => {
	const itemId = getItemId(targetId)
	if (itemId) {
		compIdToFix = getDisplayedId(compIdToFix, itemId)
	}
	return compIdToFix
}

const outerVariants = ['Preset', 'Mobile']

const getIdSelector = (compId: string, targetId: string, isRepeaterTemplate: boolean = false) => {
	if (!compId) {
		return ''
	}
	const maybeInflatedId = getInflatedRepeaterId(compId, targetId)

	const isInflatedChildOfRepeater = isDisplayedOnly(maybeInflatedId)
	if (isInflatedChildOfRepeater) {
		return getInflatedRepeaterIdSelector(maybeInflatedId)
	}

	if (isRepeaterTemplate) {
		return getTemplateRepeaterIdSelector(maybeInflatedId)
	}

	return getRegularIdSelector(maybeInflatedId)
}

const sortVariantsByTreeStructure = (variantsGroupedByCompId: Array<Array<InnerVariant>>, getParent?: GetParentCb) => {
	const variantsOnSingleComp = variantsGroupedByCompId.length < 2
	if (variantsOnSingleComp) {
		return variantsGroupedByCompId
	}
	const compIdsInVariants = variantsGroupedByCompId.map((groupedVariants) => groupedVariants[0].componentId)

	let curr = getParent?.()
	const sortedVariantsGroupedByCompId = []
	while (curr && sortedVariantsGroupedByCompId.length < variantsGroupedByCompId.length) {
		const compIdIndex = compIdsInVariants.indexOf(curr.componentId)
		if (compIdIndex >= 0) {
			sortedVariantsGroupedByCompId.unshift(variantsGroupedByCompId[compIdIndex])
		}
		curr = curr.getParent?.()
	}
	return sortedVariantsGroupedByCompId
}

const getVariantsGroupedByCompId = (
	variantKey: string,
	variants: CompVariantsViewItem | null,
	patterns?: PatternsMap,
	getParent?: GetParentCb
) => {
	if (!variants || !variantKey) {
		return []
	}

	const compIdToIndex: { [key: string]: number } = {}
	const variantIds = variantKey.split(VARIANTS_SEPARATOR)

	// group by variant's component ID while maintaining the variants' order
	const variantsGroupedByCompId = variantIds.reduce((acc: Array<Array<InnerVariant>>, variantId) => {
		const variant = variants[variantId] as InnerVariant
		const componentId = isRepeaterPattern(variant)
			? (patterns as PatternsMap)![variant.componentId]!.componentId
			: variant.componentId

		const componentVariantsIndex = compIdToIndex[componentId] >= 0 ? compIdToIndex[componentId] : acc.length
		compIdToIndex[componentId] = componentVariantsIndex

		acc[componentVariantsIndex] = acc[componentVariantsIndex] || []
		acc[componentVariantsIndex].push({ ...variant, componentId })
		return acc
	}, [])

	return sortVariantsByTreeStructure(variantsGroupedByCompId, getParent)
}

/**
 * create all combinations of the given selectors . e.g.
 * selectors1: ['.selector11','.selector12'],
 * selectors2: ['.selector21', '.selector22']
 * result:
 * ['.selector11.selector21','.selector12.selector21', '.selector11.selector22','.selector12.selector22']
 */
const createSelectorsPermutations = (
	selectors1: Selectors,
	selectors2: Selectors,
	permutationCb: (selector1: string, selector2: string) => string
) => {
	if (!selectors1.length && !selectors2.length) {
		return []
	}
	const selectorsArr1 = selectors1.length ? selectors1 : ['']
	const selectorsArr2 = selectors2.length ? selectors2 : ['']
	return _.flatten(
		selectorsArr1.map((selector1) => selectorsArr2.map((selector2) => permutationCb(selector1, selector2)))
	)
}

const resolveSpecificity = (
	compId: string,
	targetId: string,
	selector: string,
	currentSelectorShouldHaveSpecificity: boolean,
	compSelectorShouldHaveSpecificity: boolean,
	isInRepeater?: boolean
) => {
	if (currentSelectorShouldHaveSpecificity) {
		return selector
	}

	return compSelectorShouldHaveSpecificity
		? `:where(${selector})`
		: `:where(${getIdSelector(compId, targetId, isInRepeater)}${selector})`
}

const getSelectorsForSpecificComp = ({
	targetId,
	variantsInComp,
	variants,
	patterns,
	isInRepeater,
}: {
	targetId: string
	variantsInComp: Array<InnerVariant>
	variants: CompVariantsViewItem
	patterns?: PatternsMap
	isInRepeater?: boolean
}) => {
	const [{ componentId, type }] = variantsInComp
	const compSelectorShouldHaveSpecificity = targetId === componentId || variantsInComp.some(variantHasSpecificity)
	const selectorCompId = outerVariants.includes(type) || !compSelectorShouldHaveSpecificity ? '' : componentId
	return variantsInComp.reduce(
		(acc: SelectorInComp, variant) => {
			const currentSelectorShouldHaveSpecificity = variantHasSpecificity(variant)
			const resolvedVariantSelector = VARIANT_SELECTOR[variant.type](variants[variant.id], patterns)
			if (Array.isArray(resolvedVariantSelector)) {
				// result for example [':nth-child(3n+1)', ':nth-child(3n+1)']
				acc.variantSelectorPermutations.push(
					...(resolvedVariantSelector as Array<string>).map((selector) =>
						resolveSpecificity(
							componentId,
							targetId,
							selector,
							currentSelectorShouldHaveSpecificity,
							compSelectorShouldHaveSpecificity,
							isInRepeater
						)
					)
				)
			} else {
				// since we know low specificity exist only on repeater variant, for now we won't resolve specificity here
				acc.selector = `${acc.selector}${resolvedVariantSelector}` // result for example '.variant-hover.variant-click'
			}
			return acc
		},
		{ selector: '', variantSelectorPermutations: [], selectorCompId, componentId }
	)
}

const aggregateVariantSelectors = (
	targetCompId: string,
	selectorsData: AggregatedSelectors,
	isInRepeater: boolean,
	selectorsInComp: SelectorInComp
) => {
	const aggregatedSelectors = { ...selectorsData }
	const isTargetComp = selectorsInComp.componentId === targetCompId

	const currIdSelector = getIdSelector(selectorsInComp.selectorCompId, targetCompId, isInRepeater)

	const existSelectors = isTargetComp ? selectorsData.targetComp : selectorsData.ancestorComps
	const newSelectors = createSelectorsPermutations(
		selectorsInComp.variantSelectorPermutations,
		[selectorsInComp.selector],
		(ancestorSelector, selector) => `${currIdSelector}${ancestorSelector}${selector}`
	)

	aggregatedSelectors[isTargetComp ? 'targetComp' : 'ancestorComps'] = createSelectorsPermutations(
		existSelectors,
		newSelectors,
		(existSelector, newSelector) => `${existSelector ? `${existSelector} ` : ''}${newSelector}`
	)

	return aggregatedSelectors
}

const concatSelectors = (selector1: string, selector2: string) =>
	[selector1, selector2].filter((selector) => selector).join(' ')

/**
 * Detailed logic explanation in variants.md
 */
export const getVariantSelectors = (
	variantKey: string,
	variants: CompVariantsViewItem | null,
	compId: string,
	accumulatedData: CssContext
) => {
	const { patterns, getParent, isInRepeater = false } = accumulatedData
	if (!variants || !variantKey || !Object.keys(variants).length) {
		return [getIdSelector(compId, compId, isInRepeater)]
	}

	const aggregatedSelectors: { targetComp: Selectors; ancestorComps: Selectors } = {
		targetComp: [],
		ancestorComps: [],
	}
	const groupedVariantsByComp = getVariantsGroupedByCompId(variantKey, variants, patterns, getParent)

	groupedVariantsByComp.forEach((variantsInComp) => {
		const selectorsInComp = getSelectorsForSpecificComp({
			targetId: compId,
			variantsInComp,
			variants,
			patterns,
			isInRepeater,
		})
		Object.assign(
			aggregatedSelectors,
			aggregateVariantSelectors(compId, aggregatedSelectors, isInRepeater, selectorsInComp)
		)
	})

	const selectorId = getIdSelector(compId, compId, isInRepeater)
	const mergedAncestorsSelectorsWithTargetSelector = createSelectorsPermutations(
		aggregatedSelectors.ancestorComps,
		aggregatedSelectors.targetComp,
		(ancestorSelector, targetCompSelector) => concatSelectors(ancestorSelector, targetCompSelector || selectorId)
	)
	return mergedAncestorsSelectorsWithTargetSelector
}

export const isRefArray = <T extends BaseDataItem>(item?: BaseDataItem): item is RefArrayViewItem<T> =>
	item?.type === 'RefArray'
export const isVariantRelation = <TItem>(item: BaseDataItem): item is VariantRelationViewItem<TItem> =>
	item.type === 'VariantRelation'

export const VARIANTS_SEPARATOR = '$$$'
