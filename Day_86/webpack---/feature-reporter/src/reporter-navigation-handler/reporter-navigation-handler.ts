import { named, withDependencies } from '@wix/thunderbolt-ioc'
import {
	FeatureStateSymbol,
	IPageDidMountHandler,
	IReporterOptions,
	MasterPageFeatureConfigSymbol,
	pageIdSym,
	SiteFeatureConfigSymbol,
	ExperimentsSymbol,
} from '@wix/thunderbolt-symbols'
import { IUrlHistoryManager, UrlHistoryManagerSymbol, IPageNumber, PageNumberSymbol } from 'feature-router'
import { IReporterApi, ReporterMasterPageConfig, ReporterSiteConfig, ReporterState } from '../types'
import { ReporterSymbol, name } from '../symbols'
import { reportPageView } from '../report-page-view'
import { SeoSiteSymbol, ISeoSiteApi } from 'feature-seo'
import { ConsentPolicySymbol, IConsentPolicy } from 'feature-consent-policy'
import { IFeatureState } from 'thunderbolt-feature-state'
import { isUserConsentProvided, setState } from '../utils'

const reporterNavigationHandlerFactory = (
	reporterApi: IReporterApi,
	featureState: IFeatureState<ReporterState>,
	masterPageConfig: ReporterMasterPageConfig,
	siteConfig: ReporterSiteConfig,
	urlHistoryManager: IUrlHistoryManager,
	consentPolicy: IConsentPolicy,
	pageNumberApi: IPageNumber,
	seoApi: ISeoSiteApi,
	pageId: string
): IPageDidMountHandler => ({
	pageDidMount: async () => {
		if (pageId === 'masterPage') {
			return
		}
		const pageNumber = pageNumberApi.getPageNumber()
		const pageViewPayload = {
			masterPageConfig,
			siteConfig,
			reporterApi,
			parsedUrl: urlHistoryManager.getParsedUrl(),
			pageNumber,
			pageId,
			pageTitle: pageNumber > 1 ? await seoApi.getPageTitle() : window.document.title,
		}

		// always report to listeners
		sendPageView({ reportToListenersOnly: true })

		// report to channels once consent is provided
		if (isUserConsentProvided(consentPolicy)) {
			if (featureState.get().tagManagerReady) {
				sendPageView({ reportToChannelsOnly: true })
			} else {
				setState(featureState, { sendDeferredPageView })
			}
		} else {
			window!.document.addEventListener('consentPolicyChanged', onConsentPolicyChanged, { once: true })
		}

		function onConsentPolicyChanged() {
			const { policy } = consentPolicy.getCurrentConsentPolicy()
			if (policy?.analytics || policy?.advertising) {
				setState(featureState, { sendDeferredPageView })
			}
		}

		function sendDeferredPageView() {
			sendPageView({ reportToChannelsOnly: true })
		}

		function sendPageView(reporterOptions: IReporterOptions) {
			reportPageView({ ...pageViewPayload, reporterOptions })
		}
	},
})

export const ReporterNavigationHandler = withDependencies(
	[
		ReporterSymbol,
		named(FeatureStateSymbol, name),
		named(MasterPageFeatureConfigSymbol, name),
		named(SiteFeatureConfigSymbol, name),
		UrlHistoryManagerSymbol,
		ConsentPolicySymbol,
		PageNumberSymbol,
		SeoSiteSymbol,
		pageIdSym,
		ExperimentsSymbol,
	],
	reporterNavigationHandlerFactory
)
