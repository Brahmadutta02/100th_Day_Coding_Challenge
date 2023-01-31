import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	PageFeatureConfigSymbol,
	IPageWillMountHandler,
	IPropsStore,
	Props,
	SiteFeatureConfigSymbol,
	pageIdSym,
	PageScrollRegistrarSymbol,
	FeatureStateSymbol,
	IPageDidMountHandler,
	contextIdSymbol,
} from '@wix/thunderbolt-symbols'
import { SiteScrollBlockerSymbol, ISiteScrollBlocker } from 'feature-site-scroll-blocker'
import { IWindowScrollAPI, WindowScrollApiSymbol } from 'feature-window-scroll'
import { IPageScrollRegistrar } from 'feature-page-scroll'
import { OoiTpaSharedConfigSymbol, IOoiTpaSharedConfig } from 'feature-ooi-tpa-shared-config'
import { IFeatureState } from 'thunderbolt-feature-state'
import { name } from './symbols'
import type { OOIPageConfig, OOISiteConfig } from './types'
import { createHostProps } from './hostProps'
import _ from 'lodash'

export const ooiPageWillMount = withDependencies(
	[
		pageIdSym,
		contextIdSymbol,
		named(PageFeatureConfigSymbol, name),
		named(SiteFeatureConfigSymbol, name),
		Props,
		SiteScrollBlockerSymbol,
		WindowScrollApiSymbol,
		PageScrollRegistrarSymbol,
		OoiTpaSharedConfigSymbol,
		named(FeatureStateSymbol, name),
	],
	(
		pageId,
		contextId,
		{ ooiComponents, accessibilityEnabled }: OOIPageConfig,
		{ viewMode, formFactor }: OOISiteConfig,
		propsStore: IPropsStore,
		siteScrollBlocker: ISiteScrollBlocker,
		windowScrollApi: IWindowScrollAPI,
		{ registerToThrottledScroll }: IPageScrollRegistrar,
		{ getFontsConfig }: IOoiTpaSharedConfig,
		featureState: IFeatureState<{ [compId: string]: Array<Function> }>
	): IPageWillMountHandler & IPageDidMountHandler => {
		const getUniqueCompIdPerContextId = (compId: string) => `${contextId}_${compId}`

		return {
			name: 'ooi',
			pageWillMount() {
				_.forEach(ooiComponents, (compData) => {
					const compId = compData.compId
					const uniqueCompId = getUniqueCompIdPerContextId(compId)

					const registerToComponentDidLayout = (handler: Function) => {
						const componentDidLayoutHandlers = featureState.get()?.[uniqueCompId] || []
						componentDidLayoutHandlers.push(handler)
						// the handlers are stored on feature state and not on this module's state because
						// props.host.registerToComponentDidLayout(cb) may be invoked within the ooi react componentDidMount() lifecycle
						// which is triggered once per master page component.
						featureState.update((state) => ({ ...state, [uniqueCompId]: componentDidLayoutHandlers }))
					}

					const unregisterFromComponentDidLayout = () =>
						featureState.update((state) => {
							delete state[uniqueCompId]
							return state
						})

					const hostProps = createHostProps({
						compData,
						pageId,
						accessibilityEnabled,
						formFactor,
						viewMode,
						siteScrollBlocker,
						windowScrollApi,
						registerToThrottledScroll,
						fonts: getFontsConfig(),
					})

					propsStore.update({
						[compId]: {
							host: {
								...hostProps,
								// TODO rename to "onComponentInteractive"
								registerToComponentDidLayout,
								unregisterFromComponentDidLayout,
							},
						},
					})
				})
			},
			pageDidMount() {
				_.forEach(ooiComponents, ({ compId }) => {
					const componentDidLayoutHandlers = featureState.get()?.[getUniqueCompIdPerContextId(compId)] || []
					componentDidLayoutHandlers.forEach((handler) => handler())
				})
			},
		}
	}
)
