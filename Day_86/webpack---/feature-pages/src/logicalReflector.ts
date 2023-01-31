import { ILoadFeatures, FeaturesLoaderSymbol } from '@wix/thunderbolt-features'
import { ProviderCreator } from '@wix/thunderbolt-ioc'
import { PageAssetsLoaderSymbol, IPageAssetsLoader, FeatureStateSymbol } from '@wix/thunderbolt-symbols'
import { IFeatureState } from 'thunderbolt-feature-state'
import { createPageContainer, createPageReflector } from './pageUtils'
import { name } from './symbols'
import type { IPageReflector, PageState } from './types'

export const LogicalReflector: ProviderCreator<IPageReflector> = (container) => {
	const pageAssetsLoader = container.get<IPageAssetsLoader>(PageAssetsLoaderSymbol)
	const featuresLoader = container.get<ILoadFeatures>(FeaturesLoaderSymbol)
	const featureState = container.getNamed<IFeatureState<PageState>>(FeatureStateSymbol, name)

	return async (contextId: string, pageId: string = contextId) => {
		const reflectors = featureState.get()
		if (contextId in reflectors) {
			return reflectors[contextId]
		}

		const pageContainer = await createPageContainer({
			pageId,
			contextId,
			container,
			pageAssetsLoader,
			featuresLoader,
		})

		return createPageReflector(pageContainer)
	}
}
