import * as _ from 'lodash'
import type { ComponentLayoutRetriever, Direction, DockedCompLayout } from './types/dockedLayer'

export const bottom: ComponentLayoutRetriever = (comp) => comp.top + comp.height
export const height: ComponentLayoutRetriever = (comp) => comp.height

const isDocked = (layout: DockedCompLayout) => !_.isEmpty(layout.docked)

const getDockMargin = (direction: Direction, layout: DockedCompLayout) => {
	const margin = _.get(layout, ['docked', direction, 'px'], 0)
	return margin === 0 ? {} : { [`margin-${direction}`]: px(margin) }
}
const px = (units: number) => `${units}px`

const pct = (units: number, compSize: number) => `calc(${units}% - ${compSize}px)` // compensate component width/height

const CENTER_MARGIN_PROPERTY = {
	hCenter: {
		POSITIVE: 'margin-left',
		NEGATIVE: 'margin-right',
	},
	vCenter: {
		POSITIVE: 'margin-top',
		NEGATIVE: 'margin-bottom',
	},
}

const getCenterMargin = (direction: 'hCenter' | 'vCenter', layout: DockedCompLayout) => {
	const margin = _.get(layout, ['docked', direction, 'px']) || _.get(layout, ['docked', direction, 'pct']) || 0
	const isPx = !!_.get(layout, ['docked', direction, 'px'])
	const compSize = direction === 'hCenter' ? layout.width : layout.height

	if (margin === 0) {
		return {}
	}

	if (margin > 0) {
		return { [CENTER_MARGIN_PROPERTY[direction].POSITIVE]: isPx ? px(2 * margin) : pct(margin, compSize) }
	}

	return { [CENTER_MARGIN_PROPERTY[direction].NEGATIVE]: isPx ? px(-2 * margin) : pct(-margin, compSize) }
}

const getHorizontalDockingType = (layout: DockedCompLayout) => {
	if (layout.docked.left && layout.docked.right) {
		return 'hStretch'
	}
	if (layout.docked.hCenter) {
		return 'hCenter'
	}
	if (layout.docked.left) {
		return 'left'
	}
	if (layout.docked.right) {
		return 'right'
	}

	return 'none'
}

const getVerticalDockingType = (layout: DockedCompLayout) => {
	if (layout.docked.bottom && layout.docked.top) {
		return 'vStretch'
	}
	if (layout.docked.vCenter) {
		return 'vCenter'
	}
	if (layout.docked.top) {
		return 'top'
	}
	if (layout.docked.bottom) {
		return 'bottom'
	}

	return 'none'
}

const hDockStyleMapForGrid = (ie: boolean) => {
	const justifySelf = ie ? '-ms-grid-column-align' : 'justify-self'
	return {
		left: { [justifySelf]: 'start' },
		right: { [justifySelf]: 'end' },
		hCenter: { [justifySelf]: 'center' },
		hStretch: { width: '100%' },
		none: {},
	}
}

const vDockStyleMapForGrid = (ie: boolean) => {
	const alignSelf = ie ? '-ms-grid-row-align' : 'align-self'
	return {
		top: { [alignSelf]: 'start' },
		bottom: { [alignSelf]: 'end' },
		vCenter: { [alignSelf]: 'center' },
		vStretch: { height: '100%' },
		none: {},
	}
}

const hDockStyleMapForFixedPosition = {
	left: { left: 0 },
	right: { right: 0 },
	hCenter: { left: '50%', transform: 'translateX(-50%)' },
	hStretch: { left: 0, width: '100%' },
	none: {},
}

const vDockStyleMapForFixedPosition = (topOffset: number) => ({
	top: { top: `${topOffset}px` },
	bottom: { bottom: 0 },
	vCenter: { top: `calc(50% + ${topOffset / 2}px)`, transform: 'translateY(-50%)' },
	vStretch: { top: 0, height: '100%' },
	none: {},
})

const marginStyleMap = {
	left: _.partial(getDockMargin, 'left'),
	right: _.partial(getDockMargin, 'right'),
	hCenter: _.partial(getCenterMargin, 'hCenter'),
	hStretch: _.noop,
	top: _.partial(getDockMargin, 'top'),
	bottom: _.partial(getDockMargin, 'bottom'),
	vCenter: _.partial(getCenterMargin, 'vCenter'),
	vStretch: _.noop,
	none: _.noop,
}

const getHorizontallyDockedStyles = (layout: DockedCompLayout, isGrid: boolean, ie: boolean) => {
	const dockType = getHorizontalDockingType(layout)
	const dockStyle = isGrid ? hDockStyleMapForGrid(ie)[dockType] : hDockStyleMapForFixedPosition[dockType]
	const marginStyle = marginStyleMap[dockType](layout)

	return _.assign({}, dockStyle, marginStyle)
}

const getVerticallyDockedStyles = (layout: DockedCompLayout, topOffset: number, isGrid: boolean, ie: boolean) => {
	const dockType = getVerticalDockingType(layout)
	const dockStyle = isGrid ? vDockStyleMapForGrid(ie)[dockType] : vDockStyleMapForFixedPosition(topOffset)[dockType]
	const marginStyle = marginStyleMap[dockType](layout)

	return _.assign({}, dockStyle, marginStyle)
}

const getDockedStyleForGrid = (layout: DockedCompLayout, ie: boolean) => {
	if (isDocked(layout)) {
		return _.assign(
			{},
			getHorizontallyDockedStyles(layout, true, ie),
			getVerticallyDockedStyles(layout, 0, true, ie)
		)
	}
	return {}
}

const getGridArea = (ie: boolean) =>
	ie
		? {
				'-ms-grid-column': '1',
				'-ms-grid-column-span': '1',
				'-ms-grid-row': '1',
				'-ms-grid-row-span': '1',
		  }
		: { gridArea: [1, 1, 2, 2].join(' / ') }

export const getDockedStyles = (
	dockedCompLayouts: Array<DockedCompLayout>,
	ie: boolean,
	shouldGrowToContent: boolean
): { [compId: string]: Record<string, string> } => {
	const defaultPinnedStyle = {
		position: shouldGrowToContent ? 'relative' : 'absolute',
		...getGridArea(ie),
		pointerEvents: 'auto',
	}
	return _.reduce(
		dockedCompLayouts,
		(styleMap: Record<string, any>, compLayout: DockedCompLayout) => {
			const childStyle = getDockedStyleForGrid(compLayout, ie)
			styleMap[compLayout.id] = _.assign(childStyle, defaultPinnedStyle)
			return styleMap
		},
		{}
	)
}
