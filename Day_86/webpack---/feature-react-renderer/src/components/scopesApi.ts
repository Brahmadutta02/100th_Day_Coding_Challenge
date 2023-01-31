import { getDisplayedId, getFullId, getInnerMostItemId, getTemplateFromInflatedId } from '@wix/thunderbolt-commons'

export type ScopeData = { scope: Array<string | undefined>; repeaterItemsIndexes: Array<number | undefined> }

export const emptyScope = { scope: [], repeaterItemsIndexes: [] }

export const getChildScope = (
	parentId: string,
	parentScope: ScopeData,
	childScopeData?: { scopeId: string; parentType: string; itemIndex?: number }
) => {
	if (!childScopeData) {
		return parentScope
	}
	switch (childScopeData.parentType) {
		case 'Repeater':
			const repeaterScopedItem = getInnerMostItemId(childScopeData.scopeId!)
			const repeaterChildScope = [
				...parentScope.scope,
				getDisplayedId(getTemplateFromInflatedId(parentId)!, repeaterScopedItem),
			]
			const childRepeaterItemIndexes = [...parentScope.repeaterItemsIndexes, childScopeData.itemIndex]
			return { scope: repeaterChildScope, repeaterItemsIndexes: childRepeaterItemIndexes }

		case 'RefComponent':
			const refCompScopeId = getTemplateFromInflatedId(getFullId(childScopeData.scopeId))
			const refCompChildScope = [...parentScope.scope, refCompScopeId]
			return { scope: refCompChildScope, repeaterItemsIndexes: parentScope.repeaterItemsIndexes }

		default:
			throw new Error('childScopeData.parentType is not supported')
	}
}

export const getScopesAttributes = (scopeData: ScopeData) => {
	const { scope, repeaterItemsIndexes } = scopeData
	const scopeAttributes: { 'data-scope'?: string; 'data-repeater-items-indexes'?: string } = {}
	if (scope.length > 0) {
		scopeAttributes['data-scope'] = scope.join(',')
	}
	if (repeaterItemsIndexes.length > 0) {
		scopeAttributes['data-repeater-items-indexes'] = repeaterItemsIndexes.join(',')
	}

	return scopeAttributes
}
