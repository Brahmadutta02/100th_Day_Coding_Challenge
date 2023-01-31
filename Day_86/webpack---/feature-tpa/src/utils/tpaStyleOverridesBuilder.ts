import _ from 'lodash'
import { TpaPopupOrigin, TpaPopupPlacement, TpaStyleOverrides } from '../types'
import { isSSR } from '@wix/thunderbolt-commons'
import type { TpaCompStyleOptions } from '@wix/thunderbolt-symbols'

const MIN_EDGE_SIZE = 10

export type OriginalCompStyle = {
	width: number
	height: number
	left: number
	top: number
	actualLeft: number
	actualTop: number
}

const numberOrNaN = (x: any) => (_.isNumber(x) ? x : NaN)

const parseUnit = (x: string | number) => _.parseInt((x || '').toString().split('px')[0])

export const parseCssSize = (requestedSize: string | number): { unit: string; size: number } => {
	const getUnit = (reqSize: string) => {
		const matches = /(%)$/.exec(reqSize)
		return matches && matches[1] ? matches[1] : ''
	}
	const getValue = (reqSize: string): number => {
		const matches = /^([0-9]+)/.exec(reqSize)
		return matches && matches[1] ? parseInt(matches[1], 10) : 0
	}

	const cssSize = {
		size: 0,
		unit: '',
	}

	if (_.isNumber(requestedSize)) {
		cssSize.size = requestedSize
	} else if (_.isString(requestedSize)) {
		cssSize.unit = getUnit(requestedSize)
		cssSize.size = getValue(requestedSize)
	}

	return cssSize
}

const computeFixedPositionStyle = (
	position: TpaCompStyleOptions['position'],
	windowSize: { height: number; width: number },
	popupSize: Pick<TpaCompStyleOptions, 'width' | 'height'>
): TpaStyleOverrides => {
	const style: TpaStyleOverrides = {
		position: 'fixed',
		display: 'block',
		width: popupSize.width,
		height: popupSize.height,
	}

	const height = parseCssSize(popupSize.height)
	if (height.unit === '%') {
		height.size = _.min([height.size, 100]) as number
	} else if (height.size > windowSize.height) {
		height.unit = '%'
		height.size = 100
	}

	const width = parseCssSize(popupSize.width)
	width.size = (width.unit === '%' ? _.min([width.size, 100]) : _.min([width.size, windowSize.width])) as number

	const placementBasedUpdates: Record<keyof TpaPopupPlacement, () => Partial<TpaStyleOverrides>> = {
		CENTER: () => ({
			marginLeft: width.size / -2 + (width.unit || 'px'),
			marginTop: height.unit === '%' ? 0 : height.size / -2 + (height.unit || 'px'),
			left: '50%',
			top: height.unit === '%' ? 0 : '50%',
		}),
		TOP_LEFT: () => ({ left: '0px', top: '0px' }),
		TOP_RIGHT: () => ({ right: '0px', top: '0px' }),
		TOP_CENTER: () => ({
			marginLeft: width.size / -2 + (width.unit || 'px'),
			top: '0px',
			left: '50%',
		}),
		CENTER_RIGHT: () => ({
			marginTop: height.unit === '%' ? 0 : height.size / -2 + (height.unit || 'px'),
			top: height.unit === '%' ? 0 : '50%',
			right: '0px',
		}),
		CENTER_LEFT: () => ({
			marginTop: height.unit === '%' ? 0 : height.size / -2 + (height.unit || 'px'),
			top: height.unit === '%' ? 0 : '50%',
			left: '0px',
		}),
		BOTTOM_LEFT: () => ({
			bottom: '0px',
			left: '0px',
		}),
		BOTTOM_RIGHT: () => ({
			bottom: '0px',
			right: '0px',
		}),
		BOTTOM_CENTER: () => ({
			marginLeft: width.size / -2 + (width.unit || 'px'),
			left: '50%',
			bottom: '0px',
		}),
	}

	style.width = width.size + (width.unit || 'px')
	style.height = height.size + (height.unit || 'px')

	return { ...style, ...placementBasedUpdates[position.placement]() }
}

const computeRelativePositionStyle = (
	position: TpaCompStyleOptions['position'],
	originalCompStyle: OriginalCompStyle,
	windowSize: { width: number; height: number },
	popupSize: Pick<TpaCompStyleOptions, 'width' | 'height'>
): TpaStyleOverrides => {
	const style: TpaStyleOverrides = {
		position: 'absolute',
		display: 'block',
		width: 0,
		height: 0,
	}

	const getRelativeCenterLeft = function (originalCompLeft: number, originalCompWidth: number, popupWidth: number) {
		return originalCompLeft + originalCompWidth / 2 - popupWidth / 2
	}

	const getRelativeBottomHeight = function (
		windowHeight: number,
		originalCompTop: number,
		originalCompHeight: number
	) {
		return windowHeight - (originalCompTop + originalCompHeight)
	}

	const getRelativeRightWidth = function (windowWidth: number, originalCompWidth: number, originalCompLeft: number) {
		return windowWidth - (originalCompWidth + originalCompLeft)
	}

	const getRelativeCenterTop = function (originalCompTop: number, originalCompHeight: number, popupHeight: number) {
		return originalCompTop + originalCompHeight / 2 - popupHeight / 2
	}

	// NaN qualifies as a number but when using min/max it will not be picked
	const height = numberOrNaN(popupSize.height)
	const width = numberOrNaN(popupSize.width)

	const placementBasedUpdates: Record<keyof TpaPopupPlacement, () => Partial<TpaStyleOverrides>> = {
		CENTER: () => ({
			height: _.min([height, windowSize.height]),
			width: _.min([width, windowSize.width]),
			top: getRelativeCenterTop(originalCompStyle.top, originalCompStyle.height, height),
			left: getRelativeCenterLeft(originalCompStyle.left, originalCompStyle.width, width),
		}),
		TOP_LEFT: () => ({
			height: _.min([height, originalCompStyle.top]),
			width: _.min([width, originalCompStyle.left]),
			top: originalCompStyle.top - height,
			left: originalCompStyle.left - width,
		}),
		TOP_RIGHT: () => ({
			height: _.min([height, originalCompStyle.top]),
			width: _.min([
				width,
				getRelativeRightWidth(windowSize.width, originalCompStyle.width, originalCompStyle.left),
			]),
			top: originalCompStyle.top - height,
			left: originalCompStyle.width + originalCompStyle.left,
		}),
		TOP_CENTER: () => ({
			height: _.min([height, originalCompStyle.top]),
			width: _.min([width, windowSize.width]),
			top: originalCompStyle.top - height,
			left: getRelativeCenterLeft(originalCompStyle.left, originalCompStyle.width, width),
		}),
		CENTER_RIGHT: () => ({
			height: _.min([height, windowSize.height]),
			width: _.min([
				width,
				getRelativeRightWidth(windowSize.width, originalCompStyle.width, originalCompStyle.left),
			]),
			top: getRelativeCenterTop(originalCompStyle.top, originalCompStyle.height, height),
			left: originalCompStyle.width + originalCompStyle.left,
		}),
		CENTER_LEFT: () => ({
			height: _.min([height, windowSize.height]),
			width: _.min([width, originalCompStyle.left]),
			top: getRelativeCenterTop(originalCompStyle.top, originalCompStyle.height, height),
			left: originalCompStyle.left - width,
		}),
		BOTTOM_LEFT: () => ({
			height: _.min([
				height,
				getRelativeBottomHeight(windowSize.height, originalCompStyle.top, originalCompStyle.height),
			]),
			width: _.min([width, originalCompStyle.left]),
			top: originalCompStyle.top + originalCompStyle.height,
			left: originalCompStyle.left - width,
		}),
		BOTTOM_RIGHT: () => ({
			height: _.min([
				height,
				getRelativeBottomHeight(windowSize.height, originalCompStyle.top, originalCompStyle.height),
			]),
			width: _.min([
				width,
				getRelativeRightWidth(windowSize.width, originalCompStyle.width, originalCompStyle.left),
			]),
			top: originalCompStyle.top + originalCompStyle.height,
			left: originalCompStyle.width + originalCompStyle.left,
		}),
		BOTTOM_CENTER: () => ({
			height: _.min([
				height,
				getRelativeBottomHeight(windowSize.height, originalCompStyle.top, originalCompStyle.height),
			]),
			width: _.min([width, windowSize.width]),
			top: originalCompStyle.top + originalCompStyle.height,
			left: getRelativeCenterLeft(originalCompStyle.left, originalCompStyle.width, width),
		}),
	}

	const updates = placementBasedUpdates[position.placement]()

	const top = _.max([0, updates.top])
	const left = _.max([0, updates.left])

	return { ...style, ...updates, top, left }
}

const computeAbsolutePositionStyle = (
	position: TpaCompStyleOptions['position'],
	originalCompStyle: OriginalCompStyle,
	windowSize: { width: number; height: number },
	popupSize: Pick<TpaCompStyleOptions, 'width' | 'height'>
): TpaStyleOverrides => {
	const style: TpaStyleOverrides = {
		position: 'absolute',
		display: 'block',
		width: 0,
		height: 0,
	}

	// NaN qualifies as a number but when using min/max it will not be picked
	const height = numberOrNaN(popupSize.height)
	const width = numberOrNaN(popupSize.width)

	const placementBasedUpdates: Record<keyof TpaPopupPlacement, () => Partial<TpaStyleOverrides>> = {
		CENTER: () => {
			const smallestHeight = _.min([
				originalCompStyle.actualTop + position.y,
				windowSize.height - (originalCompStyle.actualTop + position.y),
			]) as number
			const smallestWidth = _.min([
				originalCompStyle.actualLeft + position.x,
				windowSize.width - (originalCompStyle.actualLeft + position.x),
			]) as number
			return {
				height: _.min([height, 2 * smallestHeight]),
				width: _.min([width, 2 * smallestWidth]),
				top: originalCompStyle.top + position.y - height / 2,
				left: originalCompStyle.left + position.x - width / 2,
			}
		},
		TOP_LEFT: () => ({
			height: _.min([height, originalCompStyle.actualTop + position.y]),
			width: _.min([width, originalCompStyle.actualLeft + position.x]),
			top: originalCompStyle.top + position.y - height,
			left: originalCompStyle.left + position.x - width,
		}),
		TOP_RIGHT: () => ({
			height: _.min([height, originalCompStyle.actualTop + position.y]),
			width: _.min([width, windowSize.width - (originalCompStyle.actualLeft + position.x)]),
			top: originalCompStyle.top + position.y - height,
			left: originalCompStyle.left + position.x,
		}),
		TOP_CENTER: () => {
			const smallestWidth = _.min([
				originalCompStyle.actualLeft + position.x,
				windowSize.width - (originalCompStyle.actualLeft + position.x),
			]) as number
			return {
				height: _.min([height, originalCompStyle.actualTop + position.y]),
				width: _.min([width, 2 * smallestWidth]),
				top: originalCompStyle.top + position.y - height,
				left: originalCompStyle.left + position.x - width / 2,
			}
		},
		CENTER_RIGHT: () => {
			const smallestHeight = _.min([
				originalCompStyle.actualTop + position.y,
				windowSize.height - (originalCompStyle.actualTop + position.y),
			]) as number
			return {
				height: _.min([height, 2 * smallestHeight]),
				width: _.min([width, windowSize.width - (originalCompStyle.actualLeft + position.x)]),
				top: originalCompStyle.top + position.y - height / 2,
				left: originalCompStyle.left + position.x,
			}
		},
		CENTER_LEFT: () => {
			const smallestHeight = _.min([
				originalCompStyle.actualTop + position.y,
				windowSize.height - (originalCompStyle.actualTop + position.y),
			]) as number
			return {
				height: _.min([height, 2 * smallestHeight]),
				width: _.min([width, originalCompStyle.actualLeft + position.x]),
				top: originalCompStyle.top + position.y - height / 2,
				left: originalCompStyle.left + position.x - width,
			}
		},
		BOTTOM_LEFT: () => ({
			height: _.min([height, windowSize.height - position.y]),
			width: _.min([width, originalCompStyle.actualLeft + position.x]),
			top: originalCompStyle.top + position.y,
			left: originalCompStyle.left + position.x - width,
		}),
		BOTTOM_RIGHT: () => ({
			height: _.min([height, windowSize.height - (originalCompStyle.actualTop + position.y)]),
			width: _.min([width, windowSize.width - (originalCompStyle.actualLeft + position.x)]),
			top: originalCompStyle.top + position.y,
			left: originalCompStyle.left + position.x,
		}),
		BOTTOM_CENTER: () => {
			const smallestWidth = _.min([
				originalCompStyle.actualLeft + position.x,
				windowSize.width - (originalCompStyle.actualLeft + position.x),
			]) as number
			return {
				height: _.min([height, windowSize.height - (originalCompStyle.actualTop + position.y)]),
				width: _.min([width, 2 * smallestWidth]),
				top: originalCompStyle.top + position.y,
				left: originalCompStyle.left + position.x - width / 2,
			}
		},
	}

	const updates = placementBasedUpdates[position.placement]()
	const top = _.max([0, updates.top])
	const left = _.max([0, updates.left])

	return { ...style, ...updates, top, left }
}

const fallbackToCenterIfNeeded = (
	style: TpaStyleOverrides,
	windowSize: { height: number; width: number },
	popupSize: Pick<TpaCompStyleOptions, 'height' | 'width'>
): TpaStyleOverrides => {
	if (parseUnit(style.width) < MIN_EDGE_SIZE || parseUnit(style.height) < MIN_EDGE_SIZE) {
		// fallback to center
		const cssHeight = parseCssSize(popupSize.height)
		cssHeight.size = (cssHeight.unit === '%'
			? _.min([cssHeight.size, 100])
			: _.min([cssHeight.size, windowSize.height])) as number

		const cssWidth = parseCssSize(popupSize.width)
		cssWidth.size = (cssWidth.unit === '%'
			? _.min([cssWidth.size, 100])
			: _.min([cssWidth.size, windowSize.height])) as number

		return {
			position: 'fixed',
			display: 'block',
			width: `${cssWidth.size}${cssWidth.unit || 'px'}`,
			height: `${cssHeight.size}${cssHeight.unit || 'px'}`,
			marginLeft: `${cssWidth.size / -2}${cssWidth.unit || 'px'}`,
			marginTop: `${cssHeight.size / -2}${cssHeight.unit || 'px'}`,
			left: '50%',
			top: '50%',
		}
	} else {
		return style
	}
}

export const isFullScreen = ({ width, height }: any, window: Window): boolean => {
	return height === '100%' && (width === '100%' || Number(parseUnit(width)) >= window.innerWidth)
}

const getElementOffsets = (node: HTMLElement | null) => {
	let left = 0
	let top = 0
	if (node && node.offsetParent) {
		let obj = node
		do {
			left += obj.offsetLeft
			top += obj.offsetTop
			// eslint-disable-next-line no-cond-assign
		} while ((obj = obj.offsetParent as HTMLElement))
	}
	return { top, left }
}

export const computeTpaPopupStyleOverrides = (
	options: TpaCompStyleOptions,
	window: Window,
	compId: string
): TpaStyleOverrides => {
	const node = isSSR(window) ? null : window.document.getElementById(compId)
	const bounds = node ? node.getBoundingClientRect() : null

	const offsets = getElementOffsets(node)
	const originalCompStyle: OriginalCompStyle = {
		left: offsets.left,
		top: offsets.top,
		width: bounds ? Math.round(bounds.width) : 0,
		height: bounds ? Math.round(bounds.height) : 0,
		actualTop: bounds ? bounds.top : 0,
		actualLeft: bounds ? bounds.left : 0,
	}

	const position = _.defaults(options.position, { x: 0, y: 0, origin: 'FIXED', placement: 'CENTER' })
	const popupSize = _.pick(options, 'height', 'width')

	const windowSize = {
		width: isSSR(window) ? 0 : window.innerWidth,
		height: isSSR(window) ? 0 : window.innerHeight,
	}

	const styleBuilders: Record<keyof TpaPopupOrigin, () => TpaStyleOverrides> = {
		RELATIVE: () => computeRelativePositionStyle(position, originalCompStyle, windowSize, popupSize),
		ABSOLUTE: () => computeAbsolutePositionStyle(position, originalCompStyle, windowSize, popupSize),
		FIXED: () => computeFixedPositionStyle(position, windowSize, popupSize),
	}

	return fallbackToCenterIfNeeded(styleBuilders[position.origin](), windowSize, popupSize)
}
