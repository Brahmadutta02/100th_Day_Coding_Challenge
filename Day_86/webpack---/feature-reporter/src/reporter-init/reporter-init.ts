import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	WixBiSessionSymbol,
	FeatureStateSymbol,
	SiteFeatureConfigSymbol,
	BusinessLoggerSymbol,
	ExperimentsSymbol,
} from '@wix/thunderbolt-symbols'
import { ConsentPolicySymbol } from 'feature-consent-policy'
import { UrlHistoryManagerSymbol } from 'feature-router'
import { IReporterInit, ReporterState } from '../types'
import { name } from '../symbols'
import { setState } from '../utils'
import { init } from './init'

const initialState: Partial<ReporterState> = {
	pageNumber: 1,
	tagManagerReady: false,
	sendDeferredPageView: () => {},
}

const reporterInit: IReporterInit = (
	featureState,
	siteConfig,
	wixBiSession,
	businessLogger,
	experiments,
	consentPolicy,
	urlHistoryManager
) => ({
	appWillMount() {
		setState(featureState, initialState)

		const shouldInitReporter = !wixBiSession.suppressbi
		if (shouldInitReporter) {
			init(siteConfig, wixBiSession, businessLogger, featureState, consentPolicy, urlHistoryManager)
		}
	},
})

export const ReporterInit = withDependencies(
	[
		named(FeatureStateSymbol, name),
		named(SiteFeatureConfigSymbol, name),
		WixBiSessionSymbol,
		BusinessLoggerSymbol,
		ExperimentsSymbol,
		ConsentPolicySymbol,
		UrlHistoryManagerSymbol,
	],
	reporterInit
)
