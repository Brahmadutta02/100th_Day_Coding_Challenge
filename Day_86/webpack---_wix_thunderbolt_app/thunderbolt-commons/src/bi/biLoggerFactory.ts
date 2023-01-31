import { PublishMethods } from '@wix/fe-essentials-viewer-platform/bi'
import { BaseFactory, FetchFn } from '@wix/thunderbolt-symbols'
import type { FactoryOptions } from './types'

function calculateTSN({ initialRequestTimestamp }: { initialRequestTimestamp: number }) {
	if (!process.env.browser) {
		// SSR - no performance api until we move to node 19
		return Math.round(Date.now() - initialRequestTimestamp)
	}
	if (typeof window === 'undefined') {
		// Worker - now is from worker start so we need to add the main thread diff
		return Math.round(performance.now() + (performance.timeOrigin - initialRequestTimestamp))
	}
	// browser - main thread
	return Math.round(performance.now())
}

/**
 * Base BI logger factory, should be used as a basis for any BI logger in the Viewer
 *
 * - Initialized with base defaults (which are supported globally in the BI schema).
 * - Any additional defaults should be added via specialized factories, like FedOps,
 *   and only after making sure the BI schema supports them.
 *
 * Please use #bi-logger-support for any questions
 */

const createBaseBiLoggerFactory = ({
	useBatch = true,
	publishMethod = process.env.browser ? PublishMethods.Auto : PublishMethods.Fetch,
	endpoint,
	muteBi = process.env.browser ? false : true,
	biStore,
	sessionManager,
	fetch,
	factory,
}: FactoryOptions): BaseFactory => {
	const biLoggerFactory = factory({
		useBatch,
		publishMethod,
		endpoint,
		...(biStore.frogUrlOverride ? { host: biStore.frogUrlOverride.replace(/^https?:\/\//, '') + '/_frog' } : {}),
	})
		.setMuted(muteBi)
		.withUoUContext({ msid: biStore.msid })
		.withNonEssentialContext({
			// @ts-expect-error - @antonp kindly fix types
			visitorId: () => sessionManager.getVisitorId(),
			// @ts-expect-error - @antonp kindly fix types
			siteMemberId: () => sessionManager.getSiteMemberId(),
		})
		.updateDefaults({
			vsi: biStore.viewerSessionId,
			_av: `thunderbolt-${biStore.viewerVersion}`,
			isb: biStore.is_headless,
			...(biStore.is_headless && { isbr: biStore.is_headless_reason }),
		})

	if (!process.env.browser) {
		const fetchWithProtocol: FetchFn = (url, options) => fetch(`https:${url}`, options)
		biLoggerFactory.withPublishFunction({
			[PublishMethods.Fetch]: fetchWithProtocol,
		})
	}

	return biLoggerFactory
}

/**
 * BI logger factory for FedOps
 *
 * - Initialized with base defaults + defaults which are supported by FedOps BI events
 *   https://bo.wix.com/bi-catalog-webapp/#/sources/72
 *
 * - Any additional defaults should be added only after making sure the BI schema supports them
 *
 * Please use #bi-logger-support for any questions
 */
const createBiLoggerFactoryForFedops = (options: FactoryOptions) => {
	const {
		biStore: {
			session_id,
			initialTimestamp,
			initialRequestTimestamp,
			dc,
			microPop,
			is_headless,
			isCached,
			pageData,
			rolloutData,
			caching,
			checkVisibility = () => '',
			viewerVersion,
			requestUrl,
			st,
		},
		muteBi = false,
	} = options

	return createBaseBiLoggerFactory({ ...options, muteBi }).updateDefaults({
		ts: () => Date.now() - initialTimestamp,
		// this computation is worker compatible cause performance.now() in the worker is computed from worker initialization time
		tsn: () => calculateTSN({ initialRequestTimestamp }),
		dc,
		microPop,
		caching,
		session_id,
		st,
		url: requestUrl || pageData.pageUrl,
		ish: is_headless,
		pn: pageData.pageNumber,
		isFirstNavigation: pageData.pageNumber === 1,
		pv: checkVisibility,
		pageId: pageData.pageId,
		isServerSide: !process.env.browser,
		is_lightbox: pageData.isLightbox,
		is_cached: isCached,
		is_sav_rollout: rolloutData.siteAssetsVersionsRollout ? 1 : 0,
		is_dac_rollout: rolloutData.isDACRollout ? 1 : 0,
		v: viewerVersion,
	})
}

export const commonBiLoggerFactory = {
	createBaseBiLoggerFactory,
	createBiLoggerFactoryForFedops,
}
