import { multi, withDependencies } from '@wix/thunderbolt-ioc'
import {
	CssFetcherSymbol,
	DomReadySymbol,
	HeadContentSymbol,
	ICssFetcher,
	IHeadContent,
	IPageResourceFetcher,
	PageResourceFetcherSymbol,
} from '@wix/thunderbolt-symbols'

export type ILoadPageStyle = {
	load(pageId: string): Promise<void>
}

export const PageMainCssFetcher = withDependencies<ICssFetcher>(
	[PageResourceFetcherSymbol],
	(pageResourceFetcher: IPageResourceFetcher) => ({
		id: 'css',
		fetch: (pageId) => pageResourceFetcher.fetchResource(pageId, 'css'),
	})
)

const toDomId = (id: string, pageId: string) => `${id}_${pageId}`

const createMemoizedFontPreloader = (fontPreloader: Function) => {
	const preloadedFontsMap = new Map()
	return (fontUrl: string, ...rest: any) => {
		if (!preloadedFontsMap.has(fontUrl)) {
			fontPreloader(fontUrl, ...rest)
			preloadedFontsMap.set(fontUrl, true)
		}
	}
}

const preloadFontInCsr = (fontUrl: string) => {
	const preloadLink = window.document.createElement('link')
	preloadLink.rel = 'preload'
	preloadLink.as = 'font'
	preloadLink.type = 'font/woff2'
	preloadLink.href = fontUrl
	preloadLink.crossOrigin = ''

	window.document.head.appendChild(preloadLink)
}

const preloadFontInSsr = (fontUrl: string, headContent: IHeadContent) => {
	headContent.setHead(
		`  <link rel="preload" as="font" type="font/${fontUrl.split('.').pop()}" href="${fontUrl}" crossorigin>`
	)
}

export const ClientPageStyleLoader = withDependencies<ILoadPageStyle>(
	[DomReadySymbol, multi(CssFetcherSymbol)],
	(domReadyPromise: Promise<void>, cssFetchers: Array<ICssFetcher>) => {
		const preloadFont = createMemoizedFontPreloader(preloadFontInCsr)
		return {
			async load(pageId): Promise<void> {
				await domReadyPromise

				await Promise.all(
					cssFetchers.map(async (cssFetcher) => {
						const id = toDomId(cssFetcher.id, pageId)
						if (document.getElementById(id)) {
							return
						}

						const { css, fontUrlsToPreload } = await cssFetcher.fetch(pageId)
						fontUrlsToPreload.forEach(preloadFont)

						const styleElement = window.document.createElement('style')
						styleElement.setAttribute('id', id)
						styleElement.innerHTML = css
						window.document.getElementById('pages-css')!.appendChild(styleElement)
					})
				)
			},
		}
	}
)

export const ServerPageStyleLoader = withDependencies<ILoadPageStyle>(
	[HeadContentSymbol, multi(CssFetcherSymbol)],
	(headContent: IHeadContent, cssFetchers: Array<ICssFetcher>) => {
		const preloadFont = createMemoizedFontPreloader(preloadFontInSsr)
		return {
			async load(pageId) {
				const results = await Promise.all(
					cssFetchers.map(async ({ id, fetch }) => {
						const { css, fontUrlsToPreload } = await fetch(pageId)
						return {
							id,
							css,
							fontUrlsToPreload,
						}
					})
				)
				results.forEach(({ id, css, fontUrlsToPreload }) => {
					fontUrlsToPreload.forEach((fontUrlToPreload) => preloadFont(fontUrlToPreload, headContent))
					headContent.addPageCss(`<style id="${toDomId(id, pageId)}">${css}</style>`)
				})
			},
		}
	}
)
