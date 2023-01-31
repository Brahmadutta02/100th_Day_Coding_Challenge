import type { ViewerModel, WixBiSession } from '@wix/thunderbolt-symbols'
import { isBot } from './isBot'
import { isSuspectedBot } from './isSuspectedBot'
import { isIFrame } from './isIFrame'
import { extractCachingData } from './cachingData'

/** copied from https://github.com/wix-private/thunderbolt/blob/917d6d1314087b4d64f2265bef50010f597b6599/packages/thunderbolt-commons/src/bi/constants.ts#L33
 * since we need bi module to run as early as possible to send the beats it cant wait for thunderbolt-commons to load.
 * */
const MUTING_PERCENTAGE = 90 / 100 // THE PERCENTAGE OF EVENTS THAT WILL BE MUTED
export const shouldMuteThunderboltEvents = ({
	requestUrl,
	interactionSampleRatio,
}: {
	requestUrl: string
	interactionSampleRatio: number
}) => {
	const getSampleRatioConfig = () => (interactionSampleRatio ? 1 - interactionSampleRatio : MUTING_PERCENTAGE)
	const searchParam = new URL(requestUrl).searchParams
	if (searchParam.has('sampleEvents')) {
		return searchParam.get('sampleEvents') === 'true'
	}

	return Math.random() < getSampleRatioConfig()
}

const SITE_TYPES: Record<ViewerModel['site']['siteType'], WixBiSession['st']> = {
	WixSite: 1,
	UGC: 2,
	Template: 3,
}

const isInSEO = ({ seo }: { [key: string]: any }) => (seo?.isInSEO ? 'seo' : '')

export default (): WixBiSession => {
	const {
		fedops,
		viewerModel: { siteFeaturesConfigs, requestUrl, site, fleetConfig, commonConfig, interactionSampleRatio },
	} = window

	const muteThunderboltEvents = shouldMuteThunderboltEvents({ requestUrl, interactionSampleRatio })

	const btype = isBot(window) || isIFrame() || isSuspectedBot() || isInSEO(siteFeaturesConfigs)

	return {
		suppressbi: requestUrl.includes('suppressbi=true'),
		initialTimestamp: window.initialTimestamps.initialTimestamp,
		initialRequestTimestamp: window.initialTimestamps.initialRequestTimestamp,
		viewerSessionId: fedops.vsi,
		viewerName: site.isResponsive ? 'thunderbolt-responsive' : 'thunderbolt',
		siteRevision: String(site.siteRevision),
		msId: site.metaSiteId,
		is_rollout: fleetConfig.code === 0 || fleetConfig.code === 1 ? fleetConfig.code : null,
		is_platform_loaded: 0,
		requestUrl: encodeURIComponent(requestUrl),
		sessionId: String(site.sessionId),
		btype,
		isjp: !!btype,
		dc: site.dc,
		siteCacheRevision: '__siteCacheRevision__',
		checkVisibility: (() => {
			let alwaysVisible = true

			function checkVisibility() {
				alwaysVisible = alwaysVisible && document.hidden !== true
			}

			document.addEventListener('visibilitychange', checkVisibility, { passive: true })
			checkVisibility()
			return () => {
				checkVisibility()
				return alwaysVisible
			}
		})(),
		...extractCachingData(),
		isMesh: 1,
		st: SITE_TYPES[site.siteType] || 0,
		commonConfig,
		muteThunderboltEvents,
	}
}
