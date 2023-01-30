import { AppStructure, PlatformModel, PropsMap } from '@wix/thunderbolt-symbols'
import _ from 'lodash'

/**
 * add ghost structure and props from platformModel to provided models, this function mutates the provided models as an optimization
 */
export const addGhostsInPlace = (platformModel: PlatformModel, structureModel: AppStructure, propsModel: PropsMap): { structureModel: AppStructure; propsModel: PropsMap } => {
	const propsModelWithGhosts = Object.assign(propsModel, platformModel.ghosts.props)

	const structureModelWithGhosts = Object.assign(structureModel, platformModel.ghosts.structure)
	// add ghost structure component to its parent components list
	_.forEach(platformModel.ghosts.parentComponentsUpdates, (components, id) => {
		structureModelWithGhosts[id].components = components
	})
	return { structureModel: structureModelWithGhosts, propsModel: propsModelWithGhosts }
}
