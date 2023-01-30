// @ts-nocheck

import { getData, setAttributes, setData, setStyle } from '../../utils/domUtils'
import { findKey } from '../../utils/utils'

const MORE_BUTTON_SUFFIX = '__more__'
const MORE_CONTAINER_PREFIX = 'moreContainer'

const init = (contextWindow = window) => {
	const getDropDownWidthIfOk = (
		menuWidth,
		sameWidth,
		stretch,
		widths,
		menuWidthToReduce,
		maxWidth,
		removeMarginFromAllChildren,
		extraPixels
	) => {
		// eslint-disable-line complexity
		menuWidth -= menuWidthToReduce * (removeMarginFromAllChildren ? widths.length : widths.length - 1)
		menuWidth -= extraPixels.left + extraPixels.right
		if (sameWidth) {
			// width same width, all widths should be as the max width (calculated for the whole items in the calling method)
			widths = widths.map(() => maxWidth)
		}

		// not first measure - want sizes without 0
		if (widths.some((v) => v === 0)) {
			return null
		}
		let totalMenuItemsWidths = 0
		const total = widths.reduce((a, b) => a + b, 0)
		if (total > menuWidth) {
			// drop down should have less items
			return null
		}

		// calculate the width of the items
		if (sameWidth) {
			if (stretch) {
				const width = Math.floor(menuWidth / widths.length)
				const stretchedAndSameItemWidths = widths.map(() => width)
				totalMenuItemsWidths = width * widths.length
				if (totalMenuItemsWidths < menuWidth) {
					const totalRemnant = Math.floor(menuWidth - totalMenuItemsWidths)
					widths.forEach((wdth, index) => {
						if (index <= totalRemnant - 1) {
							stretchedAndSameItemWidths[index]++
						}
					})
				}
				return stretchedAndSameItemWidths
			}
			return widths
		}

		// not same width
		if (stretch) {
			const toAdd = Math.floor((menuWidth - total) / widths.length)
			totalMenuItemsWidths = 0
			const stretchItemsWidths = widths.map((itemWidth) => {
				totalMenuItemsWidths += itemWidth + toAdd
				return itemWidth + toAdd
			})
			if (totalMenuItemsWidths < menuWidth) {
				const remnant = Math.floor(menuWidth - totalMenuItemsWidths)
				widths.forEach((wdth, index) => {
					if (index <= remnant - 1) {
						stretchItemsWidths[index]++
					}
				})
			}
			return stretchItemsWidths
		}

		return widths
	}

	const getMaxWidth = (widths) => widths.reduce((a, b) => (a > b ? a : b), -Infinity)

	const checkForMarginMenu = (itemsContainer) => {
		const menuItem = itemsContainer.lastChild
		const itemCss = contextWindow.getComputedStyle(menuItem)
		const marginLeft = parseInt(itemCss.marginLeft, 10) || 0
		const marginRight = parseInt(itemCss.marginRight, 10) || 0

		return marginLeft + marginRight
	}

	const roundScaleMeasurement = (value) => Math.round(value)

	const checkValidNumber = (num) => {
		const number = parseFloat(num)
		return isFinite(number) ? number : 0
	}

	const getDivExtraPixels = (itemsContainer, includeMargin) => {
		const itemsContainerCss = contextWindow.getComputedStyle(itemsContainer)

		let top = checkValidNumber(itemsContainerCss.borderTopWidth) + checkValidNumber(itemsContainerCss.paddingTop)
		let bottom =
			checkValidNumber(itemsContainerCss.borderBottomWidth) + checkValidNumber(itemsContainerCss.paddingBottom)
		let left = checkValidNumber(itemsContainerCss.borderLeftWidth) + checkValidNumber(itemsContainerCss.paddingLeft)
		let right =
			checkValidNumber(itemsContainerCss.borderRightWidth) + checkValidNumber(itemsContainerCss.paddingRight)
		if (includeMargin) {
			top += checkValidNumber(itemsContainerCss.marginTop)
			bottom += checkValidNumber(itemsContainerCss.marginBottom)
			left += checkValidNumber(itemsContainerCss.marginLeft)
			right += checkValidNumber(itemsContainerCss.marginRight)
		}
		return { top, bottom, left, right, height: top + bottom, width: left + right }
	}

	const getViewportHeight = () => contextWindow.innerHeight

	const needToOpenDropDownUp = (menuCompDom) => {
		const menuClientRect = menuCompDom.getBoundingClientRect()
		const topRelativeToWindow = menuClientRect.top
		return topRelativeToWindow > getViewportHeight() / 2
	}

	const getLabelWidth = (labelNode, siteScale) =>
		roundScaleMeasurement(labelNode.getBoundingClientRect().width / siteScale)

	const calculateLineHeight = (menuHeight, measures) => {
		const lineHeight =
			menuHeight -
			measures.menuBorderY -
			measures.labelPad -
			measures.ribbonEls -
			measures.menuButtonBorder -
			measures.ribbonExtra

		return `${lineHeight}px`
	}

	const getMenuItemsToPresent = (id, measures, menuProperties, domNodes, menuItemsIdsWithMore) => {
		const menuWidth = measures.width

		measures.hasOriginalGapData = {}
		measures.originalGapBetweenTextAndBtn = {}
		const widths = menuItemsIdsWithMore.map((itemId) => {
			const menuItem = domNodes[id + itemId]
			let gapBetweenTextAndBtn
			const originalGap = getData(menuItem, 'originalGapBetweenTextAndBtn')
			if (originalGap === undefined) {
				measures.hasOriginalGapData[itemId] = false
				gapBetweenTextAndBtn =
					measures.children[id + itemId].boundingClientRectWidth - measures.labelWidths[`${id + itemId}label`]
				measures.originalGapBetweenTextAndBtn[id + itemId] = gapBetweenTextAndBtn
			} else {
				measures.hasOriginalGapData[itemId] = true
				gapBetweenTextAndBtn = parseFloat(originalGap)
			}
			if (measures.children[id + itemId].width > 0) {
				return Math.floor(measures.labelWidths[`${id + itemId}label`] + gapBetweenTextAndBtn)
			}
			return 0
		})
		const moreWidth = widths.pop()
		const sameWidth = menuProperties.sameWidthButtons
		const stretch = menuProperties.stretchButtonsToMenuWidth
		let moreShown = false
		const menuWidthToReduce = measures.menuItemContainerMargins
		const removeMarginFromAllChildren = measures.menuItemMarginForAllChildren
		const extraPixels = measures.menuItemContainerExtraPixels
		// check if it the menu can fit without "more"
		const maxWidth = getMaxWidth(widths)
		let realWidths = getDropDownWidthIfOk(
			menuWidth,
			sameWidth,
			stretch,
			widths,
			menuWidthToReduce,
			maxWidth,
			removeMarginFromAllChildren,
			extraPixels
		)
		if (!realWidths) {
			// find the menu with most items that work
			for (let i = 1; i <= widths.length; i++) {
				realWidths = getDropDownWidthIfOk(
					menuWidth,
					sameWidth,
					stretch,
					widths.slice(0, -1 * i).concat(moreWidth),
					menuWidthToReduce,
					maxWidth,
					removeMarginFromAllChildren,
					extraPixels
				)
				if (realWidths) {
					moreShown = true
					break
				}
			}
			if (!realWidths) {
				// found a case where the menu text was bigger then menu - more get the menu width
				moreShown = true
				realWidths = [moreWidth]
			}
		}
		if (moreShown) {
			const widthMore = realWidths[realWidths.length - 1]
			realWidths = realWidths.slice(0, -1)
			while (realWidths.length < menuItemsIdsWithMore.length) {
				realWidths.push(0)
			}
			realWidths[realWidths.length - 1] = widthMore
		}
		return {
			realWidths,
			moreShown,
		}
	}

	const measureChildrenDimensions = (id, domNodes, childrenIdsToMeasure, siteScale) => {
		const childrenMeasures = {}

		childrenIdsToMeasure.forEach((childId) => {
			const nodeId = `${id}${childId}`
			const domNode = domNodes[nodeId]
			if (domNode) {
				childrenMeasures[nodeId] = {
					width: domNode.offsetWidth,
					boundingClientRectWidth: roundScaleMeasurement(domNode.getBoundingClientRect().width / siteScale),
					height: domNode.offsetHeight,
				}
			}
		})

		return childrenMeasures
	}

	const getDataIDs = (rootNode) => {
		const numItems = +getData(rootNode, 'numItems')
		if (numItems <= 0 || numItems > Number.MAX_SAFE_INTEGER) {
			return []
		}

		return new Array(numItems).fill(0).map((num, i) => String(i))
	}

	const getChildrenIdsToMeasure = (menuItemIds) =>
		['moreContainer', 'itemsContainer', 'dropWrapper'].concat(menuItemIds, [MORE_BUTTON_SUFFIX])

	const measure = (id, services) => {
		const measures = {}
		const domNodes = {}
		domNodes[id] = contextWindow.document.getElementById(`${id}`)

		let siteScale = 1

		if (services.siteService) {
			siteScale = services.siteService.getSiteScale()
		}

		const menuItemIds = getDataIDs(domNodes[id])
		const childrenIdsToMeasure = getChildrenIdsToMeasure(menuItemIds)
		childrenIdsToMeasure.forEach((childId) => {
			const domNodeId = `${id}${childId}`
			domNodes[domNodeId] = contextWindow.document.getElementById(`${domNodeId}`)
		})
		measures.children = measureChildrenDimensions(id, domNodes, childrenIdsToMeasure, siteScale)
		const menuRoot = domNodes[id]
		const itemsContainer = domNodes[`${id}itemsContainer`]
		const menuItems = itemsContainer.childNodes
		const moreContainer = domNodes[`${id}moreContainer`]
		const moreChildNodes = moreContainer.childNodes

		const stretchButtonsToMenuWidth = getData(menuRoot, 'stretchButtonsToMenuWidth')
		const sameWidthButtons = getData(menuRoot, 'sameWidthButtons')

		/* add skin params to measure map*/

		const boundingClientRect = menuRoot.getBoundingClientRect()
		measures.absoluteLeft = boundingClientRect.left
		measures.bodyClientWidth = contextWindow.document.body.clientWidth

		measures.alignButtons = getData(menuRoot, 'dropalign')
		measures.hoverListPosition = getData(menuRoot, 'drophposition')
		measures.menuBorderY = parseInt(getData(menuRoot, 'menuborderY'), 10)
		measures.ribbonExtra = parseInt(getData(menuRoot, 'ribbonExtra'), 10)
		measures.ribbonEls = parseInt(getData(menuRoot, 'ribbonEls'), 10)
		measures.labelPad = parseInt(getData(menuRoot, 'labelPad'), 10)
		measures.menuButtonBorder = parseInt(getData(menuRoot, 'menubtnBorder'), 10)
		measures.menuItemContainerMargins = checkForMarginMenu(itemsContainer)
		measures.menuItemContainerExtraPixels = getDivExtraPixels(itemsContainer, true)
		measures.needToOpenMenuUp = needToOpenDropDownUp(menuRoot)
		measures.menuItemMarginForAllChildren =
			!stretchButtonsToMenuWidth || itemsContainer.getAttribute('data-marginAllChildren') !== 'false'
		measures.moreSubItem = []
		measures.labelWidths = {}
		measures.linkIds = {}
		measures.parentId = {}
		measures.menuItems = {}
		measures.labels = {}

		moreChildNodes.forEach((moreChild, i) => {
			measures.parentId[moreChild.id] = getData(moreChild, 'parentId')
			const dataId = getData(moreChild, 'dataId')

			measures.menuItems[dataId] = {
				dataId,
				parentId: getData(moreChild, 'parentId'),
				moreDOMid: moreChild.id,
				moreIndex: i,
			}

			domNodes[moreChild.id] = moreChild
			const labelNode = moreChild.querySelector('p')
			domNodes[labelNode.id] = labelNode
			measures.labels[labelNode.id] = {
				width: labelNode.offsetWidth,
				height: labelNode.offsetHeight,
				left: labelNode.offsetLeft,
				lineHeight: parseInt(contextWindow.getComputedStyle(labelNode).fontSize, 10),
			}
			measures.moreSubItem.push(moreChild.id)
		})

		/* add menu items left to measure map + add the labels to nodes map*/
		menuItems.forEach((menuItem, i) => {
			const dataId = getData(menuItem, 'dataId')

			measures.menuItems[dataId] = measures.menuItems[dataId] || {}
			measures.menuItems[dataId].menuIndex = i
			measures.menuItems[dataId].menuDOMid = menuItem.id
			measures.children[menuItem.id].left = menuItem.offsetLeft

			const labelNode = menuItem.querySelector('p')
			domNodes[labelNode.id] = labelNode
			measures.labelWidths[labelNode.id] = getLabelWidth(labelNode, siteScale)
			const linkElementNode = menuItem.querySelector('p')
			domNodes[linkElementNode.id] = linkElementNode
			measures.linkIds[menuItem.id] = linkElementNode.id
		})

		const menuHeight = menuRoot.offsetHeight
		measures.height = menuHeight
		measures.width = menuRoot.offsetWidth
		measures.lineHeight = calculateLineHeight(menuHeight, measures)

		const arrayWidths = getMenuItemsToPresent(
			id,
			measures,
			{
				sameWidthButtons,
				stretchButtonsToMenuWidth,
			},
			domNodes,
			menuItemIds.concat(MORE_BUTTON_SUFFIX)
		)

		measures.realWidths = arrayWidths.realWidths
		measures.isMoreShown = arrayWidths.moreShown
		measures.menuItemIds = menuItemIds
		measures.hoverState = getData(moreContainer, 'hover', false)

		return { measures, domNodes }
	}

	const setDropModeData = (node, isUp) => setData(node, { dropmode: isUp ? 'dropUp' : 'dropDown' })

	const getLabelLineHeight = (moreItemLineHeight, measures) =>
		moreItemLineHeight + 15 + measures.menuBorderY + measures.labelPad + measures.menuButtonBorder

	const getMenuPosition = (
		menuExtraPixels,
		alignButtons,
		moreContainerWidth,
		menuWidth,
		hoveredListPosition,
		hoveredItem,
		menuLeft,
		menuRight,
		clientWidth
	) => {
		let moreContainerLeft = '0px'
		let moreContainerRight = 'auto'
		const hoveredNodeLeftOffset = hoveredItem.left
		const hoveredNodeWidthOffset = hoveredItem.width
		if (alignButtons === 'left') {
			if (hoveredListPosition === 'left') {
				moreContainerLeft = 0
			} else {
				moreContainerLeft = `${hoveredNodeLeftOffset + menuExtraPixels.left}px`
			}
		} else if (alignButtons === 'right') {
			if (hoveredListPosition === 'right') {
				moreContainerRight = 0
			} else {
				moreContainerRight = `${
					menuWidth - hoveredNodeLeftOffset - hoveredNodeWidthOffset - menuExtraPixels.right
				}px`
			}
			moreContainerLeft = 'auto'
		} else if (hoveredListPosition === 'left') {
			// center
			moreContainerLeft = `${
				hoveredNodeLeftOffset + (hoveredNodeWidthOffset + menuExtraPixels.left - moreContainerWidth) / 2
			}px` // eslint-disable-line no-mixed-operators
		} else if (hoveredListPosition === 'right') {
			moreContainerLeft = 'auto'
			moreContainerRight = `${
				(hoveredNodeWidthOffset + menuExtraPixels.right - (moreContainerWidth + menuExtraPixels.width)) / 2
			}px`
		} else {
			moreContainerLeft = `${
				menuExtraPixels.left +
				hoveredNodeLeftOffset +
				(hoveredNodeWidthOffset - (moreContainerWidth + menuExtraPixels.width)) / 2
			}px` // eslint-disable-line no-mixed-operators
		}

		if (moreContainerLeft !== 'auto') {
			const subMenuLeft = menuLeft + parseInt(moreContainerLeft, 10)
			moreContainerLeft = subMenuLeft < 0 ? 0 : moreContainerLeft
		}

		if (moreContainerRight !== 'auto') {
			const subMenuRight = menuRight - parseInt(moreContainerRight, 10)
			moreContainerRight = subMenuRight > clientWidth ? 0 : moreContainerRight
		}

		return { moreContainerLeft, moreContainerRight }
	}

	const decideOnMenuPosition = (id, measures, hoveredItem, moreContainerWidth) => {
		const { width, height, alignButtons, hoverListPosition, menuItemContainerExtraPixels } = measures
		const menuLeft = measures.absoluteLeft
		const menuRight = menuLeft + width
		const menuPosition = getMenuPosition(
			menuItemContainerExtraPixels,
			alignButtons,
			moreContainerWidth,
			width,
			hoverListPosition,
			hoveredItem,
			menuLeft,
			menuRight,
			measures.bodyClientWidth
		)

		return {
			left: menuPosition.moreContainerLeft,
			right: menuPosition.moreContainerRight,
			top: measures.needToOpenMenuUp ? 'auto' : `${height}px`,
			bottom: measures.needToOpenMenuUp ? `${height}px` : 'auto',
		}
	}

	const isNumber = (n) => !isNaN(parseFloat(n)) && isFinite(n)

	const updateDropDownContainerLocation = (id, measures, domNodes, maxLabelWidth) => {
		const { hoverState } = measures
		if (hoverState !== '-1') {
			const { menuItemIds } = measures
			const subItemsIndex = menuItemIds.indexOf(hoverState)
			if (isNumber(measures.hoverState) || hoverState === MORE_BUTTON_SUFFIX) {
				const measureMapRealWidths = measures.realWidths
				if (!measureMapRealWidths) {
					return
				}
				const moreContainerWidth = Math.max(
					maxLabelWidth,
					measures.children[subItemsIndex !== -1 ? id + subItemsIndex : id + MORE_BUTTON_SUFFIX].width
				) // more container width is the max between text width and the more btn width
				const moreItemLineHeight =
					measures.moreSubItem.length !== 0
						? measures.labels[`${measures.moreSubItem[0]}label`].lineHeight
						: 0
				const newSubItemsLineHeight = getLabelLineHeight(moreItemLineHeight, measures)

				/* set css for every menu item in the more container*/
				measures.moreSubItem.forEach((subId) => {
					setStyle(domNodes[subId], { minWidth: `${moreContainerWidth}px` })
					setStyle(domNodes[`${subId}label`], { minWidth: '0px', lineHeight: `${newSubItemsLineHeight}px` })
				})

				/* set container position and decide if it's open up.down*/
				const hoveredInd = isNumber(measures.hoverState) ? measures.hoverState : '__more__'
				const hoveredItem = {
					width: measures.children[id + hoveredInd].width,
					left: measures.children[id + hoveredInd].left,
				}

				const menuPosition = decideOnMenuPosition(id, measures, hoveredItem, moreContainerWidth)
				setStyle(domNodes[`${id}${MORE_CONTAINER_PREFIX}`], {
					left: menuPosition.left,
					right: menuPosition.right,
				})
				setStyle(domNodes[`${id}dropWrapper`], {
					left: menuPosition.left,
					right: menuPosition.right,
					top: menuPosition.top,
					bottom: menuPosition.bottom,
				})
			}
		}
	}

	const patchDropDownMenuItems = (id, domNodes, measures, menuItemsIdsWithMore) => {
		const { realWidths, height: menuHeight, menuItemContainerExtraPixels: extraPixels } = measures
		// go over all the items (not the more)
		let totalVisible = 0
		let lastVisibleMenuId = null
		let innerLinkElementId = null
		const menuLineHeight = measures.lineHeight
		const menuItemHeight = menuHeight - extraPixels.height
		for (let i = 0; i < menuItemsIdsWithMore.length; i++) {
			const activeWidth = realWidths[i]
			const isVisible = activeWidth > 0
			const menuIndexOrMoreBecauseOfLegacyImplementation = menuItemsIdsWithMore[i]
			const menuId = id + menuIndexOrMoreBecauseOfLegacyImplementation
			innerLinkElementId = measures.linkIds[menuId]
			if (isVisible) {
				totalVisible++
				lastVisibleMenuId = menuId
				setStyle(domNodes[menuId], {
					width: `${activeWidth}px`,
					height: `${menuItemHeight}px`,
					position: 'relative',
					'box-sizing': 'border-box',
					overflow: 'visible',
					visibility: 'inherit',
				})
				setStyle(domNodes[`${menuId}label`], {
					'line-height': menuLineHeight,
				})
				setAttributes(domNodes[menuId], {
					'aria-hidden': false,
				})
			} else {
				setStyle(domNodes[menuId], {
					height: '0px',
					overflow: 'hidden',
					position: 'absolute',
					visibility: 'hidden',
				})
				setAttributes(domNodes[menuId], {
					'aria-hidden': true,
				})
				setAttributes(domNodes[innerLinkElementId], {
					tabIndex: -1,
				})
			}
		}
		if (totalVisible === 1) {
			setData(domNodes[`${id}moreContainer`], {
				listposition: 'lonely',
			})
			setData(domNodes[lastVisibleMenuId], {
				listposition: 'lonely',
			})
		}
	}

	const patch = (id, measures, domNodes) => {
		const menuRoot = domNodes[id]

		setStyle(menuRoot, { overflowX: 'visible' })
		// measure widths to find out if there should be "more" and what would be the real widths
		// based on the comp properties
		const { menuItemIds, needToOpenMenuUp } = measures
		const menuItemsIdsWithMore = menuItemIds.concat(MORE_BUTTON_SUFFIX)
		setDropModeData(menuRoot, needToOpenMenuUp)
		let maxLabelWidth = 0

		if (measures.hoverState === MORE_BUTTON_SUFFIX) {
			// when hover more button - we render all item and hide the ones that already appear on the menu
			const firstIndexThatIsHidden = measures.realWidths.indexOf(0)
			const firstItemShownInMore =
				measures.menuItems[findKey(measures.menuItems, (value) => value.menuIndex === firstIndexThatIsHidden)]
			const indexOfFirstItemShownInMore = firstItemShownInMore.moreIndex

			const hasOneItem = indexOfFirstItemShownInMore === menuItemIds.length - 1
			if (firstItemShownInMore.moreDOMid) {
				setAttributes(domNodes[firstItemShownInMore.moreDOMid], {
					'data-listposition': hasOneItem ? 'dropLonely' : 'top',
				})
			}

			Object.values(measures.menuItems)
				.filter((menuItem) => !!menuItem.moreDOMid)
				.forEach((item) => {
					if (item.moreIndex < indexOfFirstItemShownInMore) {
						setStyle(domNodes[item.moreDOMid], { display: 'none' })
					} else {
						const moreItemLabelId = `${item.moreDOMid}label`
						maxLabelWidth = Math.max(measures.labels[moreItemLabelId].width, maxLabelWidth)
					}
				})
		} else if (measures.hoverState) {
			measures.moreSubItem.forEach((v, i) => {
				const subItemLabelId = `${id + MORE_CONTAINER_PREFIX + i}label`
				maxLabelWidth = Math.max(measures.labels[subItemLabelId].width, maxLabelWidth)
			})
		}
		updateDropDownContainerLocation(id, measures, domNodes, maxLabelWidth)

		if (measures.originalGapBetweenTextAndBtn) {
			menuItemsIdsWithMore.forEach((item) => {
				if (!measures.hasOriginalGapData[item]) {
					setData(domNodes[`${id}${item}`], {
						originalGapBetweenTextAndBtn: measures.originalGapBetweenTextAndBtn[`${id}${item}`],
					})
				}
			})
		}
		patchDropDownMenuItems(id, domNodes, measures, menuItemsIdsWithMore)
	}

	return {
		measure,
		patch,
	}
}

export { init }
