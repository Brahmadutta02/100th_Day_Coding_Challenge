import { MasterPageClassNames } from '@wix/thunderbolt-components'
import { named, optional, withDependencies } from '@wix/thunderbolt-ioc'
import { Props, IPageWillMountHandler, IPropsStore, PageFeatureConfigSymbol, pageIdSym } from '@wix/thunderbolt-symbols'
import { LandingPageAPISymbol, name } from './symbols'
import type { LandingPagePageConfig } from './types'
import { ILandingPagePageAPI } from './types'
import { ILightboxUtils, LightboxUtilsSymbol } from 'feature-lightbox'

const LANDING_PAGE_CLASS_NAME = 'landingPage'

const landingPageAPI: (propsStore: IPropsStore, featureConfig: LandingPagePageConfig) => ILandingPagePageAPI = (
	propsStore
) => {
	const updateClassNames = (classNames: MasterPageClassNames) => {
		propsStore.update({
			masterPage: { classNames },
		})
	}

	return {
		async updateClassNames(isLandingPage) {
			const masterPageProps = propsStore.get('masterPage') || {}
			const currentClassNames: MasterPageClassNames = masterPageProps.classNames || {}

			if (isLandingPage && !currentClassNames[LANDING_PAGE_CLASS_NAME]) {
				const classNames = { ...currentClassNames, [LANDING_PAGE_CLASS_NAME]: LANDING_PAGE_CLASS_NAME }
				updateClassNames(classNames)
			}

			if (!isLandingPage && currentClassNames[LANDING_PAGE_CLASS_NAME]) {
				const classNames = { ...currentClassNames }
				delete classNames[LANDING_PAGE_CLASS_NAME]
				updateClassNames(classNames)
			}
		},
	}
}

export const LandingPageAPI = withDependencies([Props], landingPageAPI)

export const LandingPage = withDependencies(
	[named(PageFeatureConfigSymbol, name), LandingPageAPISymbol, pageIdSym, optional(LightboxUtilsSymbol)],
	(config, { updateClassNames }, pageId, popupUtils?: ILightboxUtils): IPageWillMountHandler => ({
		name: 'landingPage',
		pageWillMount: () => {
			if (pageId === 'masterPage' || popupUtils?.isLightbox(pageId)) {
				// This is for Editor flow
				return
			}

			updateClassNames(config.isLandingPage)
		},
	})
)
