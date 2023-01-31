export const REPEATER_DELIMITER = '__'

export const getDisplayedId = (originalId: string, itemId: string) => `${originalId}${REPEATER_DELIMITER}${itemId}`

export const getFullId = (id: string) => id.split(REPEATER_DELIMITER)[0]

export const getItemId = (id: string) => id.split(REPEATER_DELIMITER)[1]

export const getInnerMostItemId = (itemId: string) => itemId.split(REPEATER_DELIMITER)[0]

export const getTemplateCompIdAndRepeaterScope = (id: string) => {
	const [templateCompId, ...itemIds] = id.split(REPEATER_DELIMITER)
	return { templateCompId, scope: itemIds }
}

export const getFullItemId = (id: string) => {
	const [_compId, ...itemIds] = id.split(REPEATER_DELIMITER) // eslint-disable-line @typescript-eslint/no-unused-vars
	return itemIds.join(REPEATER_DELIMITER)
}

export const getOuterItemId = (id: string) => {
	const [_compId, _innerItemId, ...outerItemIds] = id.split(REPEATER_DELIMITER) // eslint-disable-line @typescript-eslint/no-unused-vars
	return outerItemIds.join(REPEATER_DELIMITER)
}

export const isDisplayedOnly = (id: string) => getFullId(id) !== id

export const isRepeater = (compType: string) => compType.split('.').pop() === 'Repeater'

export const isRepeatedComponentOfTemplate = (templateCompId: string) => {
	const templatePrefix = `${templateCompId}${REPEATER_DELIMITER}`
	return (compId: string) => compId.startsWith(templatePrefix)
}

// 'itemInner__itemMiddle__itemOuter' => [ 'itemInner__itemMiddle__itemOuter', 'itemInner__itemMiddle', 'itemInner' ]
export const getRepeaterItemsAncestorChain = (itemId: string) => {
	const repeaterItemsAncestorChain: Array<string> = []
	itemId
		.split(REPEATER_DELIMITER)
		.forEach((item, index) =>
			index === 0
				? repeaterItemsAncestorChain.push(item)
				: repeaterItemsAncestorChain.push(getDisplayedId(repeaterItemsAncestorChain[index - 1], item))
		)
	return repeaterItemsAncestorChain.reverse()
}
