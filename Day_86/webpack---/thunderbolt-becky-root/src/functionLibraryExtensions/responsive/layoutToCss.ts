import {
	forEach,
	map,
	pickBy,
	reduce,
	assign,
	isNumber,
	mapKeys,
	merge,
	kebabCase,
	defaults,
	omitBy,
	get,
	isObject,
} from 'lodash'

import {
	Size,
	UnitSize,
	KeywordSize,
	MinMaxSize,
	ComponentLayout,
	AspectRatioSize,
	Calculation,
	Margins,
	Padding,
	LayoutDataItems,
	GridContainerLayout,
	GridItemLayout,
	ItemLayouts,
	ContainerLayouts,
	GridItemLayouts,
	FlexContainerLayouts,
	FlexItemLayouts,
	SingleLayoutData,
	TypeMapping,
	ScrollSnap,
	ScrollBehaviour,
	ScrollSnapAlign,
	Repeat,
	RefableAlignment,
	Refable,
	VariableReference,
	RefableNumber,
	RefableJustifyContent,
} from '@wix/thunderbolt-becky-types'
import { AdditionalLayoutProperties, CssObject, SelectorToCssMap } from '../../types/layout'
import {
	flexAlignmentToString,
	gridAlignmentToString,
	unitSizeToString,
	numberToString,
	flexJustifyContentToString,
} from './layoutValuesToCss'
import { variableNameGetters } from './variablesToCss'

export const isUnitSize = (u: Size): u is UnitSize =>
	u.type === 'px' ||
	u.type === 'percentage' ||
	u.type === 'vw' ||
	u.type === 'vh' ||
	u.type === 'fr' ||
	u.type === 'rem'
export const isAutoSize = (u: Size): u is KeywordSize => u.type === 'auto'
export const isKeywordSize = (u: Size): u is KeywordSize =>
	u.type === 'auto' || u.type === 'maxContent' || u.type === 'minContent'
export const isMinMaxSize = (u: Size): u is MinMaxSize => u.type === 'MinMaxSize'
export const isAspectRatio = (u: Size): u is AspectRatioSize => u.type === 'aspectRatio'

// const isCssVariableSize = (u: Size): u is Var => u.type === 'var'
export const isCalculationSize = (u: Size): u is Calculation => u.type === 'Calc'

const isRepeat = (u: Size): u is Repeat => u.type === 'Repeat'

const sizeToString = (size: Size | undefined | null): string => {
	if (!size) {
		return ''
	}

	if (isUnitSize(size)) {
		return unitSizeToString(size)
	}

	if (isKeywordSize(size)) {
		let type: string = size.type

		switch (size.type) {
			case 'maxContent':
				type = 'max-content'
				break
			case 'minContent':
				type = 'min-content'
				break
			default:
				break
		}

		return type
	}

	if (isMinMaxSize(size)) {
		return `minmax(${sizeToString(size.min)},${sizeToString(size.max)})`
	}

	if (isCalculationSize(size)) {
		return `calc(${size.value})`
	}

	if (isRepeat(size)) {
		return `repeat(${size.length}, ${size.value.map(sizeToString).join(' ')})`
	}

	if (size.type === 'VariableReference') {
		return `var(${variableNameGetters.unitSize.get(size.variableId.replace('#', ''))})`
	}

	throw new Error(`error parsing size: ${JSON.stringify(size)}`)
}

export const layoutSelectorItem = 'item'
export const layoutSelectorOneCellGrid = 'component-one-cell-grid'
export const layoutSelectorContainer = 'container'
export const layoutSelectorOverflowWrapper = 'overflow-wrapper'
export const layoutSelectorComponent = 'component'

// This is here in order to make sure every converter returns only after passing through any of the setForX functions below (otherwise it won't work)
interface Hack {
	___notaRealFields___: boolean
}
type TargetedCss = Hack & SelectorToCssMap

const setPrefix = (prefix: string) => (object: SelectorToCssMap) =>
	mapKeys(object, (value, key) => `${prefix}${key}`) as TargetedCss
const setForOverflowWrapper = setPrefix(layoutSelectorOverflowWrapper)
const setForContainer = setPrefix(layoutSelectorContainer)
const setForOneCellGrid = setPrefix(layoutSelectorOneCellGrid)
const setForItem = setPrefix(layoutSelectorItem)
const setForComponent = setPrefix(layoutSelectorComponent)
const mergeStyles = merge as (...args: Array<TargetedCss>) => TargetedCss

const addKeyPrefixForCssObject = (keyPrefix: string) => (cssObject: Partial<Margins | Padding>): CssObject => {
	const keys = Object.keys(cssObject) as Array<keyof Margins | keyof Padding>

	return keys.reduce((result, key) => {
		result[`${keyPrefix}${key}`] = sizeToString(cssObject[key])
		return result
	}, {} as CssObject)
}

const buildMargins = addKeyPrefixForCssObject('margin-')

const buildPadding = addKeyPrefixForCssObject('padding-')

const buildScrollSnapAlign = (scrollSnapAlign: ScrollSnapAlign): CssObject => ({
	'scroll-snap-align': scrollSnapAlign,
})

const buildPosition = <T extends ItemLayouts>(
	itemLayout: T,
	renderSticky: boolean,
	newResponsiveLayout?: boolean
): CssObject => {
	if (
		// (!itemLayout.position && !itemLayout.pinnedToContainer) ||
		(itemLayout.position === 'sticky' && !renderSticky) ||
		itemLayout.position === 'relative'
	) {
		return { position: 'relative' }
	}

	if (!itemLayout.position && !itemLayout.pinnedToContainer) {
		return newResponsiveLayout ? {} : { position: 'relative' }
	}

	const emptySize = sizeToString(null)
	// TODO: add here stickyToHeader integration with DM: https://jira.wixpress.com/browse/TB-6640
	const topString =
		itemLayout.position === 'sticky' && itemLayout.top && isUnitSize(itemLayout.top) && !newResponsiveLayout
			? `calc(${sizeToString(itemLayout.top)} + var(--wix-ads-top-height))`
			: sizeToString(itemLayout.top)

	const topKey = newResponsiveLayout ? (itemLayout.position === 'sticky' ? '--sticky-top' : '--top') : 'top'
	return omitBy(
		{
			position: itemLayout.position || 'absolute',
			[topKey]: topString,
			bottom: sizeToString(itemLayout.bottom),
			left: sizeToString(itemLayout.left),
			right: sizeToString(itemLayout.right),
		},
		(value) => value === emptySize
	)
}

const createItemLayoutConverter = <T extends ItemLayouts>(specificItemLayoutConverter: (layout: T) => TargetedCss) => (
	itemLayout: T,
	{ renderSticky, renderScrollSnap, newResponsiveLayout }: AdditionalLayoutProperties
) => {
	const specificStyles = specificItemLayoutConverter(itemLayout)
	const baseStyles = setForItem({
		'': Object.assign(
			buildPosition(itemLayout, renderSticky, newResponsiveLayout),
			itemLayout.scrollSnapAlign && renderScrollSnap ? buildScrollSnapAlign(itemLayout.scrollSnapAlign) : {},
			itemLayout.margins ? buildMargins(itemLayout.margins) : {}
		),
	})
	return mergeStyles(baseStyles, specificStyles)
}

const buildScrollStyles = (scrollSnap: ScrollSnap, scrollBehaviour?: ScrollBehaviour): CssObject => ({
	'scroll-snap-type':
		scrollSnap.scrollSnapType === 'none'
			? scrollSnap.scrollSnapType
			: `${scrollSnap.scrollSnapDirection || ''}${
					scrollSnap.scrollSnapType ? ` ${scrollSnap.scrollSnapType}` : ''
			  }`.trim(),
	'-webkit-scroll-snap-type': scrollSnap.scrollSnapType as string,
	'scroll-behavior': scrollBehaviour ? scrollBehaviour : 'auto',
})

const getOverflowStyles = <T extends ContainerLayouts>(containerLayout: T, renderScrollSnap: boolean) => {
	const overflowStyles = assign(
		{},
		containerLayout.overflowX && {
			'overflow-x': containerLayout.overflowX,
		},
		containerLayout.overflowY && {
			'overflow-y': containerLayout.overflowY,
		}
	)
	const scrollSnapStyles =
		containerLayout.scrollSnap && containerLayout.scrollSnap.scrollSnapType && renderScrollSnap
			? buildScrollStyles(containerLayout.scrollSnap, containerLayout.scrollBehaviour)
			: {}

	const hideScrollbarStyles = containerLayout.hideScrollbar
		? {
				'': {
					'scrollbar-width': 'none',
					overflow: '-moz-scrollbars-none',
					'-ms-overflow-style': 'none',
				},
				'::-webkit-scrollbar': {
					width: '0',
					height: '0',
				},
		  }
		: {}

	return merge(
		{
			'': assign(overflowStyles, scrollSnapStyles),
		},
		hideScrollbarStyles
	) as SelectorToCssMap
}

const createContainerLayoutConverter = <T extends ContainerLayouts>(
	specificItemLayoutConverter: (layout: T) => TargetedCss
) => (containerLayout: T, { hasOverflow, renderScrollSnap }: AdditionalLayoutProperties) => {
	const specificStyles = specificItemLayoutConverter(containerLayout)

	const oneCellGrid = {
		'': {
			display: 'grid',
			'grid-template-rows': '1fr',
			'grid-template-columns': 'minmax(0, 1fr)',
		},
	}

	const padding = {
		'': assign(
			{
				'box-sizing': 'border-box',
			},
			containerLayout.padding ? buildPadding(containerLayout.padding) : {}
		),
	}

	const gaps: CssObject = {}

	if (containerLayout.rowGap) {
		gaps['row-gap'] = sizeToString(containerLayout.rowGap)
	}

	if (containerLayout.columnGap) {
		gaps['column-gap'] = sizeToString(containerLayout.columnGap)
	}

	const baseStyles = mergeStyles(
		setForContainer(padding),
		setForContainer({ '': gaps }),
		setForOneCellGrid(oneCellGrid)
	)

	const overflowStyles = hasOverflow
		? mergeStyles(
				setForOverflowWrapper(oneCellGrid),
				setForOverflowWrapper(getOverflowStyles(containerLayout, renderScrollSnap))
		  )
		: ({} as TargetedCss)

	return mergeStyles(baseStyles, specificStyles, overflowStyles)
}

const isVariableRef = <T>(val: Refable<T>): val is VariableReference => {
	return isObject(val) && val.type === 'VariableReference'
}

const getGridAlignment = (alignment: RefableAlignment) => {
	if (isVariableRef(alignment)) {
		return `var(${variableNameGetters.alignment.getForGrid(alignment.variableId.replace('#', ''))})`
	} else {
		return gridAlignmentToString(alignment)
	}
}

const getFlexAlignment = (alignment: RefableAlignment) => {
	if (isVariableRef(alignment)) {
		return `var(${variableNameGetters.alignment.getForFlex(alignment.variableId.replace('#', ''))})`
	} else {
		return flexAlignmentToString(alignment)
	}
}

const getFlexJustifyContent = (justifyContent: RefableJustifyContent) => {
	if (isVariableRef(justifyContent)) {
		return `var(${variableNameGetters.justifyContent.get(justifyContent.variableId.replace('#', ''))})`
	} else {
		return flexJustifyContentToString(justifyContent)
	}
}

const parseBaseGridItem = <T extends GridItemLayouts>(specificItemLayoutConverter: (layout: T) => TargetedCss) => (
	itemLayout: T,
	additionalLayoutProperties: AdditionalLayoutProperties
) => {
	const baseStyles = createItemLayoutConverter(specificItemLayoutConverter)(itemLayout, additionalLayoutProperties)
	const additionalStyles: CssObject = {}

	if (itemLayout.alignSelf) {
		additionalStyles['align-self'] = getGridAlignment(itemLayout.alignSelf)
	}

	if (itemLayout.justifySelf) {
		additionalStyles['justify-self'] = getGridAlignment(itemLayout.justifySelf)
	}

	return mergeStyles(setForItem({ '': additionalStyles }), baseStyles)
}

const parseFixedItem = parseBaseGridItem(() =>
	setForItem({
		'': {
			'grid-area': '1/1/2/2',
			'pointer-events': 'auto',
		},
	})
)

const getGridArea = (number: RefableNumber) => {
	if (isVariableRef(number)) {
		return `var(${variableNameGetters.number.get(number.variableId.replace('#', ''))})`
	} else {
		return numberToString(number)
	}
}

/**
 * when parsing grid item we have a conflict in each axis between the size property and the position property
 * for example, width and justify - if justify is set to stretch, and we have a width, we don't know what to do
 * what will happen is we will render all properties and CSS will do its magic, in this case, the width property
 * is stronger than the justify property.
 */
const parseGridItem = parseBaseGridItem((gridItemLayout: GridItemLayout) => {
	const rootCss: CssObject = {}

	const gridArea = gridItemLayout.gridArea
	if (gridArea) {
		const gridAreaString = `${getGridArea(gridArea.rowStart)}/${getGridArea(gridArea.columnStart)}/${getGridArea(
			gridArea.rowEnd
		)}/${getGridArea(gridArea.columnEnd)}`
		rootCss['grid-area'] = gridAreaString
	}

	return setForItem({ '': rootCss })
})

const parseGridLayout = createContainerLayoutConverter((gridContainerLayout: GridContainerLayout) => {
	const rootCss: CssObject = {
		display: 'grid',
	}

	rootCss['grid-template-rows'] = gridContainerLayout.rows.map(sizeToString).join(' ')
	rootCss['grid-template-columns'] = gridContainerLayout.columns.map(sizeToString).join(' ')

	if (gridContainerLayout.autoFlow) {
		rootCss['grid-auto-flow'] = gridContainerLayout.autoFlow
	}

	if (gridContainerLayout.autoRows) {
		rootCss['grid-auto-rows'] = gridContainerLayout.autoRows.map(sizeToString).join(' ')
	}

	if (gridContainerLayout.autoColumns) {
		rootCss['grid-auto-columns'] = gridContainerLayout.autoColumns.map(sizeToString).join(' ')
	}

	return setForContainer({ '': rootCss })
})

const parseFlexContainerLayout = createContainerLayoutConverter((flexContainerLayout: FlexContainerLayouts) =>
	mergeStyles(
		setForContainer({
			'': pickBy(
				{
					display: 'flex',
					'flex-direction': kebabCase(flexContainerLayout.direction),
					'justify-content': getFlexJustifyContent(flexContainerLayout.justifyContent!),
					'align-items': getFlexAlignment(flexContainerLayout.alignItems!),
					'flex-wrap': flexContainerLayout.wrap!,
				},
				(value) => !!value
			),
		})
	)
)

const parseFlexItemLayout = createItemLayoutConverter(<T extends FlexItemLayouts>(flexItemLayout: T) => {
	const rootCss: CssObject = {}

	if (flexItemLayout.alignSelf) {
		rootCss['align-self'] = getFlexAlignment(flexItemLayout.alignSelf)
	}

	if (isNumber(flexItemLayout.order)) {
		rootCss.order = String(flexItemLayout.order)
	}

	if (flexItemLayout.basis) {
		rootCss['flex-basis'] = sizeToString(flexItemLayout.basis)
	}

	if (isNumber(flexItemLayout.grow)) {
		rootCss['flex-grow'] = flexItemLayout.grow.toString()
	}

	if (isNumber(flexItemLayout.shrink)) {
		rootCss['flex-shrink'] = flexItemLayout.shrink.toString()
	}

	return setForItem({ '': rootCss })
})

const getWidthCss = (width: ComponentLayout['width']) => (): SelectorToCssMap =>
	setForComponent({
		'': {
			width: sizeToString(width),
		},
	})

const getCompHeightCss = (height: ComponentLayout['height']): SelectorToCssMap => {
	if (!height) {
		return {}
	}

	return isAspectRatio(height)
		? {
				'': {
					height: 'auto',
				},
				'::before': {
					content: 'attr(x)',
					display: 'block',
					'padding-top': `${height.value * 100}%`,
				},
		  }
		: {
				'': {
					height: sizeToString(height as Size),
				},
		  }
}

const getNewResponsiveLayoutCompHeightCss = (height: ComponentLayout['height']): SelectorToCssMap => {
	if (!height) {
		return {}
	}

	return isAspectRatio(height)
		? { '': { height: 'auto', '--aspect-ratio': height.value } }
		: { '': { height: sizeToString(height as Size) } }
}

const getHeightCss = (
	height: ComponentLayout['height'],
	{ hasOverflow, shouldOmitWrapperLayers, newResponsiveLayout }: AdditionalLayoutProperties
) => (): SelectorToCssMap => {
	const compStyles = newResponsiveLayout ? getNewResponsiveLayoutCompHeightCss(height) : getCompHeightCss(height)

	const isOutsideIn = !!height && (isAspectRatio(height) || !isAutoSize(height))
	const overflowContainerWrapperStyles: SelectorToCssMap = isOutsideIn
		? {
				'': {
					position: 'absolute',
					top: '0',
					left: '0',
					width: '100%',
					height: '100%',
				},
		  }
		: {
				'': {
					position: 'relative',
				},
		  }

	// Add position relative to parent only if we have inline content
	const containerStyles = !shouldOmitWrapperLayers
		? {
				'': {
					position: 'relative',
				},
		  }
		: ({} as TargetedCss)

	return mergeStyles(
		setForComponent(compStyles),
		hasOverflow ? setForOverflowWrapper(overflowContainerWrapperStyles) : ({} as TargetedCss),
		setForContainer(containerStyles)
	)
}

const getMinWidthCss = (minWidth: ComponentLayout['minWidth']) => (): SelectorToCssMap =>
	setForComponent({
		'': {
			'min-width': sizeToString(minWidth),
		},
	})

const getMinHeightCss = (minHeight: ComponentLayout['minHeight']) => (): SelectorToCssMap =>
	setForComponent({
		'': {
			'min-height': sizeToString(minHeight),
		},
	})

const getMaxWidthCss = (maxWidth: ComponentLayout['maxWidth']) => (): SelectorToCssMap =>
	setForComponent({
		'': {
			'max-width': sizeToString(maxWidth),
		},
	})

const getMaxHeightCss = (maxHeight: ComponentLayout['maxHeight']) => (): SelectorToCssMap =>
	setForComponent({
		'': {
			'max-height': sizeToString(maxHeight),
		},
	})

const getRotationCss = (rotationInDegrees: ComponentLayout['rotationInDegrees']) => (): SelectorToCssMap =>
	setForComponent({
		'': {
			transform: `rotate(${rotationInDegrees}deg)`,
		},
	})

const getHiddenCss = (
	hidden: ComponentLayout['hidden'],
	{ newResponsiveLayout }: AdditionalLayoutProperties
) => (): SelectorToCssMap =>
	setForComponent(
		hidden
			? {
					'': newResponsiveLayout
						? { '--l_display': 'none' }
						: {
								display: 'none !important', // we have display:grid on containers and that leads to collision
								visibility: 'hidden',
						  },
			  }
			: newResponsiveLayout
			? { '': { '--l_display': 'unset' } }
			: {}
	)

const getDirectionCss = (direction: ComponentLayout['direction']) => (): SelectorToCssMap =>
	setForComponent(
		direction
			? {
					'': {
						direction,
					},
			  }
			: {}
	)

type ComponentLayoutProps = Omit<ComponentLayout, 'id' | 'type'>
const componentLayoutPropertiesConverters: {
	[P in keyof ComponentLayoutProps]: <T extends ComponentLayoutProps[P]>(
		sizeProp: T,
		additionalLayoutProperties: AdditionalLayoutProperties
	) => () => SelectorToCssMap
} = {
	width: getWidthCss,
	height: getHeightCss,
	minWidth: getMinWidthCss,
	minHeight: getMinHeightCss,
	maxWidth: getMaxWidthCss,
	maxHeight: getMaxHeightCss,
	rotationInDegrees: getRotationCss,
	hidden: getHiddenCss,
	direction: getDirectionCss,
}

const componentLayoutDefaults = {
	height: undefined,
}

const componentLayoutConverter = (
	componentLayout: ComponentLayout,
	additionalLayoutProperties: AdditionalLayoutProperties
) => {
	const componentLayoutWithDefaults = defaults(componentLayout, componentLayoutDefaults)
	const propertiesConverters = map(
		// @ts-ignore
		pickBy(componentLayoutWithDefaults, (val, key) => Boolean(componentLayoutPropertiesConverters[key] as any)),
		// @ts-ignore
		(val, key) => componentLayoutPropertiesConverters[key](val, additionalLayoutProperties)
	)

	return reduce(
		propertiesConverters,
		(selectorToCssMap, getCssFunc) => {
			const selectorToCssMapToAdd = getCssFunc()
			forEach(selectorToCssMapToAdd, (cssObj: CssObject, selector: string) => {
				// @ts-ignore
				selectorToCssMap[selector] = selectorToCssMap[selector] || {}
				// @ts-ignore
				assign(selectorToCssMap[selector], cssObj)
			})
			return selectorToCssMap as TargetedCss
		},
		{} as TargetedCss
	)
}

export const pinnedLayerDataItemToCss = (layoutDataItem: any) => {
	if (layoutDataItem.type !== 'FixedItemLayout') {
		return {}
	}

	const pinnedLayerCss = {
		position: 'fixed',
		left: 0,
		width: '100%',
		display: 'grid',
		'grid-template-columns': '1fr',
		'grid-template-rows': '1fr',
	}

	const isDockedBottom = get(layoutDataItem, 'alignSelf') === 'end'
	if (isDockedBottom) {
		assign(pinnedLayerCss, {
			bottom: 0,
			top: 'unset', // reset cascading
			height: 'auto',
		})
	} else {
		assign(pinnedLayerCss, {
			top: 0,
			bottom: 'unset', // reset cascading
			height: 'calc(100% - var(--wix-ads-height))',
			'margin-top': 'var(--wix-ads-height)',
		})
	}

	return {
		component: pinnedLayerCss,
	} as SelectorToCssMap
}

type SimpleLayoutDataItems = Exclude<LayoutDataItems, SingleLayoutData>

type Converters = {
	readonly [P in SimpleLayoutDataItems['type']]: (
		item: TypeMapping[P],
		additionalLayoutProperties: AdditionalLayoutProperties
	) => TargetedCss
}

const converters: Converters = {
	ComponentLayout: componentLayoutConverter,
	FixedItemLayout: parseFixedItem,
	GridItemLayout: parseGridItem,
	GridContainerLayout: parseGridLayout,
	FlexContainerLayout: parseFlexContainerLayout,
	FlexItemLayout: parseFlexItemLayout,
	OrganizerContainerLayout: parseFlexContainerLayout,
	OrganizerItemLayout: parseFlexItemLayout,
	StackContainerLayout: parseFlexContainerLayout,
	StackItemLayout: parseFlexItemLayout,
}

export const responsiveLayoutTypes = Object.keys(converters)

export const layoutDataItemToCss = (layoutDataItem: any, additionalLayoutProperties: AdditionalLayoutProperties) => {
	const converter = converters[(layoutDataItem as SimpleLayoutDataItems).type]
	if (!converter) {
		throw new Error(`invalid layout type: ${layoutDataItem.type} for layout id ${layoutDataItem.id}`)
	}
	return converter(layoutDataItem as any, additionalLayoutProperties) as SelectorToCssMap
}
