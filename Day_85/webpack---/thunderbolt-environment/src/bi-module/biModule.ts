import { BeatEventType, InternalNavigationType, BIReporter, WixBiSession } from '@wix/thunderbolt-symbols'
import { sendBeacon } from './sendBeacon'
import urlBuilder from './urlBuilder'
import getBiSessionInstance from './sessionBuilder'

export type DynamicSessionData = {
	visitorId: string
	siteMemberId: string
	bsi: string
}

function BiModule(): BIReporter & { wixBiSession: WixBiSession; sendBeacon: (url: string) => void } {
	const wixBiSession: WixBiSession = getBiSessionInstance()
	const dynamicSession: Partial<DynamicSessionData> = {}
	let pageNumberData: number = 1

	function markBeat(eventType: number, eventName?: string): void {
		if (eventName && performance.mark) {
			const mark = `${eventName} (beat ${eventType})`
			performance.mark(mark)
		}
	}

	function markBi(eventName: string, eventPhase?: string): void {
		const markName = eventPhase ? `${eventName} - ${eventPhase}` : eventName
		const prevMarkName = eventPhase === 'end' ? `${eventName} - start` : null
		performance.mark(markName)
		if (performance.measure && prevMarkName) {
			performance.measure(`\u2B50${eventName}`, prevMarkName, markName)
		}
	}

	function reportBI(eventName: string, eventPhase?: string): void {
		markBi(eventName, eventPhase)
	}

	function reportPageNavigation(pageId: string | undefined): void {
		pageNumberData = pageNumberData + 1

		sendBeat(BeatEventType.PAGE_NAVIGATION, 'page navigation start', {
			pageId,
			pageNumber: pageNumberData,
		})
	}

	function reportPageNavigationDone(pageId: string | undefined, navigationType: InternalNavigationType): void {
		sendBeat(BeatEventType.PAGE_NAVIGATION_DONE, 'page navigation complete', {
			pageId,
			pageNumber: pageNumberData,
			navigationType,
		})
		if (
			navigationType === InternalNavigationType.DYNAMIC_REDIRECT ||
			navigationType === InternalNavigationType.NAVIGATION_ERROR ||
			navigationType === InternalNavigationType.CANCELED
		) {
			pageNumberData = pageNumberData - 1
		}
	}

	const sendBeat: BIReporter['sendBeat'] = (eventType, eventName, options = {}) => {
		const now = Date.now()
		const tts = Math.round(performance.now())
		const ts = now - wixBiSession.initialTimestamp
		markBeat(eventType, eventName)
		if (wixBiSession.suppressbi || window.__browser_deprecation__) {
			return
		}
		const { pageId, pageNumber = pageNumberData, navigationType } = options
		let extra = `&pn=${pageNumber}`
		if (pageId) {
			extra += `&pid=${pageId}`
		}
		if (navigationType) {
			extra += `&nt=${navigationType}`
		}

		const frogUrl = urlBuilder(eventName, { eventType, ts, tts, extra }, wixBiSession, dynamicSession)
		sendBeacon(frogUrl)
	}

	const setDynamicSessionData = ({
		visitorId,
		siteMemberId,
		bsi,
	}: {
		visitorId: string
		siteMemberId: string
		bsi: string
	}) => {
		dynamicSession.visitorId = visitorId || dynamicSession.visitorId
		dynamicSession.siteMemberId = siteMemberId || dynamicSession.siteMemberId
		dynamicSession.bsi = bsi || dynamicSession.bsi
	}

	return {
		sendBeat,
		reportBI,
		wixBiSession, // TODO - reanme - no more session
		sendBeacon,
		setDynamicSessionData,
		reportPageNavigation,
		reportPageNavigationDone,
	}
}

export { BiModule }
