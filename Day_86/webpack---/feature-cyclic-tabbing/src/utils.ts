export const tabbableTags = ['iframe', 'input', 'select', 'textarea', 'button']

export const isElementTabbable = (element: HTMLElement): boolean => {
	const tagName = element.tagName.toLowerCase()
	const href = element.getAttribute('href')
	const tabIndex = element.getAttribute('tabIndex')

	return tabbableTags.includes(tagName) || (tagName === 'a' && !!href) || (!!tabIndex && tabIndex !== '-1')
}
