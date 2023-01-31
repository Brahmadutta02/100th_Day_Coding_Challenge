import { WixCodeApiFactoryArgs } from '@wix/thunderbolt-symbols'
import { namespace } from '..'
import { SearchWixCodeSdkFactorySiteConfig, NamespacedSearchWixCodeSdkWixCodeApi } from '../types'
import WixSearchBuilder from '../builder/search'
import WixSearchFilterBuilder from '../builder/filter'
import WixSearchClient from '../util/client'
import { getInstance } from '../util/auth'
import { currentLanguage } from '../util/language'

const SearchSdkFactory = ({
	featureConfig,
	platformEnvData,
	platformUtils,
}: WixCodeApiFactoryArgs<SearchWixCodeSdkFactorySiteConfig>): NamespacedSearchWixCodeSdkWixCodeApi => {
	const { language } = featureConfig
	const { sessionService } = platformUtils
	const { multilingual } = platformEnvData

	return {
		[namespace]: {
			search: (query) =>
				new WixSearchBuilder({
					query,
					client: new WixSearchClient(getInstance(sessionService)),
					fuzzy: true,
					highlight: false,
					language: currentLanguage(language, multilingual),
				}),
			filter: () => new WixSearchFilterBuilder(),
		},
	}
}

export { SearchSdkFactory }
