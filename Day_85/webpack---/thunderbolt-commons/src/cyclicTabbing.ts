const candidateSelectors = [
	'iframe',
	'input',
	'select',
	'a[href]',
	'textarea',
	'button',
	'[tabindex]:not([tabindex="-1"])',
].join(',')

const changeTabIndex = (focusableElement: Element) => {
	const candidateTabIndex =
		focusableElement.getAttribute('data-restore-tabindex') ||
		focusableElement.getAttribute('tabindex') ||
		`${(focusableElement as HTMLElement).tabIndex}`
	focusableElement.setAttribute('tabindex', '-1')
	focusableElement.setAttribute('data-restore-tabindex', candidateTabIndex)
}

export const enableCyclicTabbing = (excludedParentSelectors: Array<string> = []) => {
	if (!process.env.browser) {
		return
	}
	const focusableElements = document.querySelectorAll(candidateSelectors)
	const excludedParentElements =
		excludedParentSelectors.length > 0
			? Array.from(document.querySelectorAll(excludedParentSelectors.join(',')))
			: []
	focusableElements.forEach((focusableElement) => {
		if (!excludedParentElements.some((parent) => parent.contains(focusableElement))) {
			changeTabIndex(focusableElement)
		}
	})
}
export const disableCyclicTabbing = () => {
	if (!process.env.browser) {
		return
	}

	const focusableElements = document.querySelectorAll('[data-restore-tabindex]')
	focusableElements.forEach((focusableElement) => {
		const restoreTabIndex = focusableElement.getAttribute('data-restore-tabindex')
		if (restoreTabIndex) {
			focusableElement.setAttribute('tabindex', restoreTabIndex)
			focusableElement.removeAttribute('data-restore-tabindex')
		}
	})
}
