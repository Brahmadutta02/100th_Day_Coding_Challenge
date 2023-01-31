import { BaseDataItem } from '@wix/thunderbolt-becky-types'
import { VariantRelationViewItem } from '@wix/thunderbolt-catharsis'
import { BreakpointsVariantsTo } from '../shared.types'
import { isVariantRelation, VARIANTS_SEPARATOR } from './variantsUtils'

export const getVariant = <TItem extends BaseDataItem>(val: VariantRelationViewItem<TItem> | TItem) => {
	if (!isVariantRelation(val)) {
		return { breakpointId: 'default', variantsKey: '', value: val }
	}

	const seed = { breakpointId: 'default', variantsKey: '', value: val.to }
	return val.variants.reduce((acc, curr) => {
		if (curr.type === 'BreakpointRange') {
			// choose the first breakpoint
			acc.breakpointId = acc.breakpointId === 'default' ? curr.id : acc.breakpointId
		} else {
			acc.variantsKey = acc.variantsKey === '' ? curr.id : `${acc.variantsKey}${VARIANTS_SEPARATOR}${curr.id}`
		}
		return acc
	}, seed)
}

export const toBreakpointVariantsMap = <TItem extends BaseDataItem, TResult>(
	items: Iterable<VariantRelationViewItem<TItem> | TItem>,
	getResults: (item: TItem) => TResult,
	reduce: (current: TResult, prev: TResult | undefined) => TResult
): BreakpointsVariantsTo<TResult> => {
	const variantsToLayouts: BreakpointsVariantsTo<TResult> = {}

	for (const val of items) {
		const { breakpointId, variantsKey, value } = getVariant(val)
		const results = getResults(value)
		variantsToLayouts[breakpointId] = variantsToLayouts[breakpointId] || {}
		variantsToLayouts[breakpointId][variantsKey] = reduce(results, variantsToLayouts[breakpointId][variantsKey])
	}

	return variantsToLayouts
}

const concat = <T extends Array<TItem>, TItem>(current: T, prev: T | undefined) =>
	prev ? prev.concat(current) : current

const assign = <T extends object>(current: T, prev: T | undefined) => (prev ? { ...prev, ...current } : current)

const last = <T>(current: T) => current

export const REDUCE_FUNCTIONS = {
	concat,
	assign,
	last,
}
