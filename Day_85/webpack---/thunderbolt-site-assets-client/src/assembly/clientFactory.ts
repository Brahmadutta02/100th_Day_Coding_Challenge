import { createSiteAssetsClientAdapter } from '../siteAssetsClientAdapter'
import { Experiments, FetchFn, SiteAssetsClientTopology, ViewerModel } from '@wix/thunderbolt-symbols'
import {
	SiteAssetsClientConfig,
	SiteAssetsMetricsReporter,
	SiteAssetsModuleFetcher,
	SiteAssetsTopology,
} from '@wix/site-assets-client'

import type {
	ClientSACFactoryParams,
	SiteAssetsClientAdapter,
	ToRequestLevelSACFactoryParamsFromSpreadedViewerModel,
} from '../types'
import { shouldRouteStagingRequest } from '../adapters/configResolvers'

const toSiteAssetsTopology = (clientTopology: SiteAssetsClientTopology): SiteAssetsTopology => {
	const { mediaRootUrl, staticMediaUrl, siteAssetsUrl, moduleRepoUrl, fileRepoUrl } = clientTopology

	return {
		mediaRootUrl,
		staticMediaUrl,
		siteAssetsServerUrl: siteAssetsUrl,
		siteAssetsV2ServerUrl: siteAssetsUrl, // client env is publicEnv, so v2 is same as v1 anyway
		moduleRepoUrl,
		fileRepoUrl,
	}
}

export const toClientSACFactoryParams = ({
	viewerModel,
	fetchFn,
	siteAssetsMetricsReporter,
	moduleFetcher,
}: {
	viewerModel: ViewerModel
	fetchFn: FetchFn
	siteAssetsMetricsReporter: SiteAssetsMetricsReporter
	moduleFetcher: SiteAssetsModuleFetcher
	experiments: Experiments
}) => {
	const {
		requestUrl,
		siteAssets,
		fleetConfig,
		deviceInfo,
		mode: { qa: qaMode, debug: debugMode, enableTestApi: testMode },
		experiments,
		anywhereConfig,
	} = viewerModel

	return toClientSACFactoryParamsFrom({
		siteAssets,
		deviceInfo,
		qa: qaMode,
		enableTestApi: testMode,
		debug: debugMode,
		requestUrl: anywhereConfig?.url || requestUrl,
		isStagingRequest: shouldRouteStagingRequest(fleetConfig),
		fetchFn,
		siteAssetsMetricsReporter,
		moduleFetcher,
		experiments,
		anywhereThemeOverride: anywhereConfig?.themeOverride,
	})
}

export const toClientSACFactoryParamsFrom = ({
	siteAssets,
	requestUrl,
	qa,
	enableTestApi,
	debug,
	deviceInfo,
	fetchFn,
	siteAssetsMetricsReporter,
	moduleFetcher,
	isStagingRequest,
	experiments,
	anywhereThemeOverride,
}: ToRequestLevelSACFactoryParamsFromSpreadedViewerModel & {
	isStagingRequest?: boolean
	moduleFetcher: SiteAssetsModuleFetcher
	siteAssetsMetricsReporter: SiteAssetsMetricsReporter
	fetchFn: FetchFn
}) => {
	const {
		clientTopology,
		manifests,
		dataFixersParams,
		siteScopeParams,
		beckyExperiments,
		staticHTMLComponentUrl,
		remoteWidgetStructureBuilderVersion,
	} = siteAssets

	return {
		fetchFn,
		clientTopology,
		siteAssetsMetricsReporter,
		manifests,
		timeout: 4000,
		dataFixersParams,
		requestUrl,
		siteScopeParams,
		moduleFetcher,
		isStagingRequest,
		beckyExperiments,
		staticHTMLComponentUrl,
		remoteWidgetStructureBuilderVersion,
		deviceInfo,
		qaMode: qa,
		testMode: enableTestApi,
		debugMode: debug,
		experiments,
		anywhereThemeOverride,
	}
}

export const createClientSAC = ({
	fetchFn,
	clientTopology,
	siteAssetsMetricsReporter,
	manifests,
	timeout,
	dataFixersParams,
	requestUrl,
	siteScopeParams,
	moduleFetcher,
	isStagingRequest,
	beckyExperiments,
	staticHTMLComponentUrl,
	remoteWidgetStructureBuilderVersion,
	deviceInfo,
	qaMode,
	testMode,
	debugMode,
	experiments,
	anywhereThemeOverride,
}: ClientSACFactoryParams): SiteAssetsClientAdapter => {
	const topology = toSiteAssetsTopology(clientTopology)
	const isBrowser = !!process.env.browser
	const config: SiteAssetsClientConfig = {
		moduleTopology: {
			publicEnvironment: topology,
			environment: topology,
		},
		staticsTopology: {
			timeout,
			baseURLs: clientTopology.pageJsonServerUrls,
		},
		isStagingRequest,
		artifactId: 'wix-thunderbolt-client',
		isBrowser,
	}

	return createSiteAssetsClientAdapter({
		fetchFn,
		config,
		siteAssetsMetricsReporter,
		manifests,
		moduleFetcher,
		timeout: 4000,
	})({
		dataFixersParams,
		requestUrl,
		siteScopeParams,
		beckyExperiments,
		staticHTMLComponentUrl,
		remoteWidgetStructureBuilderVersion,
		deviceInfo,
		qaMode,
		testMode,
		debugMode,
		experiments,
		anywhereThemeOverride,
	})
}
