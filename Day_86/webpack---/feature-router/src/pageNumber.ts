import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { FeatureStateSymbol, IAppWillLoadPageHandler, ILogger, LoggerSymbol } from '@wix/thunderbolt-symbols'
import { IFeatureState } from 'thunderbolt-feature-state'
import { name } from './symbols'
import type { IPageNumber, PageNumberState } from './types'

const DEFAULT_PAGE_NUMBER = 0

const pageNumberHandlerFactory = (
	featureState: IFeatureState<PageNumberState>,
	logger: ILogger
): IAppWillLoadPageHandler & IPageNumber => {
	const updatePageNumberAndReport = () => {
		const currentPageNumber = featureState.get()?.pageNumber || DEFAULT_PAGE_NUMBER
		const nextPageNumber = currentPageNumber + 1
		logger.updatePageNumber(nextPageNumber)
		featureState.update(() => ({
			pageNumber: nextPageNumber,
		}))
	}
	return {
		name: 'pageNumber',
		appWillLoadPage: () => {
			updatePageNumberAndReport()
		},
		getPageNumber: () => featureState.get()?.pageNumber || 1,
	}
}

export const PageNumberHandler = withDependencies(
	[named(FeatureStateSymbol, name), LoggerSymbol],
	pageNumberHandlerFactory
)
