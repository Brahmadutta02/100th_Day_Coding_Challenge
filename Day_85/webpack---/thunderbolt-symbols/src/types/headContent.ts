export type IHeadContent = {
	setHead: (content: string, type?: HeadContentType) => void
	getHead: () => string
	getHeadSeoMarkup: () => string
	getHeadMarkupByType: (type: HeadContentType) => string
	addPageCss: (css: string) => void
	getPagesCss: () => string
}
export enum HeadContentType {
	SEO = 'seo',
	SEO_DEBUG = 'seo_debug',
	GENERAL = 'general',
}
