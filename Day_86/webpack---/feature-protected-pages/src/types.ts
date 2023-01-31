import type { CandidateRouteInfo } from 'feature-router'

export type ProtectedPagesSiteConfig = {
	passwordProtected: { [pageId: string]: string }
	publicPageIds: Array<string>
}

export type ProtectedPageMasterPageConfig = {
	customNoPermissionsPageUrl: string
	pagesSecurity: {
		[pageId: string]: {
			requireLogin: boolean
			passwordDigest: string
		}
	}
	customNoPermissionsPageId: string
}

export type PagesMap = { [pageId: string]: string }
export type ProtectedPagesState = {
	pagesMap: PagesMap
	loginAndNavigate: (routerInfo: Partial<CandidateRouteInfo>, loginType: LoginTypes) => Promise<boolean>
}
export enum LoginTypes {
	SM = 'SM',
	Pass = 'PASS',
	NONE = 'NONE',
}
