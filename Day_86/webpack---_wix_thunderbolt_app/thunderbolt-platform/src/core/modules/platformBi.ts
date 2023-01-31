import _ from 'lodash'
import type { BiUtils, Initializable, IModelsAPI } from '@wix/thunderbolt-symbols'
import type { BootstrapData } from '../../types'
import { PLATFORM_BI, PLATFORM_BI_LOGGER, BOOTSTRAP_DATA, MODELS_API } from './moduleNames'
import { EventCategories } from '@wix/fe-essentials-viewer-platform/bi'

const PlatformBi = (biUtils: BiUtils, { platformEnvData }: BootstrapData, modelsApi: IModelsAPI): Initializable => ({
	init: () => {
		const {
			bi: {
				isPreview,
				pageData: { pageNumber, isLightbox },
			},
		} = platformEnvData

		if (process.env.browser && !isLightbox && !isPreview) {
			const all_widgets = _.flatMap(modelsApi.getApplications(), (controllers) => _.map(controllers, 'controllerType'))
			const widgets_ids = _.uniq(all_widgets)
			const params = all_widgets.length
				? {
						apps_ids: modelsApi.getApplicationIds(),
						widgets_ids,
						widgets_count: all_widgets.length,
						page_number: pageNumber,
				  }
				: {
						apps_ids: ['NO_APPS'],
						widgets_ids: ['NO_APPS'],
						widgets_count: 0,
						page_number: pageNumber,
				  }

			biUtils.createBaseBiLoggerFactory().logger().log(
				{
					src: 72,
					evid: 520,
					endpoint: 'bpm',
					params,
				},
				{
					category: EventCategories.Essential,
				}
			)
		}
	},
})

export default {
	factory: PlatformBi,
	deps: [PLATFORM_BI_LOGGER, BOOTSTRAP_DATA, MODELS_API],
	name: PLATFORM_BI,
}
