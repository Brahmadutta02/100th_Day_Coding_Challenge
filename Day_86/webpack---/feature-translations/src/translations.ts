import { named, withDependencies } from '@wix/thunderbolt-ioc'
import {
	FeatureStateSymbol,
	ILanguage,
	IRendererPropsExtender,
	ITranslate,
	ITranslationsFetcher,
	LanguageSymbol,
	Translate,
} from '@wix/thunderbolt-symbols'
import { getTranslation } from './translationsUrl'
import type { TranslationsFeatureState } from './types'
import { IFeatureState } from 'thunderbolt-feature-state'
import { name as translationFeatureName } from './symbols'

export const TranslationsImpl = withDependencies(
	[LanguageSymbol, named(FeatureStateSymbol, translationFeatureName)],
	(
		{ userLanguage }: ILanguage,
		featureState: IFeatureState<TranslationsFeatureState>
	): (() => Promise<ITranslate>) => {
		return async () => {
			if (!featureState.get()?.translations) {
				featureState.update(() => ({
					translations: getTranslation(userLanguage),
				}))
			}

			const translations = await featureState.get().translations

			return (featureNamespace, key, defaultValue) =>
				(translations[featureNamespace] && translations[featureNamespace][key]) || defaultValue
		}
	}
)

export const TranslateBinder = withDependencies(
	[Translate],
	(translationsFetcher: ITranslationsFetcher): IRendererPropsExtender => ({
		async extendRendererProps() {
			return { translate: await translationsFetcher() }
		},
	})
)
