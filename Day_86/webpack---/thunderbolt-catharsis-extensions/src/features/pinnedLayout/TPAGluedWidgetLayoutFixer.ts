import { AbsoluteLayout, Component, TPAGluedWidgetProperties } from '@wix/thunderbolt-becky-types'
import { assign } from 'lodash'

const bottomRight = (horizontalMargin: number, verticalMargin: number) => ({
	docked: {
		bottom: { pct: verticalMargin },
		right: { pct: horizontalMargin },
	},
})

const bottomLeft = (horizontalMargin: number, verticalMargin: number) => ({
	docked: {
		bottom: { pct: verticalMargin },
		left: { pct: horizontalMargin },
	},
})

const topLeft = (horizontalMargin: number, verticalMargin: number) => ({
	docked: {
		top: { pct: verticalMargin },
		left: { pct: horizontalMargin },
	},
})
const topRight = (horizontalMargin: number, verticalMargin: number) => ({
	docked: {
		top: { pct: verticalMargin },
		right: { pct: horizontalMargin },
	},
})
const topCenter = (horizontalMargin: number, verticalMargin: number) => ({
	docked: {
		top: { pct: verticalMargin },
		hCenter: { pct: horizontalMargin },
	},
})
const centerRight = (horizontalMargin: number, verticalMargin: number) => ({
	docked: {
		right: { pct: horizontalMargin },
		vCenter: { pct: verticalMargin },
	},
})
const centerLeft = (horizontalMargin: number, verticalMargin: number) => ({
	docked: {
		left: { pct: horizontalMargin },
		vCenter: { pct: verticalMargin },
	},
})
const bottomCenter = (horizontalMargin: number, verticalMargin: number) => ({
	docked: {
		bottom: { pct: verticalMargin },
		hCenter: { pct: horizontalMargin },
	},
})
const defaultDock = {
	docked: {
		bottom: { pct: 0 },
		hCenter: { pct: 0 },
	},
}

const getValidMarginOrDefault = (margin: number) => {
	const validMargin = margin > 2 || margin < -2 ? 0 : margin
	return validMargin * 50 // multiply 50 because value 2 is 100% of screen width, so 2 * 50 = 100
}

const placementToDock: { [placement: string]: Function } = {
	BOTTOM_RIGHT: bottomRight,
	BOTTOM_LEFT: bottomLeft,
	TOP_LEFT: topLeft,
	TOP_RIGHT: topRight,
	TOP_CENTER: topCenter,
	CENTER_RIGHT: centerRight,
	CENTER_LEFT: centerLeft,
	BOTTOM_CENTER: bottomCenter,
}

export const fixTPAGluedWidgetLayout = (
	compLayout: Component['layout'],
	compProps: TPAGluedWidgetProperties
): AbsoluteLayout => {
	const placement = compProps.placement
	const horizontalMargin = getValidMarginOrDefault(parseFloat(compProps.horizontalMargin))
	const verticalMargin = getValidMarginOrDefault(parseFloat(compProps.verticalMargin))

	const dock = placementToDock[placement] ? placementToDock[placement](horizontalMargin, verticalMargin) : defaultDock

	return assign({}, compLayout, dock, { fixedPosition: true })
}
