import { PlatformEnvData, SessionServiceAPI } from '@wix/thunderbolt-symbols'

export const biFactory = ({ biData, metaSiteId, viewMode, sessionService }: { biData: PlatformEnvData['bi']; metaSiteId: string; viewMode: 'site' | 'preview'; sessionService: SessionServiceAPI }) => {
	const {
		viewerSessionId,
		initialTimestamp,
		initialRequestTimestamp,
		isCached,
		is_rollout,
		dc,
		isjp,
		btype,
		viewerVersion,
		pageData: { isLightbox, pageUrl, pageId, pageNumber },
		muteBi,
		ownerId,
		isMobileFriendly,
		isPreview,
	} = biData

	return {
		get siteMemberId() {
			return sessionService.getSiteMemberId()
		},
		get visitorId() {
			return sessionService.getVisitorId()
		},
		get svSession() {
			return sessionService.getUserSession()
		},
		// wixBiSession data
		viewerSessionId,
		isCached,
		is_rollout,
		dc,
		isjp,
		btype,
		pageLoadStart: initialTimestamp,
		networkPageLoadStart: initialRequestTimestamp,
		pageNumber,
		// rendererModel data
		metaSiteId,
		ownerId,
		isMobileFriendly,
		viewMode,
		isPreview,
		// viewer data
		pageId,
		pageUrl,
		isServerSide: !process.env.browser,
		viewerName: 'thunderbolt',
		artifactVersion: `thunderbolt-${viewerVersion}`,
		isPopup: isLightbox,
		// query params data
		muteBi,
	}
}
