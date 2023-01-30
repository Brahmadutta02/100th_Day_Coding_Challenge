import fastdom from 'fastdom'
import { debounce } from 'lodash'
import type {
	ActiveAnchor,
	ActiveAnchorObserverComp,
	Anchor,
	AnchorClient,
	AnchorWithElement,
	PageAnchorsObserverComp,
	PageConfigAnchor,
} from './types'
import { PageAnchorsPageConfig } from './types'
import { BrowserWindow, IPropsStore } from '@wix/thunderbolt-symbols'
import {
	RESIZE_DEBOUNCE_WAIT,
	SCROLL_DEBOUNCE_WAIT,
	TOP_ANCHOR,
	TOP_ANCHOR_COMP_ID,
	TOP_ANCHOR_DATA_ID,
	WIX_ADS,
} from './constants'

export const getAnchorsObserversPropsToUpdate = (
	browserWindow: BrowserWindow,
	pageAnchorsObservers: Array<PageAnchorsObserverComp>,
	activeAnchorObservers: Array<ActiveAnchorObserverComp>,
	activeAnchor: ActiveAnchor,
	anchorsWithElements: Array<AnchorWithElement>,
	pageId: string,
	shouldSetPageAnchors: boolean
) => {
	const propsToUpdate: {
		[compId: string]: { activeAnchor: ActiveAnchor; anchors?: Array<AnchorClient> }
	} = {}

	if (activeAnchorObservers.length) {
		activeAnchorObservers.forEach((comp: ActiveAnchorObserverComp) => {
			propsToUpdate[comp.id] = { activeAnchor }
		})
	}

	if (pageAnchorsObservers.length) {
		const reducedAnchors: Array<AnchorClient> = anchorsWithElements
			? anchorsWithElements.map((anchorWithElement) => ({
					compId: anchorWithElement.compId,
					dataId: anchorWithElement.dataId,
					name: anchorWithElement.name,
			  }))
			: []
		pageAnchorsObservers.forEach((comp: PageAnchorsObserverComp) => {
			propsToUpdate[comp.id] = { activeAnchor }
			// Set anchors only to VerticalAnchorsMenu component, and only on init
			if (shouldSetPageAnchors) {
				const { pageTopLabel, hiddenAnchorIds } = comp.compData
				const pageHiddenAnchorIds: Array<string> =
					hiddenAnchorIds && hiddenAnchorIds.hasOwnProperty(pageId)
						? (hiddenAnchorIds as Record<string, Array<string>>)[pageId]
						: []
				const topAnchor: AnchorClient = {
					compId: TOP_ANCHOR_COMP_ID,
					dataId: TOP_ANCHOR_DATA_ID,
					name: pageTopLabel || '',
				}
				const _anchors = [topAnchor].concat(reducedAnchors).filter((anchor) => {
					const anchorCompId = anchor.compId
					const anchorElement = browserWindow!.document.getElementById(anchorCompId)
					const isAnchorVisibleInDOM =
						anchorCompId === TOP_ANCHOR_COMP_ID ||
						Boolean(anchorElement && browserWindow!.getComputedStyle(anchorElement).display !== 'none')
					const isAnchorVisibleInData = !pageHiddenAnchorIds.includes(anchorCompId)

					return isAnchorVisibleInDOM && isAnchorVisibleInData
				})
				propsToUpdate[comp.id].anchors = _anchors.length ? _anchors : [topAnchor]
			}
		})
	}

	return propsToUpdate
}

const convertAnchorToActiveAnchor = (anchor: Anchor): ActiveAnchor => {
	return {
		compId: anchor.compId,
		dataId: anchor.dataId,
	}
}
export const getActiveAnchor = (anchors: Array<Anchor>, offset: number, browserWindow: BrowserWindow): ActiveAnchor => {
	const isBottomOfPage =
		browserWindow!.innerHeight + browserWindow!.scrollY >= browserWindow!.document.body.scrollHeight
	if (isBottomOfPage) {
		return anchors[anchors.length - 1]
	}
	const nextActiveAnchorIndex = anchors.findIndex((anchor: Anchor) => Math.floor(anchor.top - offset) > 0)
	let activeAnchor: ActiveAnchor
	if (nextActiveAnchorIndex === -1 && anchors[anchors.length - 1]) {
		// all anchors above viewport - return last anchor
		activeAnchor = convertAnchorToActiveAnchor(anchors[anchors.length - 1])
	} else if (nextActiveAnchorIndex === 0 || !anchors[nextActiveAnchorIndex - 1]) {
		// active anchor is in the top of the page
		activeAnchor = TOP_ANCHOR
	} else {
		activeAnchor = convertAnchorToActiveAnchor(anchors[nextActiveAnchorIndex - 1])
	}
	return activeAnchor
}

export const createAnchorObserver = (
	pageAnchorsObservers: Array<PageAnchorsObserverComp>,
	activeAnchorObservers: Array<ActiveAnchorObserverComp>,
	anchors: PageAnchorsPageConfig['anchors'],
	browserWindow: BrowserWindow,
	propsStore: IPropsStore,
	pageId: string,
	siteOffset: number,
	reCheckAnchors: boolean = false
) => {
	let anchorsWithElements: Array<AnchorWithElement>
	let offset = siteOffset

	const initAnchors = () => {
		// initialize the wix AD height for anchor calculation
		const wixAds = browserWindow!.document.getElementById(WIX_ADS)
		if (wixAds) {
			offset += wixAds.offsetHeight
		}
		// TODO - change this reduce to map once @guybs understands why some elements are missing from the DOM. For now we filter them out
		anchorsWithElements = anchors.reduce(
			(acc: Array<AnchorWithElement>, anchor: PageConfigAnchor): Array<AnchorWithElement> => {
				const element = browserWindow!.document.getElementById(anchor.compId)
				if (element) {
					acc.push({
						...anchor,
						element,
						top: element.getBoundingClientRect().top || 0,
					})
				}
				return acc
			},
			[]
		)
		sortAnchors()
	}

	const getMeasuredAnchors = (): Array<AnchorWithElement> => {
		// in the editor anchors are added after we invoke the model update handler, so we need to find all elements on measurement
		if (reCheckAnchors && (!anchorsWithElements || anchors.length > anchorsWithElements.length)) {
			initAnchors()
		}
		return anchorsWithElements.map((anchorWithElement: AnchorWithElement) => ({
			...anchorWithElement,
			top: anchorWithElement.element.getBoundingClientRect().top || 0,
		}))
	}

	const setAnchors = (shouldSetPageAnchors: boolean) => {
		const activeAnchor = getActiveAnchor(anchorsWithElements, offset, browserWindow)

		if (activeAnchor) {
			propsStore.update(
				getAnchorsObserversPropsToUpdate(
					browserWindow,
					pageAnchorsObservers,
					activeAnchorObservers,
					activeAnchor,
					anchorsWithElements,
					pageId,
					shouldSetPageAnchors
				)
			)
		}
	}
	const sortAnchors = () => anchorsWithElements.sort((anchor1, anchor2) => anchor1.top - anchor2.top)

	const measureAnchors = (reSort: boolean) => {
		anchorsWithElements = getMeasuredAnchors()
		if (reSort) {
			sortAnchors()
		}
	}

	const calculateAnchors = (_reCheckAnchors: boolean) => {
		fastdom.measure(() => {
			measureAnchors(_reCheckAnchors)
			setAnchors(_reCheckAnchors)
		})
	}
	const pageAnchorsScrollListener = debounce(calculateAnchors.bind(null, reCheckAnchors), SCROLL_DEBOUNCE_WAIT)
	const pageAnchorsResizeListener = debounce(calculateAnchors.bind(null, true), RESIZE_DEBOUNCE_WAIT)

	return () => {
		fastdom.measure(() => {
			initAnchors()
			setAnchors(true)
		})
		browserWindow!.addEventListener('scroll', pageAnchorsScrollListener)
		browserWindow!.addEventListener('resize', pageAnchorsResizeListener)

		return () => {
			browserWindow!.removeEventListener('scroll', pageAnchorsScrollListener)
			browserWindow!.removeEventListener('resize', pageAnchorsResizeListener)
		}
	}
}
