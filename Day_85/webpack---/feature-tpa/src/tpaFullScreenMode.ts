import { named, withDependencies } from '@wix/thunderbolt-ioc'
import {
	BrowserWindow,
	BrowserWindowSymbol,
	IPropsStore,
	Props,
	PageFeatureConfigSymbol,
	SiteFeatureConfigSymbol,
	ComponentsStylesOverridesSymbol,
	IComponentsStylesOverrides,
} from '@wix/thunderbolt-symbols'
import { getIOSVersion } from '@wix/thunderbolt-commons'
import type { ITpaFullScreenMode, TpaPageConfig } from './types'
import { name as tpaCommonsName, TpaCommonsSiteConfig } from 'feature-tpa-commons'
import { name } from './symbols'
import { PERMITTED_FULL_SCREEN_TPAS_IN_MOBILE } from './utils/constants'
import { setFullScreenMode, removeFullScreenMode, hideSiteRoot } from './utils/tpaFullScreenUtils'

const omitBy = (obj: Record<string, string | null>, notAllowedKey: string) =>
	Object.keys(obj).reduce((result, cssKey) => {
		if (cssKey !== notAllowedKey) {
			result[cssKey] = obj[cssKey]
		}
		return result
	}, {} as Record<string, string | null>)

const fullScreenModeFactory = (
	{ widgetsClientSpecMapData, isMobileView }: TpaCommonsSiteConfig,
	{ widgets }: TpaPageConfig,
	props: IPropsStore,
	window: BrowserWindow,
	componentsStylesOverrides: IComponentsStylesOverrides
): ITpaFullScreenMode => {
	const isComponentAllowedInFullScreenMode = (compId: string): boolean => {
		const widget: any = widgets[compId] || {}
		const { appDefinitionId } = widgetsClientSpecMapData[widget.widgetId] || {}
		return Object.values(PERMITTED_FULL_SCREEN_TPAS_IN_MOBILE).includes(appDefinitionId)
	}

	const enterFullScreenMode = (compId: string) => {
		setFullScreenMode(window)
		hideSiteRoot(window, true)

		// TODO: remove. temporary solution until LAYOUT-385 is implemented
		componentsStylesOverrides.set({
			[`${compId}-pinned-layer`]: { 'z-index': 'var(--above-all-z-index) !important' },
		})

		props.update({
			[compId]: {
				iOSVersion: getIOSVersion(window!),
				isMobileFullScreenMode: true,
			},
		})
	}

	const exitFullScreenMode = (compId: string) => {
		removeFullScreenMode(window)
		hideSiteRoot(window, false)

		// TODO: remove. temporary solution until LAYOUT-385 is implemented
		const pinnerLayerId = `${compId}-pinned-layer`
		const pinnerLayerStyle = componentsStylesOverrides.getCompStyle(pinnerLayerId)

		componentsStylesOverrides.set({
			[pinnerLayerId]: omitBy(pinnerLayerStyle, 'z-index'),
		})
		props.update({
			[compId]: {
				isMobileFullScreenMode: false,
			},
		})
	}

	return {
		setFullScreenMobile(compId: string, isFullScreen: boolean) {
			if (!isMobileView) {
				throw new Error('show full screen is only available in Mobile view')
			}

			if (isComponentAllowedInFullScreenMode(compId)) {
				if (isFullScreen) {
					enterFullScreenMode(compId)
				} else {
					exitFullScreenMode(compId)
				}
			}
		},
	}
}

export const TpaFullScreenMode = withDependencies(
	[
		named(SiteFeatureConfigSymbol, tpaCommonsName),
		named(PageFeatureConfigSymbol, name),
		Props,
		BrowserWindowSymbol,
		ComponentsStylesOverridesSymbol,
	],
	fullScreenModeFactory
)
