import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	BrowserWindow,
	BrowserWindowSymbol,
	Experiments,
	ExperimentsSymbol,
	FeatureExportsSymbol,
	ICyclicTabbing,
} from '@wix/thunderbolt-symbols'
import {
	enableCyclicTabbing as enableCyclicTabbingOldVersion,
	disableCyclicTabbing as disableCyclicTabbingOldVersion,
	isSSR,
} from '@wix/thunderbolt-commons'
import { IFeatureExportsStore } from 'thunderbolt-feature-exports'
import { name } from './symbols'
import { EnabledCyclicTabbingComponents, ElementsIds } from './types'
import { tabbableTags } from './utils'

const candidateSelectors = [...tabbableTags, 'a[href]', '[tabindex]:not([tabindex="-1"])'].join(',')

const RESTORE_TAB_INDEX_DATA_ATTR = 'data-restore-tabindex'

export const CyclicTabbing = withDependencies(
	[BrowserWindowSymbol, named(FeatureExportsSymbol, name), ExperimentsSymbol],
	(
		browserWindow: BrowserWindow,
		cyclicTabbingExports: IFeatureExportsStore<typeof name>,
		experiments: Experiments
	): ICyclicTabbing => {
		if (!experiments['specs.thunderbolt.enableCyclicTabbing']) {
			const cyclicTabbingOldApi = {
				enableCyclicTabbing: (parentIds: Array<string>) =>
					enableCyclicTabbingOldVersion(parentIds.map?.((id) => `#${id}`) || [`#${parentIds}`]),
				disableCyclicTabbing: disableCyclicTabbingOldVersion,
			}
			cyclicTabbingExports.export(cyclicTabbingOldApi)

			return cyclicTabbingOldApi
		}

		let enabledCyclicTabbingComponents: EnabledCyclicTabbingComponents = []

		const convertIdsToSelectors = (elementsIds: ElementsIds) => {
			const elementsIdsArr: Array<string> = Array.isArray(elementsIds) ? elementsIds : [elementsIds]
			return elementsIdsArr.map((id) => `#${id}`).join(',')
		}

		const enableCyclicTabbing: ICyclicTabbing['enableCyclicTabbing'] = (
			cyclicTabbingParentCompIds: ElementsIds = []
		) => {
			if (isSSR(browserWindow)) {
				return
			}
			if (enabledCyclicTabbingComponents.length > 0) {
				restoreTabIndexes()
			}
			enabledCyclicTabbingComponents.push({
				cyclicTabbingParentCompIds,
			})
			preventElementsTabbing(cyclicTabbingParentCompIds)
		}

		const disableCyclicTabbing: ICyclicTabbing['disableCyclicTabbing'] = (
			cyclicTabbingParentCompIds: Array<string>
		) => {
			if (isSSR(browserWindow)) {
				return
			}
			restoreTabIndexes()
			restorePreviousCyclicTabbing(cyclicTabbingParentCompIds)
		}

		const preventElementTabbing = (focusableElement: Element) => {
			const candidateTabIndex =
				focusableElement.getAttribute(RESTORE_TAB_INDEX_DATA_ATTR) || focusableElement.getAttribute('tabindex')
			focusableElement.setAttribute('tabindex', '-1')
			focusableElement.setAttribute(RESTORE_TAB_INDEX_DATA_ATTR, `${candidateTabIndex}`)
		}

		function preventElementsTabbing(cyclicTabbingParentCompIds: ElementsIds) {
			const focusableElements = browserWindow!.document.querySelectorAll(candidateSelectors)
			const excludedParentElements = cyclicTabbingParentCompIds
				? Array.from(
						browserWindow!.document.querySelectorAll(convertIdsToSelectors(cyclicTabbingParentCompIds))
				  )
				: []
			focusableElements.forEach((focusableElement) => {
				if (!excludedParentElements.some((parent) => parent.contains(focusableElement))) {
					preventElementTabbing(focusableElement)
				}
			})
		}

		const restoreTabIndexes = () => {
			const focusableElements = browserWindow!.document.querySelectorAll(`[${RESTORE_TAB_INDEX_DATA_ATTR}]`)
			focusableElements.forEach((focusableElement) => {
				const restoredTabIndex = focusableElement.getAttribute(RESTORE_TAB_INDEX_DATA_ATTR)
				if (restoredTabIndex === 'null') {
					focusableElement.removeAttribute('tabindex')
				} else if (restoredTabIndex) {
					focusableElement.setAttribute('tabindex', restoredTabIndex)
				}
				focusableElement.removeAttribute(RESTORE_TAB_INDEX_DATA_ATTR)
			})
		}

		const restorePreviousCyclicTabbing = (cyclicTabbingParentCompIds: Array<string>) => {
			const parentSelectors = convertIdsToSelectors(cyclicTabbingParentCompIds)
			enabledCyclicTabbingComponents = enabledCyclicTabbingComponents.filter(
				(component) => convertIdsToSelectors(component.cyclicTabbingParentCompIds) !== parentSelectors
			)
			const lastModuleInFocus = enabledCyclicTabbingComponents.pop()
			if (lastModuleInFocus) {
				enableCyclicTabbing(lastModuleInFocus.cyclicTabbingParentCompIds)
			}
		}

		cyclicTabbingExports.export({
			enableCyclicTabbing,
			disableCyclicTabbing,
		})

		return {
			enableCyclicTabbing,
			disableCyclicTabbing,
		}
	}
)
