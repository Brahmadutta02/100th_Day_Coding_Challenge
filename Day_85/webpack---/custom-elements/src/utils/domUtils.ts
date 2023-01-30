// @ts-nocheck

const CSS_NUMERIC_VALUES = { columnCount: 1, columns: 1, fontWeight: 1, lineHeight: 1, opacity: 1, zIndex: 1, zoom: 1 }

const addDefaultUnitIfNeeded = (prop, value) =>
	typeof value === 'number' && !CSS_NUMERIC_VALUES[prop] ? `${value}px` : value

const setAttributes = (node, attributes) =>
	node && attributes && Object.keys(attributes).forEach((attr) => node.setAttribute(attr, attributes[attr]))

const setStyle = (node, styleProperties) =>
	node &&
	styleProperties &&
	Object.keys(styleProperties).forEach((prop) => {
		const propValue = styleProperties[prop]
		if (propValue !== undefined) {
			node.style[prop] = addDefaultUnitIfNeeded(prop, propValue)
		} else {
			node.style.removeProperty(prop)
		}
	})

const setCssVars = (node, cssVars) =>
	node &&
	cssVars &&
	Object.keys(cssVars).forEach((prop) => {
		node.style.setProperty(prop, cssVars[prop])
	})

// 'true'  => true
// 'false' => false
// 'null'  => null
// '42'    => 42
// '42.5'  => 42.5
// '08'    => '08'
// String  => self
const deserializeValue = (value) => {
	if (!value) {
		return value
	}

	if (value === 'true') {
		return true
	}

	if (value === 'false') {
		return false
	}

	if (value === 'null') {
		return null
	}

	if (`${+value}` === value) {
		return +value
	}

	return value
}

const getData = (node, key, shouldDeserializeVal = true) =>
	node && shouldDeserializeVal ? deserializeValue(node.dataset[key]) : node.dataset[key]

const setData = (node, datasetOverrides) => node && datasetOverrides && Object.assign(node.dataset, datasetOverrides)

const getScreenHeight = (getterOverride?: () => number) => {
	return getterOverride?.() || window.innerHeight || document.documentElement.clientHeight || 0
}

const getDocumentScrollPosition = () => (window ? window.pageYOffset || document.documentElement.scrollTop : 0)

const fittingTypeToObjectFit = {
	fit: 'contain',
	fill: 'cover',
}

export {
	setAttributes,
	setStyle,
	setCssVars,
	getData,
	setData,
	getScreenHeight,
	getDocumentScrollPosition,
	fittingTypeToObjectFit,
}
