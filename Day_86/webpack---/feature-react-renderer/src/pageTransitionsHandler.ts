import { withDependencies } from '@wix/thunderbolt-ioc'
import type { IPageTransitionsHandler } from './types'
import { IAppDidLoadPageHandler, IAppWillLoadPageHandler, LifeCycle } from '@wix/thunderbolt-symbols'
import { IPageProvider, PageProviderSymbol } from 'feature-pages'
import { IPageTransitionsCompleted, PageTransitionsCompletedSymbol } from 'feature-page-transitions'

export const PageTransitionsHandler = withDependencies(
	[PageProviderSymbol],
	(pageReflectorProvider: IPageProvider): IPageTransitionsHandler & IAppWillLoadPageHandler => {
		const state = {
			hasPageTransitions: false,
		}

		return {
			name: 'pageTransitionsHandler',
			appWillLoadPage: async ({ pageId, contextId }) => {
				const pageReflector = await pageReflectorProvider(contextId, pageId)
				const appDidLoadPageHandlers = pageReflector.getAllImplementersOf<IAppDidLoadPageHandler>(
					LifeCycle.AppDidLoadPageHandler
				)
				const [pageTransitionsImp] = pageReflector.getAllImplementersOf<IPageTransitionsCompleted>(
					PageTransitionsCompletedSymbol
				)
				state.hasPageTransitions = !!pageTransitionsImp

				const triggerAppDidLoadPageHandlers = () =>
					appDidLoadPageHandlers.map((handler) => handler.appDidLoadPage({ pageId, contextId: contextId! }))

				if (state.hasPageTransitions) {
					pageTransitionsImp.onPageTransitionsCompleted(triggerAppDidLoadPageHandlers)
				}
			},
			hasPageTransitions: () => state.hasPageTransitions,
		}
	}
)
