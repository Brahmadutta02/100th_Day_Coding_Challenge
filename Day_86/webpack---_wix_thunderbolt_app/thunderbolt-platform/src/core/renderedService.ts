import _ from 'lodash'
import type { RawModel, RenderedAPI } from './types'

export default function ({ model, getCompType, getParentId }: { model: RawModel; getCompType: any; getParentId: any }): RenderedAPI {
	const isRenderedInSlideShow = (slideId: string, slideShowId: string) => {
		const { components } = model.structureModel[slideShowId]
		return model.propsModel[slideShowId].currentSlideIndex === _.indexOf(components, slideId)
	}

	const isRenderedInStateBox = (/* stateBoxStateId: string, stateBoxId: string*/) => {
		// TO-DO
		return true
	}

	const isRenderedInHoverBox = (hoverBoxId: string, ancestorCompId: string, compId?: string) => {
		if (hoverBoxId === compId) {
			return true
		}

		const hoverBoxProps = model.propsModel[hoverBoxId]
		const currentMode = hoverBoxProps.mode || 'default'

		const hoverBoxSdkData = model.platformModel.sdkData[hoverBoxId]
		const modeToIsHidden = compId ? hoverBoxSdkData[compId!] : {}

		return !modeToIsHidden[currentMode]
	}

	const getAncestorsOfType = (
		compId: string | undefined,
		types: Array<string>
	): { ancestorCompType: 'SlideShowSlide' | 'StateBox' | 'HoverBox' | undefined; ancestorCompId: string | undefined; parentId: string | undefined } => {
		while (compId) {
			const ancestorCompType = getCompType(compId)
			if (_.includes(types, ancestorCompType)) {
				const ancestorCompId = getParentId(compId)
				return { ancestorCompType, ancestorCompId, parentId: compId }
			}
			compId = getParentId(compId)
		}
		return {
			ancestorCompType: undefined,
			ancestorCompId: undefined,
			parentId: undefined,
		}
	}

	return {
		isRendered(compId: string | undefined): boolean {
			const logicForRenderedComps = { HoverBox: isRenderedInHoverBox, SlideShowSlide: isRenderedInSlideShow, StateBox: isRenderedInStateBox }
			const relevantCompsForRendered = ['SlideShowSlide', 'StateBoxState', 'HoverBox']
			const { ancestorCompType, ancestorCompId, parentId } = getAncestorsOfType(compId, relevantCompsForRendered)
			if (ancestorCompType && ancestorCompId && parentId) {
				return logicForRenderedComps[ancestorCompType](parentId, ancestorCompId, compId)
			}
			return true
		},
	}
}
