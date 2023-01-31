import type { WixBiSession } from '@wix/thunderbolt-symbols'
import type { DynamicSessionData } from './biModule'

export type BiEventParams = {
	eventType: number
	ts: number
	tts: number
	extra?: string
}

const OMIT_PARAM = null

function getQueryParamBuilder([key, value]: [string, any]) {
	return value !== OMIT_PARAM && `${key}=${value}`
}

function createExtraParamsHandler(extra: string) {
	const _extra = extra.split('&').reduce((result: Record<string, string>, curr: string) => {
		const [p, v] = curr.split('=')
		return {
			...result,
			[p]: v,
		}
	}, {})
	return (key: string, value: string | number | null) => (_extra[key] !== undefined ? _extra[key] : value)
}

function createBiSessionHandler(wixBiSession: WixBiSession) {
	return <K extends keyof WixBiSession>(key: K) =>
		typeof wixBiSession[key] === 'undefined' ? OMIT_PARAM : wixBiSession[key]
}

function extractCookie() {
	const match = document.cookie.match(/_wixCIDX=([^;]*)/)
	return match && match[1]
}

function removeUrlSearch(rawUrl: string | null) {
	if (!rawUrl) {
		return OMIT_PARAM
	}
	const u = new URL(decodeURIComponent(rawUrl))
	u.search = '?'
	return encodeURIComponent(u.href)
}

function build(
	eventName: string,
	{ eventType, ts, tts, extra = '' }: BiEventParams,
	sessionData: WixBiSession,
	dynamicSessionData?: Partial<DynamicSessionData>
) {
	const extraParamHandler = createExtraParamsHandler(extra)
	const fromSession = createBiSessionHandler(sessionData)
	let shouldCleanBeats = true
	const cpm = window?.consentPolicyManager
	if (cpm) {
		const consentPolicy = cpm.getCurrentConsentPolicy()
		if (consentPolicy) {
			const { policy } = consentPolicy
			shouldCleanBeats = !(policy.functional && policy.analytics)
		}
	}
	const requestUrl = fromSession('requestUrl')
	const biParams = {
		src: '29',
		evid: '3',
		viewer_name: fromSession('viewerName'),
		caching: fromSession('caching'),
		client_id: shouldCleanBeats ? OMIT_PARAM : extractCookie(),
		dc: fromSession('dc'),
		microPop: fromSession('microPop'),
		et: eventType,
		event_name: eventName ? encodeURIComponent(eventName) : OMIT_PARAM,
		is_cached: fromSession('isCached'),
		is_platform_loaded: fromSession('is_platform_loaded'),
		is_rollout: fromSession('is_rollout'),
		ism: fromSession('isMesh'),
		isp: 0, // FIXME
		isjp: fromSession('isjp'),
		iss: fromSession('isServerSide'),
		ssr_fb: fromSession('fallbackReason'),
		ita: extraParamHandler('ita', sessionData.checkVisibility() ? '1' : '0'),
		mid: shouldCleanBeats ? OMIT_PARAM : dynamicSessionData?.siteMemberId || OMIT_PARAM,
		msid: fromSession('msId'),
		pid: extraParamHandler('pid', OMIT_PARAM),
		pn: extraParamHandler('pn', '1'),
		ref: document.referrer && !shouldCleanBeats ? encodeURIComponent(document.referrer) : OMIT_PARAM,
		sar: shouldCleanBeats
			? OMIT_PARAM
			: extraParamHandler('sar', screen.availWidth ? `${screen.availWidth}x${screen.availHeight}` : OMIT_PARAM),
		sessionId: shouldCleanBeats && cpm ? OMIT_PARAM : fromSession('sessionId'),
		siterev:
			sessionData.siteRevision || sessionData.siteCacheRevision
				? `${sessionData.siteRevision}-${sessionData.siteCacheRevision}`
				: OMIT_PARAM,
		sr: shouldCleanBeats
			? OMIT_PARAM
			: extraParamHandler('sr', screen.width ? `${screen.width}x${screen.height}` : OMIT_PARAM),
		st: fromSession('st'),
		ts,
		tts,
		url: shouldCleanBeats ? removeUrlSearch(requestUrl) : requestUrl,
		v: window?.thunderboltVersion || '0.0.0',
		vid: shouldCleanBeats ? OMIT_PARAM : dynamicSessionData?.visitorId || OMIT_PARAM,
		bsi: shouldCleanBeats ? OMIT_PARAM : dynamicSessionData?.bsi || OMIT_PARAM, // TODO: get from commonConfig
		vsi: fromSession('viewerSessionId'),
		wor: shouldCleanBeats || !window.outerWidth ? OMIT_PARAM : `${window.outerWidth}x${window.outerHeight}`,
		wr: shouldCleanBeats
			? OMIT_PARAM
			: extraParamHandler('wr', window.innerWidth ? `${window.innerWidth}x${window.innerHeight}` : OMIT_PARAM),
		_brandId: sessionData.commonConfig?.brand || OMIT_PARAM,
		nt: extraParamHandler('nt', OMIT_PARAM),
	}

	const query: string = Object.entries(biParams).map(getQueryParamBuilder).filter(Boolean).join('&')
	return `https://frog.wix.com/bt?${query}`
}

export default build
