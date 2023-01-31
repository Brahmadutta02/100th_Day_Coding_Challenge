import _ from 'lodash'
import Raven from '@wix/fe-essentials-viewer-platform/raven-js'
import { factory } from '@wix/fe-essentials-viewer-platform/bi'
import { createFedopsLogger, extractFileNameFromErrorStack, extractFingerprints, getEnvironment } from '@wix/thunderbolt-commons'
import { create } from '@wix/fedops-logger'
import type { IAppIdentifier, IEndInteractionOptions, IStartInteractionOptions } from '@wix/fedops-logger'
import type { Interaction, IPlatformLogger, BreadCrumbOption, ViewerAppsUrls, Phase, SessionServiceAPI } from '@wix/thunderbolt-symbols'
import type { BootstrapData } from '../types'
import type { IUnfinishedTasks } from './types'
import { platformBiLoggerFactory } from './bi/biLoggerFactory'
import { WixCodeAppDefId, WixCodeSentryDsn } from './constants'
import { PlatformPerformanceStore, PlatformPerformanceStoreType } from './bi/PlatformPerformanceStore'
import { LogOptions } from '@wix/thunderbolt-ssr-api'

function getSentryDsn(appsUrlData: ViewerAppsUrls, appDefinitionId: string, widgetId?: string): string {
	if (appDefinitionId === WixCodeAppDefId) {
		return WixCodeSentryDsn
	}

	// https://sentry.wixpress.com/sentry/platform-apps/
	const platformAppsDsn = 'https://76e577208263430cb7ab8e220bd84349@sentry.wixpress.com/806'

	const appDsn = _.get(appsUrlData, [appDefinitionId, 'errorReportingUrl']) || platformAppsDsn
	if (widgetId) {
		// Use app dsn as default when looking for component dsn.
		return _.get(appsUrlData, [appDefinitionId, 'widgets', widgetId, 'errorReportingUrl']) || appDsn
	}

	return appDsn
}

type CaptureErrorParams = { tags: { [_key: string]: string | boolean }; extra?: { [_key: string]: any }; groupErrorsBy?: 'tags' | 'values'; warning?: boolean; level?: Raven.LogLevel }

export const PlatformLogger = (
	bootstrapData: BootstrapData,
	sessionService: Pick<SessionServiceAPI, 'getVisitorId' | 'getSiteMemberId' | 'getInstance'>,
	unfinishedTasks: IUnfinishedTasks,
	platformPerformanceStore: PlatformPerformanceStoreType = PlatformPerformanceStore(),
	ssrLog?: (message: string, opts?: LogOptions) => void
): IPlatformLogger => {
	let ongoingInteractions = 'none'

	const muteThunderboltEvents = bootstrapData.platformEnvData.bi.muteThunderboltEvents

	const {
		appsUrlData,
		platformEnvData: {
			window: { isSSR },
			bi: biData,
			location,
			site,
		},
	} = bootstrapData

	function addSsrLog(message: string, opts?: LogOptions) {
		if (ssrLog && isSSR) {
			ssrLog(message, opts)
		}
	}

	const biLoggerFactory = platformBiLoggerFactory({
		sessionService,
		biData,
		location,
		site,
		factory,
	}).createBiLoggerFactoryForFedops(biData.muteFedops)
	const fedopsLogger = createFedopsLogger({
		biLoggerFactory,
		factory: create,
		phasesConfig: 'SEND_START_AND_FINISH',
		paramsOverrides: { is_rollout: biData.rolloutData.isTBRollout },
		muteThunderboltEvents,
	})

	// Cache reports by dsn, to avoid creating more than one of each.
	const reporters: { [dsn: string]: { captureError: (error: Error, params: CaptureErrorParams) => void; reporter: Raven.RavenStatic; sessionErrorLimit: number } } = {}

	const createReporter = (dsn: string, errorInteractionName: string = '') => {
		if (reporters[dsn]) {
			return reporters[dsn]
		}
		// Using "new Client()" to avoid altering the global raven. See raven-js/src/singleton.js
		// @ts-ignore
		const reporter = new Raven.Client()
		reporter.config(dsn, {
			tags: {
				platform: 'true',
				url: location.rawUrl,
				isSSR: `${isSSR}`,
				isCached: `${biData.isCached}`,
				isFirstPage: `${biData.pageData.pageNumber === 1}`,
				isPreview: biData.isPreview,
				isLightbox: biData.pageData.isLightbox,
			},
			extra: biData,
			environment: getEnvironment(biData.fleetConfig.code),
			release: biData.viewerVersion,
		})

		reporter.setUserContext({ id: location.metaSiteId, uuid: biData.ownerId })

		reporter.setDataCallback((event: any, originalCallback = _.identity) => {
			event.fingerprint = event.fingerprint || extractFingerprints(event.exception)
			event.tags = _.assign(event.tags, { interactions: ongoingInteractions })
			if (errorInteractionName && event.level === 'error') {
				fedopsLogger.interactionStarted(errorInteractionName, { customParams: { errorMessage: event.message } })
			}
			if (reporters[dsn].sessionErrorLimit) {
				reporters[dsn].sessionErrorLimit--
				return originalCallback(event)
			}
			return null
		})

		const captureError = (error: Error, { tags, extra, groupErrorsBy = 'tags', warning = false, level = 'error' }: CaptureErrorParams) => {
			const stringTags = _.mapValues(tags, (value) => `${value}`) as { [tagName: string]: string }
			const fingerprints: Array<string> = []
			for (const tagName in stringTags) {
				if (stringTags.hasOwnProperty(tagName)) {
					if (groupErrorsBy === 'tags') {
						fingerprints.push(tagName)
					} else if (groupErrorsBy === 'values') {
						fingerprints.push(stringTags[tagName])
					}
				}
			}
			const fileName = error.stack ? extractFileNameFromErrorStack(error.stack) : 'unknownFile'

			if (warning) {
				console.warn(error)
			} else {
				console.error(error)
			}

			if (reporters[dsn].sessionErrorLimit) {
				reporter.captureException(error, {
					tags: stringTags,
					extra,
					level,
					fingerprint: [error.message, fileName, ...fingerprints],
				})
			}
		}

		reporters[dsn] = { captureError, reporter, sessionErrorLimit: 50 }
		return reporters[dsn]
	}

	const { captureError: capturePlatformError, reporter: platformRaven } = createReporter('https://e0ad700df5e446b5bfe61965b613e52d@sentry.wixpress.com/715', 'platform_error')

	const interactionStarted = (interaction: Interaction, interactionOptions?: Partial<IStartInteractionOptions>) => {
		ongoingInteractions = ongoingInteractions === 'none' ? interaction : ongoingInteractions + interaction
		platformRaven.captureBreadcrumb({ message: 'interaction start: ' + interaction })
		fedopsLogger.interactionStarted(`platform_${interaction}`, interactionOptions || {})
		platformPerformanceStore.addPlatformPerformanceEvent(`platform_${interaction} started`)
		addSsrLog(`platform_${interaction}`, { start: true })
	}

	const interactionEnded = (interaction: Interaction, interactionOptions?: Partial<IEndInteractionOptions>) => {
		ongoingInteractions = ongoingInteractions === interaction ? 'none' : ongoingInteractions.replace(interaction, '')
		platformRaven.captureBreadcrumb({ message: 'interaction end: ' + interaction })
		fedopsLogger.interactionEnded(`platform_${interaction}`, interactionOptions || {})
		platformPerformanceStore.addPlatformPerformanceEvent(`platform_${interaction} ended`)
		addSsrLog(`platform_${interaction}`)
	}

	const meter = (metricName: string, interactionOptions?: Partial<IStartInteractionOptions>) => {
		platformRaven.captureBreadcrumb({ message: 'meter: ' + metricName })
		fedopsLogger.interactionStarted(`platform_${metricName}`, interactionOptions || {})
	}

	const reportAsyncWithCustomKey = async <T>(methodName: string, key: string, asyncMethod: () => Promise<T>): Promise<T> => {
		try {
			// @ts-ignore @shahaf fedops logger does not have a 'customParam' prop, it's 'customParams' and expects an object
			interactionStarted(methodName, { customParam: key })
			const fnResult = await asyncMethod()
			// @ts-ignore @shahaf fedops logger does not have a 'customParam' prop, it's 'customParams' and expects an object
			interactionEnded(methodName, { customParam: key })
			return fnResult
		} catch (e) {
			capturePlatformError(e, { tags: { methodName } })
			throw e
		}
	}

	const runAndReport = <T>(methodName: string, method: () => T): T => {
		try {
			interactionStarted(methodName)
			const result = method()
			interactionEnded(methodName)
			return result
		} catch (e) {
			capturePlatformError(e, { tags: { methodName } })
			throw e
		}
	}

	const runAsyncAndReport = async <T>(methodName: string, asyncMethod: () => Promise<T> | T): Promise<T> => {
		const removeUnfinishedTask = unfinishedTasks.add(methodName)

		try {
			interactionStarted(methodName)
			const result = await asyncMethod()
			interactionEnded(methodName)
			return result
		} catch (e) {
			capturePlatformError(e, { tags: { methodName } })
			throw e
		} finally {
			removeUnfinishedTask()
		}
	}

	const withReportingAndErrorHandling: IPlatformLogger['withReportingAndErrorHandling'] = async (phase, asyncMethod, params) => {
		const { appDefinitionId, controllerType, controllerCompId } = params
		const phaseNameIncludingIds = `${phase}_${appDefinitionId}${controllerType ? `_${controllerType}` : ''}`
		const removeUnfinishedTask = unfinishedTasks.add(phaseNameIncludingIds)
		const appIdentifier: IAppIdentifier = { appId: appDefinitionId, widgetId: controllerType, paramsOverrides: {} }

		try {
			if (controllerCompId) {
				appIdentifier.paramsOverrides!.corrId = controllerCompId
			}

			platformPerformanceStore.addPlatformPerformanceEvent(`${phaseNameIncludingIds} started`)
			fedopsLogger.appLoadingPhaseStart(phase, appIdentifier)
			addSsrLog(`platform_${phaseNameIncludingIds}`, { start: true })
			const result = await asyncMethod()
			fedopsLogger.appLoadingPhaseFinish(phase, appIdentifier)
			addSsrLog(`platform_${phaseNameIncludingIds}`, { params: { ...appIdentifier } })
			platformPerformanceStore.addPlatformPerformanceEvent(`${phaseNameIncludingIds} ended`)

			return result
		} catch (e) {
			const error = _.isError(e) ? e : new Error(e)
			reportAppError(error, phase, params)
			addSsrLog(`platform_${phaseNameIncludingIds}`, { params: { ...appIdentifier, error }, level: 'error' })
			return Promise.resolve(null)
		} finally {
			removeUnfinishedTask()
		}
	}

	const reportAppPhasesNetworkAnalysis = (appId: string) => fedopsLogger.reportAppPhasesNetworkAnalysis({ appId })

	const reportAppError = (error: Error, phase: Phase, params: { appDefinitionId: string; controllerType?: string }) => {
		const dsn = getSentryDsn(appsUrlData, params.appDefinitionId, params.controllerType)
		const { captureError: captureAppError } = createReporter(dsn)
		captureAppError(error, { tags: { phase } })
	}

	return {
		interactionStarted,
		interactionEnded,
		meter,
		captureError: capturePlatformError,
		reportAsyncWithCustomKey,
		runAsyncAndReport,
		runAndReport,
		captureBreadcrumb: (options: BreadCrumbOption) => platformRaven.captureBreadcrumb(options),
		withReportingAndErrorHandling,
		reportAppPhasesNetworkAnalysis,
	}
}
