import _ from 'lodash'
import type { IModelsAPI, CompProps, OnPageWillUnmount, Initializable } from '@wix/thunderbolt-symbols'
import type { BootstrapData } from '../../types'
import type { IViewerHandlers } from '../types'
import { MODEL_PROPS_UPDATER, BOOTSTRAP_DATA, MODELS_API, VIEWER_HANDLERS, ON_PAGE_WILL_UNMOUNT } from './moduleNames'

const ModelPropsUpdater = (bootstrapData: BootstrapData, { viewerHandlers }: IViewerHandlers, modelsApi: IModelsAPI, onPageWillUnmount: OnPageWillUnmount): Initializable => ({
	init: () => {
		if (!bootstrapData.platformEnvData.window.isSSR) {
			viewerHandlers.componentsLoader
				.registerOnPropsChangedHandler(bootstrapData.currentContextId, (changes: CompProps) => {
					_.forEach(changes, (newProps, compId) => {
						modelsApi.updateProps(compId, newProps)
					})
				})
				.then(onPageWillUnmount)
		}
	},
})

export default {
	factory: ModelPropsUpdater,
	deps: [BOOTSTRAP_DATA, VIEWER_HANDLERS, MODELS_API, ON_PAGE_WILL_UNMOUNT],
	name: MODEL_PROPS_UPDATER,
}
