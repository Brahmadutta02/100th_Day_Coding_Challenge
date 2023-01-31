import { Alignment, JustifyContent, UnitSize } from '@wix/thunderbolt-becky-types'

export const unitSizeToString = (size: UnitSize): string => {
	let type: string = size.type

	if (size.type === 'percentage') {
		type = '%'
	}

	return `${size.value}${type}`
}

export const numberToString = (number: number): string => number.toString()

export const gridAlignmentToString = (alignment: Alignment): string => alignment.toLowerCase()

const alignmentToFlexSyntax = {
	start: 'flex-start' as 'flex-start',
	end: 'flex-end' as 'flex-end',
	center: 'center' as 'center',
	stretch: 'stretch' as 'stretch',
	auto: 'auto' as 'auto',
}

export const flexAlignmentToString = (alignment: Alignment): string => alignmentToFlexSyntax[alignment]

const justifyContentToFlexSyntax = {
	start: 'flex-start' as 'flex-start',
	end: 'flex-end' as 'flex-end',
	center: 'center' as 'center',
	spaceBetween: 'space-between' as 'space-between',
	spaceAround: 'space-around' as 'space-around',
}

export const flexJustifyContentToString = (justifyContent: JustifyContent): string =>
	justifyContentToFlexSyntax[justifyContent]
