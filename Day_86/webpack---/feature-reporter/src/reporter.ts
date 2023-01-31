import { withDependencies, named } from '@wix/thunderbolt-ioc'
import type { IReporterApi, ReporterSiteConfig } from './types'
import type { TrackEvent } from '@wix/thunderbolt-symbols'
import { SessionManagerSymbol, ISessionManager } from 'feature-session-manager'

import { name } from './symbols'
import { SiteFeatureConfigSymbol, FeatureExportsSymbol } from '@wix/thunderbolt-symbols'
import { enrichEventOptions } from './event-options'
import { resolveEventParams } from './resolve-event-params'
import { IFeatureExportsStore } from 'thunderbolt-feature-exports'

const reporterFactory = (
	siteConfig: ReporterSiteConfig,
	sessionManager: ISessionManager,
	reporterExports: IFeatureExportsStore<typeof name>
): IReporterApi => {
	const trackEvent: TrackEvent = async (event, { reportToChannelsOnly, reportToListenersOnly } = {}) => {
		const { eventName, params = {}, options = {} } = event
		const eventParams = resolveEventParams(params as Record<string, string>, sessionManager)
		const eventOptions = enrichEventOptions(options, siteConfig)
		const api = await import('./api' /* webpackChunkName: "reporter-api" */)

		if (reportToListenersOnly) {
			return api.trackEventToListenersOnly(eventName, eventParams, eventOptions)
		}

		if (reportToChannelsOnly) {
			api.trackEventToChannelsOnly(eventName, eventParams, eventOptions)
		} else {
			api.trackEvent(eventName, eventParams, eventOptions)
		}
	}

	reporterExports.export({ trackEvent })
	return {
		trackEvent,
	}
}

export const Reporter = withDependencies(
	[named(SiteFeatureConfigSymbol, name), SessionManagerSymbol, named(FeatureExportsSymbol, name)],
	reporterFactory
)
