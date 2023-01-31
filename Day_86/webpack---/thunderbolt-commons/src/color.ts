import Color from 'color'
import { generate, GradientData, GradientMesh } from '@wix/css-gradient-generator'

export const isColor = (val: string): boolean =>
	val ? /(^#([a-f\d]{3}){1,2}$)|(^rgba?\(\d+(,\d+){2,3}(\.\d+)?\)$)/i.test(val.replace(/\s/g, '')) : false

const isRgbValues = (val: string): boolean => (val ? /^\d+(,\d+){2,3}(\.\d+)?$/.test(val.replace(/\s/g, '')) : false)
const isHexValue = (val: string): boolean => (val ? /(^#([a-f\d]{3}){1,2}$)/i.test(val.replace(/\s/g, '')) : false)
const rgbToHexString = (rgb: Array<number>): string =>
	`#${rgb
		.map((channel) => {
			const hex = channel.toString(16)
			return hex.length === 1 ? `0${hex}` : hex
		})
		.join('')}`

const getColor = (color: string) => {
	if (isColor(color)) {
		return Color(color)
	}
	if (isRgbValues(color)) {
		return Color(`rgba(${color})`)
	}
	if (color === 'transparent') {
		return Color.rgb(0, 0, 0, 0)
	}
	return null
}

const isThemeColor = (color: string) => /^color_\d+$/.test(color)

const brighten = (colorString: string, brightnessModifier: number = 1): string | null => {
	const color = getColor(colorString)
	if (!color) {
		return null
	}
	const hsvColor = color.hsv()
	return hsvColor
		.value(hsvColor.value() * brightnessModifier)
		.rgb()
		.string()
}

const getRGBAColorString = (color: string, colorOpacity: number | 'none' = 1): string => {
	try {
		if (colorOpacity === 'none') {
			return Color(fixColor(color)).string()
		}
		return Color(fixColor(color)).alpha(colorOpacity).string()
	} catch (e) {
		return color
	}
}

const splitColor = (rgbString: string): string => Color(rgbString).array().join(',')

/**
 * Returns rgb values string from a hex color string input (i.e 255,255,255), null if value given is not a hex color
 * @param value a string value that might be a color
 */
const getSplitRgbValuesString = (value: string): string | null => {
	const color = getColor(value)
	if (!color) {
		return null
	}

	return color.rgb().array().join(',')
}

/**
 * Returns an RGB values from rgb or rgba expressions as a string.
 * If there is an opacity value (alpha) in rgba expression it will be ignored.
 * @param value a string that might be one of the expressions: rgb(r, g, b), or rgba(r, g, b, a)
 */
const getSplitRgbValuesStringWithoutAlpha = (value: string): string | null => {
	const color = getColor(value)
	if (!color) {
		return null
	}
	const { r, g, b } = color.object()
	return `${r},${g},${b}`
}

const getColorAlpha = (value: string): number | null => {
	const color = getColor(value)
	if (!color) {
		return null
	}

	return color.alpha()
}

/**
 * Given theme color string e.g {color_1} / [color_1] extracts the underlying color - color_1
 * @param str theme color
 */
const extractThemeColor = (str: string): string => {
	return str.replace(new RegExp('[\\[\\]{}]', 'g'), '')
}

const getFromColorMap = (rawColor: string, colorsMap: Array<string> = []) => {
	const [, themeColorIndex] = extractThemeColor(rawColor).split('_')
	const i = parseInt(themeColorIndex, 10)
	return isNaN(i) ? rawColor : colorsMap[i]
}

const isGreyscale = (colorObj: Color) =>
	colorObj.red() === colorObj.green() && colorObj.red() === colorObj.blue() && colorObj.red() !== 255

const getHexColor = (rgbAsString: string) => {
	const color = getColor(rgbAsString)
	return color && color.hex().toString()
}

const getColorClass = (className: string) => {
	const findColorClass = /(color_\d+)/
	const colorClass = findColorClass.exec(className)

	return colorClass && colorClass[1]
}

const fixColor = (color: string) => {
	if (isColor(color)) {
		return color
	}
	if (typeof color === 'undefined') {
		return color
	}

	if (isColor(`rgba(${color})`)) {
		return `rgba(${color})`
	}

	if (isColor(`rgb(${color})`)) {
		return `rgb(${color})`
	}

	return color.replace(';', '')
}

const formatColor = (value: string, alpha: string | number) => {
	const fixedColor = fixColor(value)
	const color = new Color(fixedColor).alpha(Number(alpha))
	const formattedRgbColor = color.rgb().toString().replace(/ /g, '')

	return Number(alpha) !== 1
		? formattedRgbColor
		: formattedRgbColor.replace(/^rgb/, 'rgba').replace(')', `,${color.alpha()})`)
}

const getColorFromCssStyle = (value: { red: number; green: number; blue: number; alpha: number }) => {
	const { red, green, blue, alpha } = value
	const color = new Color(rgbToHexString([red, green, blue]))
	return formatColor(color.toString(), alpha)
}

const extractRGBA = (value: string): string => {
	const rgbaRe = /rgba\([^)]+\)/
	const result = value.match(rgbaRe)

	if (result && result[0]) {
		return result[0]
	}

	return ''
}

const isValidColor = (color: string) => isColor(color) || isRgbValues(color) || isHexValue(color) || isThemeColor(color)

const generateGradient = (colorLayers: GradientData | GradientMesh, alpha: number, colorMap: Array<string>) =>
	generate(colorLayers, { alpha, resolveColor: (color) => getFromColorMap(color, colorMap) })

export {
	brighten,
	extractThemeColor,
	getRGBAColorString,
	splitColor,
	getFromColorMap,
	getSplitRgbValuesString,
	getSplitRgbValuesStringWithoutAlpha,
	getHexColor,
	getColorAlpha,
	getColorClass,
	formatColor,
	isGreyscale,
	isThemeColor,
	isRgbValues,
	isHexValue,
	getColorFromCssStyle,
	extractRGBA,
	isValidColor,
	generateGradient,
}
