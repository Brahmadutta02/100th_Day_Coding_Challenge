import _ from 'lodash'
import { ContainerModuleLoader, withDependencies } from '@wix/thunderbolt-ioc'
import {
	LoggerSymbol,
	ILogger,
	LoggerIntegrations,
	IRendererPropsExtender,
	RendererPropsExtenderSym,
} from '@wix/thunderbolt-symbols'
import type { Environment } from '../types/Environment'
import { create } from '@wix/fedops-logger'
import {
	commonBiLoggerFactory,
	createFedopsLogger,
	getBiStore,
	createConsoleLogger,
	createNoopLogger,
	getEnvironment,
	multipleIncludes,
} from '@wix/thunderbolt-commons'
import { factory } from '@wix/fe-essentials-viewer-platform/bi'
// @ts-ignore
import { createLoggerApi } from '@wix/thunderbolt-logger'
import { WarmupDataEnricherSymbol } from 'feature-warmup-data'
import SsrEventDataManager from './ssrEventDataManager'

const DEV_QUERY_PARAMS = [
	'viewerSource',
	'experiments',
	'WixCodeRuntimeSource',
	'debug',
	'debugViewer',
	'isWixCodeIntegration',
	'isqa',
]

export function createLogger(loggerIntegrations: LoggerIntegrations): ILogger {
	const { sentry, wixBiSession, viewerModel, fetch, ssrInitialEvents, onReport } = loggerIntegrations
	const mode = viewerModel && viewerModel.mode ? viewerModel.mode : { qa: true }
	const isSsr = !process.env.browser
	const url = viewerModel.requestUrl
	const shouldSendByUrls = multipleIncludes(url, DEV_QUERY_PARAMS)

	if ((mode.qa || !sentry || shouldSendByUrls) && !url.includes('forceReport')) {
		return createNoopLogger()
	}
	if (url.includes('consoleReport')) {
		return createConsoleLogger()
	}

	const biStore = getBiStore(wixBiSession, viewerModel)
	const biLoggerFactory = commonBiLoggerFactory.createBiLoggerFactoryForFedops({
		sessionManager: {
			getVisitorId: _.noop,
			getSiteMemberId: _.noop,
		},
		biStore,
		fetch,
		muteBi: viewerModel.requestUrl.includes('suppressbi=true'),
		factory,
		...(url.includes('disableBiLoggerBatch=true') ? { useBatch: false } : {}),
	})
	const fedopsLogger = createFedopsLogger({
		biLoggerFactory,
		phasesConfig: 'SEND_START_AND_FINISH',
		appName: viewerModel.site && viewerModel.site.isResponsive ? 'thunderbolt-responsive' : 'thunderbolt',
		reportBlackbox: true,
		paramsOverrides: { is_rollout: biStore.is_rollout },
		factory: create,
		muteThunderboltEvents: wixBiSession.muteThunderboltEvents,
	})
	const release = process.env.browser ? window.thunderboltVersion : process.env.APP_VERSION
	const sentryStore = {
		release: release && `${release}`.startsWith('1') ? release : null,
		environment: getEnvironment(viewerModel.fleetConfig.code),
		user: `${wixBiSession.viewerSessionId}`,
	}
	const logger = createLoggerApi({
		biLoggerFactory,
		fedopsLogger,
		sentry,
		sentryStore,
		shouldMuteErrors: biStore.isCached || wixBiSession.isjp,
		errorLimit: 50,
		isSsr,
		ssrInitialEvents,
		onReport,
	})
	if (!isSsr) {
		removeEventListener('error', window.fedops.reportError)
		removeEventListener('unhandledrejection', window.fedops.reportError)
		addEventListener(
			'offline',
			() => {
				logger.meter('offline')
			},
			true
		)
		addEventListener(
			'online',
			() => {
				logger.meter('online')
			},
			true
		)
		let pageVisibilty = 'visible'
		const pagehide = () => {
			const { visibilityState } = document
			if (visibilityState !== pageVisibilty) {
				pageVisibilty = visibilityState
				logger.meter(visibilityState)
			}
		}
		addEventListener('pagehide', pagehide, true)
		addEventListener('visibilitychange', pagehide, true)
		pagehide()
	}
	sentry.configureScope((scope: any) => {
		scope.addEventProcessor((event: any, hint?: any) => {
			if (event.release && `${event.release}`.startsWith('1') && hint?.originalException?.message) {
				const { message, name } = hint.originalException
				if (name && name.indexOf('ChunkLoadError') > -1) {
					event.fingerprint = ['ChunkLoadError']
				}
				if (event.level === 'error') {
					logger.meter('error', {
						paramsOverrides: {
							evid: 26,
							errorInfo: message,
							errorType: name,
							eventString: hint.event_id,
							tags: event.tags,
						},
					}) // this is a workaround to get error rate until we will have support for postgresSQL in fedonomy
				}
				return event
			}
			return null
		})
	})

	logger.setGlobalsForErrors({
		tags: { url: viewerModel.requestUrl, isSsr: !process.env.browser, ...viewerModel.deviceInfo },
		extra: { experiments: viewerModel.experiments },
	})
	return logger
}

const rendererPropsExtender = withDependencies(
	[LoggerSymbol],
	(logger: ILogger): IRendererPropsExtender => {
		return {
			async extendRendererProps() {
				return { logger }
			},
		}
	}
)

export const site = ({ logger }: Environment): ContainerModuleLoader => (bind) => {
	bind(LoggerSymbol).toConstantValue(logger)
	bind(WarmupDataEnricherSymbol).to(SsrEventDataManager)
	bind(RendererPropsExtenderSym).to(rendererPropsExtender)
}
