import { TpaHandler } from '@wix/thunderbolt-symbols'
import _ from 'lodash'

type ViewMode = 'editor' | 'preview' | 'site'

export const withViewModeRestriction = (allowedModes: Array<ViewMode>, tpaHandler: TpaHandler): TpaHandler => {
	const allowedModesMap = _.fromPairs(allowedModes.map((mode) => [mode, true]))
	return (compId, data, extras) => {
		if (!allowedModesMap[extras.viewMode]) {
			return Promise.reject(
				new Error(
					`withViewModeRestriction: Invalid view mode. This function cannot be called in ${
						extras.viewMode
					} mode. Supported view modes are: [${allowedModes.join(', ')}]`
				)
			)
		}
		return tpaHandler(compId, data, extras)
	}
}
