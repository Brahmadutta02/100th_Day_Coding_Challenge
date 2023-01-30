// @ts-ignore

import { buildOgImagePreviewUrl } from '@wix/advanced-seo-utils/renderer-api'
import { MetaTag } from 'feature-seo'

export function resolveMetaTags(
	originalMetaTags: Array<MetaTag> | Record<string, string>,
	mediaItemUtils: any
): Array<MetaTag> | Record<string, string> {
	const transformWixImageToPublicURL = (wixImageUri: string) => {
		const parsedUri = mediaItemUtils.parseMediaItemUri(wixImageUri)
		const { error, mediaId, width, height, title } = parsedUri
		return error ? '' : buildOgImagePreviewUrl({ url: mediaId, width, height, method: 'fill', name: title })
	}
	const isWixImage = (url = ''): boolean => url.startsWith('wix:image:') || url.startsWith('image:')
	const hasWixImage = (metaTags: Array<string>): boolean => metaTags.some((url) => isWixImage(url))
	const resolveWixImage = (metaTags: Array<MetaTag>): Array<MetaTag> =>
		metaTags.map((tag) =>
			isWixImage(tag.content) ? { ...tag, content: transformWixImageToPublicURL(tag.content) } : tag
		)
	const resolveWixImageObj = (metaTags: Record<string, string>): Record<string, string> =>
		Object.keys(metaTags).reduce((acc, curr) => {
			const value = metaTags[curr]
			acc[curr] = isWixImage(value) ? transformWixImageToPublicURL(value) : value
			return acc
		}, {} as Record<string, string>)

	if (Array.isArray(originalMetaTags)) {
		return hasWixImage(originalMetaTags.map((tag) => tag.content))
			? resolveWixImage(originalMetaTags)
			: originalMetaTags
	}
	return hasWixImage(Object.values(originalMetaTags)) ? resolveWixImageObj(originalMetaTags) : originalMetaTags
}
