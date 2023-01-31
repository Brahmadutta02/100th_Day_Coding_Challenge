import type { ImagePlaceholder, ImagePlaceholderData, ImagePlaceholderPageConfig } from './types'
import { IComponentPropsExtender } from 'feature-components'
import { IMAGE_PLACEHOLDER_COMPONENTS_TYPES } from './imagePlaceholderComponentTypes'
import { IPageWillMountHandler } from '@wix/thunderbolt-symbols'

const SCHEME_RE = /^[a-z]+:/

export default function createFactory(getImageClientApi: any) {
	return (
		pageConfig: ImagePlaceholderPageConfig
	): IComponentPropsExtender<
		{ getPlaceholder: (imagePlaceholderData: ImagePlaceholderData) => ImagePlaceholder },
		unknown
	> &
		IPageWillMountHandler => {
		const { isSEOBot, staticMediaUrl } = pageConfig

		const getPlaceholder = ({ fittingType, src, target, options }: ImagePlaceholderData): ImagePlaceholder => {
			const placeholder = getImageClientApi().getPlaceholder(fittingType, src, target, {
				...(options || {}),
				isSEOBot,
				autoEncode: true,
			})

			if (placeholder && placeholder.uri && !SCHEME_RE.test(placeholder.uri)) {
				placeholder.uri = `${staticMediaUrl}/${placeholder.uri}`
			}

			if (placeholder?.srcset?.dpr) {
				placeholder.srcset.dpr = placeholder.srcset.dpr.map((s: string) =>
					SCHEME_RE.test(s) ? s : `${staticMediaUrl}/${s}`
				)
			}

			return placeholder
		}

		return {
			componentTypes: IMAGE_PLACEHOLDER_COMPONENTS_TYPES,
			getExtendedProps: () => ({ getPlaceholder }),
			pageWillMount() {
				// since getPlaceHolder is using imageClientApi we need to wait for imageClientApi before rendering
				return window.externalsRegistry.imageClientApi.loaded
			},
			name: 'ClientImagePlaceholder',
		}
	}
}
