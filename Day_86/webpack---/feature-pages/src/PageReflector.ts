import { ProviderCreator } from '@wix/thunderbolt-ioc'
import { ComponentsLoaderSymbol, IComponentsLoader } from '@wix/thunderbolt-components-loader'
import type { IPageReflector, PagesSiteConfig, PageState } from './types'
import { name, PagePropsJsonSymbol, PageStructureJsonSymbol } from './symbols'
import { IFeatureState } from 'thunderbolt-feature-state'
import {
	ComponentDriverProviderSymbol,
	ComponentsStoreSymbol,
	ViewerComponent,
	ViewerComponentProvider,
} from 'feature-components'
import {
	IPageAssetsLoader,
	IPageWillMountHandler,
	IPropsStore,
	IStructureAPI,
	LifeCycle,
	PageAssets,
	PageAssetsLoaderSymbol,
	Props,
	StructureAPI,
	MasterPageFeatureConfigSymbol,
	ICompActionsStore,
	CompActionsSym,
	IPageDidUnmountHandler,
	IPageWillUnmountHandler,
	IStylesStore,
	StylesStoreSymbol,
	FeatureStateSymbol,
	AppStructure,
	PropsMap,
	Store,
	IStateRefsStore,
	StateRefsStoreSymbol,
} from '@wix/thunderbolt-symbols'
import { FeaturesLoaderSymbol, ILoadFeatures } from '@wix/thunderbolt-features'
import { errorPagesIds } from '@wix/thunderbolt-commons'
import _ from 'lodash'
import { createPageContainer, createPageReflector } from './pageUtils'

export const PageProvider: ProviderCreator<IPageReflector> = (container) => {
	const pageAssetsLoader = container.get<IPageAssetsLoader>(PageAssetsLoaderSymbol)
	const featuresLoader = container.get<ILoadFeatures>(FeaturesLoaderSymbol)
	const structureApi = container.get<IStructureAPI>(StructureAPI)
	const compActionsStore = container.get<ICompActionsStore>(CompActionsSym)
	const propsStore = container.get<IPropsStore>(Props)
	const stateRefsStore = container.get<IStateRefsStore>(StateRefsStoreSymbol)
	const componentsStore = container.get<Store<{ [compId: string]: ViewerComponent }>>(ComponentsStoreSymbol)
	const stylesStore = container.get<IStylesStore>(StylesStoreSymbol)
	const componentsLoader = container.get<IComponentsLoader>(ComponentsLoaderSymbol)
	const siteConfig = container.getNamed<PagesSiteConfig>(MasterPageFeatureConfigSymbol, name)
	const featureState = container.getNamed<IFeatureState<PageState>>(FeatureStateSymbol, name)
	featureState.update(() => ({}))

	const createMasterPageReflectorIfNeeded = (pageId: string): Promise<IPageReflector> | Promise<undefined> => {
		if (pageId !== 'masterPage' && (siteConfig.nonPopupPages[pageId] || errorPagesIds[pageId])) {
			const masterPageReflector = createPage('masterPage', 'masterPage')
			featureState.update((current) => ({ ...current, masterPage: masterPageReflector }))
			return masterPageReflector
		}

		return Promise.resolve(undefined)
	}

	const destroyPage = async (contextId: string) => {
		compActionsStore.setChildStore(contextId)
		propsStore.setChildStore(contextId)
		structureApi.cleanPageStructure(contextId)
		stateRefsStore.setChildStore(contextId)
		featureState.update((current) => {
			const reflectors = { ...current }
			delete reflectors[contextId]
			return reflectors
		})
	}

	const triggerRenderOnComponents = async (props: PageAssets['props']) => {
		// Trigger render on all of the masterPage structure component.
		// The underline component will be re-render only if one of the props was updated
		const emptyMap = Object.keys((await props).render.compProps).reduce(
			(acc, compId) => ({ ...acc, [compId]: {} }),
			{}
		)
		propsStore.update(emptyMap)
	}

	const createPage = async (pageId: string, contextId: string) => {
		const assets = pageAssetsLoader.load(pageId)

		const masterPage = createMasterPageReflectorIfNeeded(pageId)
		const loadPageStructure = structureApi.loadPageStructure(pageId, contextId)
		const loadComponentsPromise = loadPageStructure.then((myPageStructure) =>
			componentsLoader.loadComponents(myPageStructure)
		)

		const [pageContainer, pageStructure, pageProps] = await Promise.all([
			createPageContainer({ pageId, contextId, container, pageAssetsLoader, featuresLoader }),
			loadPageStructure,
			assets.props.then(({ render: { compProps } }) => {
				propsStore.setChildStore(contextId, compProps)
				return compProps
			}),
			assets.stateRefs.then((stateRefs) => {
				stateRefsStore.setChildStore(contextId, stateRefs)
			}),
			assets.components.then((components) =>
				[compActionsStore, stylesStore].map((store) =>
					store.setChildStore(
						contextId,
						_.mapValues(components, () => ({}))
					)
				)
			),
		])

		componentsStore.setChildStore(
			contextId,
			pageContainer.get<ViewerComponentProvider>(ComponentDriverProviderSymbol).createComponents(pageStructure)
		)

		pageContainer.bind<IPageWillMountHandler>(LifeCycle.PageWillMountHandler).toConstantValue({
			name: 'PageReflector',
			pageWillMount: async () => {
				await Promise.all([loadComponentsPromise, assets.css])
			},
		})
		pageContainer.bind<AppStructure>(PageStructureJsonSymbol).toConstantValue(pageStructure)
		pageContainer.bind<PropsMap>(PagePropsJsonSymbol).toConstantValue(pageProps)

		if (pageId === 'masterPage') {
			pageContainer.bind<IPageDidUnmountHandler>(LifeCycle.PageDidUnmountHandler).toConstantValue({
				pageDidUnmount: () => {
					triggerRenderOnComponents(assets.props)
				},
			})
		} else {
			pageContainer.bind<IPageWillUnmountHandler>(LifeCycle.PageWillUnmountHandler).toConstantValue({
				pageWillUnmount: () => destroyPage(contextId),
			})
			pageContainer.bind<IPageDidUnmountHandler>(LifeCycle.PageDidUnmountHandler).toConstantValue({
				pageDidUnmount: () => {
					const reflectors = featureState.get()
					if (!reflectors[contextId]) {
						stylesStore.setChildStore(contextId)
						componentsStore.setChildStore(contextId)
					}
				},
			})
		}

		return createPageReflector(pageContainer, await masterPage)
	}

	return (contextId, pageId) => {
		const reflectors = featureState.get()
		if (contextId in reflectors) {
			return reflectors[contextId]
		}

		const pageReflector = createPage(pageId, contextId)
		featureState.update((current) => ({ ...current, [contextId]: pageReflector }))
		return pageReflector
	}
}
