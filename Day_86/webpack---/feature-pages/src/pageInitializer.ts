import {
	IAppWillLoadPageHandler,
	ILogger,
	IPageWillMountHandler,
	LifeCycle,
	LoggerSymbol,
	LOADING_PHASES,
} from '@wix/thunderbolt-symbols'
import { multi, withDependencies } from '@wix/thunderbolt-ioc'
import { taskify } from '@wix/thunderbolt-commons'
import { INavigationManager, NavigationManagerSymbol } from 'feature-navigation-manager'
import { INavigationPhases, NavigationPhasesSymbol } from 'feature-navigation-phases'
import { PageProviderSymbol } from './symbols'
import type { IPageInitializer, IPageProvider } from './types'

class PageInitializerError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'PageInitializerError' // for grouping the errors in the rollout grafana
	}
}

export const PageInitializer = withDependencies(
	[
		multi(LifeCycle.AppWillLoadPageHandler),
		PageProviderSymbol,
		LoggerSymbol,
		NavigationManagerSymbol,
		NavigationPhasesSymbol,
	],
	(
		appWillLoadPageHandlers: Array<IAppWillLoadPageHandler>,
		pageProvider: IPageProvider,
		logger: ILogger,
		navigationManager: INavigationManager,
		navigationPhases: INavigationPhases
	): IPageInitializer => ({
		initPage: async ({ pageId, contextId }) => {
			logger.interactionStarted('init_page')
			navigationPhases.clear()

			const shouldReportHandler = (handler: Function) =>
				navigationManager.isFirstNavigation() && handler.constructor.name === 'AsyncFunction'

			logger.phaseStarted(LOADING_PHASES.PAGE_REFLECTOR)
			const pageReflectorPromise = pageProvider(contextId, pageId)
			const pageWillMount = taskify(async () => {
				const pageReflector = await pageReflectorPromise
				logger.phaseEnded(LOADING_PHASES.PAGE_REFLECTOR)
				const pageWillMountHandlers = pageReflector.getAllImplementersOf<IPageWillMountHandler>(
					LifeCycle.PageWillMountHandler
				)

				// TB-4458 upon navigation, we want to run all lifecycles that may change props synchronously so that we don't re-render components with partial props
				// TODO things work by chance. we should probably block react rendering during navigation.

				const pageWillMountWithReporting = async (handler: IPageWillMountHandler) => {
					const phaseEnd = navigationPhases.start(`pageWillMount_${handler.name}`)
					if (shouldReportHandler(handler.pageWillMount)) {
						logger.phaseStarted(`pageWillMount_${handler.name}`)
					}
					try {
						await handler.pageWillMount(pageId)
					} catch (e) {
						logger.captureError(new PageInitializerError('pageWillMount failed'), {
							tags: { feature: 'pages', methodName: 'initPage', handler: handler.name },
							extra: { error: e },
						})
						throw e
					}
					phaseEnd()
					if (shouldReportHandler(handler.pageWillMount)) {
						logger.phaseEnded(`pageWillMount_${handler.name}`)
					}
				}

				await Promise.all(
					navigationManager.isFirstNavigation()
						? pageWillMountHandlers.map((handler) => taskify(() => pageWillMountWithReporting(handler)))
						: pageWillMountHandlers.map(pageWillMountWithReporting)
				)
			})

			await Promise.all([
				pageWillMount,
				...appWillLoadPageHandlers.map((handler) =>
					taskify(async () => {
						const phaseEnd = navigationPhases.start(`appWillLoadPage_${handler.name}`)
						if (shouldReportHandler(handler.appWillLoadPage)) {
							logger.phaseStarted(`appWillLoadPage_${handler.name}`)
						}
						try {
							await handler.appWillLoadPage({ pageId, contextId })
						} catch (e) {
							logger.captureError(new PageInitializerError('appWillLoadPage failed'), {
								tags: { feature: 'pages', methodName: 'initPage', handler: handler.name },
								extra: { error: e },
							})
							throw e
						}
						phaseEnd()
						if (shouldReportHandler(handler.appWillLoadPage)) {
							logger.phaseEnded(`appWillLoadPage_${handler.name}`)
						}
					})
				),
			])
			logger.addBreadcrumbToBatch('init_page_phase_durations', navigationPhases.getPhases())
			logger.interactionEnded('init_page')
		},
	})
)
