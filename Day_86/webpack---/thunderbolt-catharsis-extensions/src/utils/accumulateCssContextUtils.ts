import _ from 'lodash'
import { CssContext, CompSpecificData, GetParentCb } from '../features/componentCss.types'
import { Component } from '@wix/thunderbolt-becky-types'

const createRecursiveGetParent = (componentId: string, getParent?: GetParentCb) => () => ({ getParent, componentId })

export const accumulateCssContext: (
	comp: Component,
	cssContext: CssContext,
	compSpecificData?: CompSpecificData
) => CssContext = (comp, { getParent, isInRepeater, patterns }, compSpecificData) => ({
	isInRepeater,
	getParent: createRecursiveGetParent(comp.id, getParent),
	patterns: _.merge(patterns, compSpecificData?.patterns),
})
