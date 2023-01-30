import type { Interaction, Phase, LoggerConfig, CreateLoggerApi, ILogger, ServerPerformanceEvent } from './types'
import type { IStartInteractionOptions, IEndInteractionOptions, IAppIdentifier } from '@wix/fedops-logger'
import {
	addTagsFromObject,
	extractFingerprints,
	extractFileNameFromErrorStack,
	shouldFilter,
} from './utils/loggerUtils'
import type { Hub } from '@sentry/types'
import { SSRPerformanceStore } from './utils/SSRPerformanceStore'

declare global {
	interface Window {
		Sentry: Hub & { forceLoad: () => void }
	}
}

export class ErrorWithMinimalStack extends Error {
	constructor(error: Error) {
		super(error.message)
		this.name = error.name

		if (typeof Error.captureStackTrace === 'function') {
			Error.captureStackTrace(this, this.constructor)
		}

		// long stacks freeze the browser during some sentry internal calculation.
		// somewhere here: https://github.com/getsentry/sentry-javascript/blob/668f44ffdb068cd2d0f89085e50c9d1b4dd38295/packages/browser/src/tracekit.ts#L186
		// this is internal crap that can't be unit tested.
		const stack = error.stack
		if (!stack || stack.length <= 2000) {
			return
		}
		this.stack = `${stack.substring(0, 1000)}\n...\n${stack.substring(stack.length - 1000)}`
	}
}

export const createLoggerApi: CreateLoggerApi = ({
	biLoggerFactory,
	fedopsLogger,
	sentry,
	sentryStore,
	errorLimit,
	shouldMuteErrors = false,
	isSsr = false,
	ssrInitialEvents = [],
	onReport = () => {},
}: LoggerConfig): ILogger => {
	let sessionErrorLimit = errorLimit || 99999
	let globalTags = {},
		globalExtras = {}

	const ssrPerformanceStore = SSRPerformanceStore(ssrInitialEvents)
	const ongoingfedops = {
		interactions: 'none',
		phase: 'none',
		errors: 'none',
	}
	if (!isSsr) {
		// @ts-ignore
		window.fedops.ongoingfedops = ongoingfedops
	}

	const updatePageNumber = (pageNumber: number) => {
		biLoggerFactory.updateDefaults({ pn: pageNumber, isFirstNavigation: pageNumber === 1 })
	}
	const updatePageId = (id: string) => {
		biLoggerFactory.updateDefaults({ pageId: id })
	}
	const updateApplicationsMetaSite = (instance: string) => {
		if (instance) {
			biLoggerFactory.updateDefaults({ _mt_instance: instance })
		}
	}

	const getInstance = (forceLoad: boolean = false) => {
		if (!isSsr && forceLoad) {
			window.Sentry.forceLoad()
		}
		// @ts-ignore no force load for type hub - exactly what we need to verify
		if (sentry && !sentry.forceLoad) {
			return sentry
		}
		return window.Sentry
	}

	getInstance().configureScope((scope) => {
		scope.addEventProcessor((event, hint) => {
			// @ts-ignore
			const message = hint?.originalException?.message ? hint?.originalException.message : hint?.originalException
			if (shouldMuteErrors || shouldFilter(message)) {
				return null
			}
			if (sentryStore.release) {
				event.release = sentryStore.release
			}
			event.environment = sentryStore.environment
			event.extra = event.extra || {}
			Object.assign(event.extra, globalExtras)
			event.tags = event.tags || {}
			Object.assign(event.tags, globalTags)
			if (event.level === 'error') {
				ongoingfedops.errors = message
			}
			if (!event.fingerprint) {
				const fingerprints = extractFingerprints(event.exception)
				event.fingerprint = [...fingerprints]
			}
			if (sessionErrorLimit) {
				sessionErrorLimit--
				return event
			}
			return null
		})
		scope.setUser({ id: sentryStore.user })
		addTagsFromObject(scope, {
			...ongoingfedops,
		})
	})

	const captureError = (
		error: Error,
		{
			tags,
			extra,
			groupErrorsBy = 'tags',
			level = 'error',
		}: {
			tags: { [key: string]: string | boolean }
			extra?: { [key: string]: any }
			groupErrorsBy?: 'tags' | 'values'
			level?: string
		}
	) => {
		flushBreadcrumbBatch()
		getInstance(true).withScope((scope: any) => {
			const fingerprints = []
			scope.setLevel(level)
			for (const key in tags) {
				if (tags.hasOwnProperty(key)) {
					scope.setTag(key, tags[key])
					if (groupErrorsBy === 'tags') {
						fingerprints.push(key)
					} else if (groupErrorsBy === 'values') {
						fingerprints.push(tags[key])
					}
				}
			}

			for (const key in extra) {
				if (extra.hasOwnProperty(key)) {
					scope.setExtra(key, extra[key])
				}
			}

			const fileName = error.stack ? extractFileNameFromErrorStack(error.stack) : 'unknownFile'
			scope.setExtra('_fileName', fileName)
			scope.setFingerprint([error.message, fileName, ...fingerprints])

			if (sessionErrorLimit) {
				getInstance().captureException(new ErrorWithMinimalStack(error))
			}
			if (level === 'error') {
				console.log(error) // Sentry capture exception swallows the error
			}
		})
	}

	const addBreadcrumb = (messageContent: any, additionalData = {}) =>
		getInstance().addBreadcrumb({
			message: messageContent,
			data: additionalData,
		})

	const breadcrumb = (messageContent: any, additionalData = {}) => {
		flushBreadcrumbBatch()
		addBreadcrumb(messageContent, additionalData)
	}

	const phaseStarted = (phase: Phase, interactionOptions?: Partial<IAppIdentifier>) => {
		ongoingfedops.phase = ongoingfedops.phase === 'none' ? phase : ongoingfedops.interactions + phase
		getInstance().addBreadcrumb({ message: 'interaction start: ' + phase })
		// @ts-ignore
		fedopsLogger.appLoadingPhaseStart(phase, interactionOptions || {})

		ssrPerformanceStore.addSSRPerformanceEvent(phase + ' started')
		onReport(phase, { start: true })
	}
	const phaseEnded = (phase: Phase, interactionOptions?: Partial<IAppIdentifier>) => {
		ongoingfedops.phase = ongoingfedops.phase === phase ? 'none' : ongoingfedops.interactions.replace(phase, '')
		getInstance().addBreadcrumb({ message: 'interaction end: ' + phase })
		// @ts-ignore
		fedopsLogger.appLoadingPhaseFinish(phase, interactionOptions || {})

		ssrPerformanceStore.addSSRPerformanceEvent(phase + ' ended')
		onReport(phase, { params: { ...interactionOptions } })
	}
	const interactionStarted = (
		interaction: Interaction,
		interactionOptions: Partial<IStartInteractionOptions> = {},
		shouldAddBreadcrumb: boolean = true
	) => {
		ongoingfedops.interactions =
			ongoingfedops.interactions === 'none' ? interaction : ongoingfedops.interactions + interaction
		if (shouldAddBreadcrumb) {
			getInstance().addBreadcrumb({ message: 'interaction start: ' + interaction })
		}
		fedopsLogger.interactionStarted(interaction, interactionOptions)

		ssrPerformanceStore.addSSRPerformanceEvent(interaction + ' started')
		onReport(interaction, { start: true })
	}
	const interactionEnded = (
		interaction: Interaction,
		interactionOptions: Partial<IEndInteractionOptions> = {},
		shouldAddBreadcrumb: boolean = true
	) => {
		ongoingfedops.interactions =
			ongoingfedops.interactions === interaction ? 'none' : ongoingfedops.interactions.replace(interaction, '')
		if (shouldAddBreadcrumb) {
			getInstance().addBreadcrumb({ message: 'interaction end: ' + interaction })
		}
		fedopsLogger.interactionEnded(interaction, interactionOptions)

		ssrPerformanceStore.addSSRPerformanceEvent(interaction + ' ended')
		onReport(interaction)
	}
	const meter = (
		metricName: string,
		interactionOptions: Partial<IStartInteractionOptions> = {},
		shouldAddBreadcrumb: boolean = true
	) => {
		if (shouldAddBreadcrumb) {
			getInstance().addBreadcrumb({ message: 'meter: ' + metricName })
		}
		fedopsLogger.interactionStarted(metricName, interactionOptions)
	}
	if (!isSsr) {
		// @ts-ignore
		window.fedops.phaseStarted = phaseStarted
		// @ts-ignore
		window.fedops.phaseEnded = phaseEnded
	}

	let registerPlatformTenantsInvoked = false

	let breadcrumbsBatch = [] as Array<any>
	const MAX_NUM_OF_BREADCRUMBS_IN_BATCH = 100

	const addBreadcrumbToBatch = (message: string, data = {}) => {
		breadcrumbsBatch.push({ message, ...data })
		if (breadcrumbsBatch.length > MAX_NUM_OF_BREADCRUMBS_IN_BATCH) {
			breadcrumbsBatch = breadcrumbsBatch.slice(-MAX_NUM_OF_BREADCRUMBS_IN_BATCH / 2) // drop first items
			breadcrumbsBatch[0].message = `...tail actions. ${breadcrumbsBatch[0].message}`
		}
	}
	const flushBreadcrumbBatch = () => {
		if (breadcrumbsBatch.length) {
			const breadcrumbsBatchObject = breadcrumbsBatch.reduce((acc, breadcrumbObj, breadcrumbIndex) => {
				acc[`${breadcrumbObj.message} ${breadcrumbIndex}`] = breadcrumbObj
				return acc
			}, {})
			addBreadcrumb('batched breadcrumb', breadcrumbsBatchObject)
			breadcrumbsBatch = []
		}
	}

	return {
		updatePageId,
		updatePageNumber,
		updateApplicationsMetaSite,
		reportAsyncWithCustomKey: <T>(asyncMethod: () => Promise<T>, methodName: string, key: string): Promise<T> => {
			// @ts-ignore FEDINF-1937 missing type
			interactionStarted(methodName, { customParam: { key } })
			return asyncMethod()
				.then(
					(res): Promise<T> => {
						// @ts-ignore FEDINF-1937 missing type
						interactionEnded(methodName, { customParam: { key } })
						return Promise.resolve(res)
					}
				)
				.catch((error) => {
					captureError(error, { tags: { methodName } })
					return Promise.reject(error)
				})
		},
		runAsyncAndReport: async <T>(
			asyncMethod: () => Promise<T>,
			methodName: string,
			reportExeception: boolean = true
		): Promise<T> => {
			try {
				interactionStarted(`${methodName}`)
				const fnResult = await asyncMethod()
				interactionEnded(`${methodName}`)
				return fnResult
			} catch (e) {
				if (reportExeception) {
					captureError(e, { tags: { methodName } })
				}
				throw e
			}
		},
		runAndReport: <T>(method: () => T, methodName: string): T => {
			interactionStarted(methodName)
			try {
				const t = method()
				interactionEnded(methodName)
				return t
			} catch (e) {
				captureError(e, { tags: { methodName } })
				throw e
			}
		},
		captureError,
		setGlobalsForErrors: ({ tags = {}, extra = {} }) => {
			globalExtras = {
				...extra,
				...globalExtras,
			}
			globalTags = {
				...tags,
				...globalTags,
			}
		},
		breadcrumb,
		addBreadcrumbToBatch,
		flushBreadcrumbBatch,
		interactionStarted,
		interactionEnded,
		phaseStarted,
		phaseEnded,
		meter,
		reportAppLoadStarted: () => fedopsLogger.appLoadStarted(),
		appLoaded: (options?: Partial<IAppIdentifier>) => {
			ongoingfedops.phase = 'siteLoaded'
			window.onoffline = () => {}
			window.ononline = () => {}
			// @ts-ignore
			removeEventListener('pagehide', window.fedops.pagehide)
			// @ts-ignore it is possible to pass partial params.
			fedopsLogger.appLoaded(options)
			// TODO FEDINF-4745 fedops to report cwv metrics for appName if "reportBlackbox" is set to true
			if (!registerPlatformTenantsInvoked) {
				fedopsLogger.registerPlatformTenants(['thunderbolt'])
			}
		},
		registerPlatformWidgets: (widgetAppNames: Array<string>) => {
			registerPlatformTenantsInvoked = true
			fedopsLogger.registerPlatformTenants(['thunderbolt', ...widgetAppNames])
		},
		getEventsData: ssrPerformanceStore.getAllSSRPerformanceEvents,
		addSSRPerformanceEvents: (events: Array<ServerPerformanceEvent>) =>
			ssrPerformanceStore.addSSRPerformanceEvents(events),
	}
}
