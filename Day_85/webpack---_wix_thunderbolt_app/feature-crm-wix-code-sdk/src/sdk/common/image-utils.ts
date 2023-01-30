// Based on: https://github.com/wix-private/cloud-runtime/blob/master/packages/edm-autogen/runtime/cloud-edm-autogen-p13n/lib/image/index.js#L15
import { parseAltText } from './alt-text'

const WIX_IMAGE_PROTOCOL = 'wix:'
const WIX_LEGACY_IMAGE_PROTOCOL = 'image:'
const WIX_IMAGE_PROTOCOL_SUFFIX = 'image://v1/'

const alignIfLegacyImage = (image: string): string => {
	const { protocol } = new URL(image)

	return protocol === WIX_LEGACY_IMAGE_PROTOCOL ? `wix:${image}` : image
}

export const parseMediaItem = (
	image: string
): {
	id?: string
	url?: string
	height?: number
	width?: number
	altText?: string
} => {
	const alignedImage = alignIfLegacyImage(image)

	// wix:image://v1/af821c_e5c9cb19ef7c43d4bca084166fb84f45~mv2.jpg/_.jpg#originWidth=388&originHeight=514
	const { protocol, pathname, hash } = new URL(alignedImage)

	if (protocol === WIX_IMAGE_PROTOCOL) {
		const [id, fileName] = pathname.replace(WIX_IMAGE_PROTOCOL_SUFFIX, '').split('/')
		const imageParams = new URLSearchParams(hash.slice(1))
		const originWidth = imageParams.get('originWidth')
		const originHeight = imageParams.get('originHeight')

		if (originWidth && originHeight) {
			return {
				id,
				width: Number(originWidth),
				height: Number(originHeight),
				altText: parseAltText(fileName),
			}
		} else {
			return {
				id,
				altText: parseAltText(fileName),
			}
		}
	}

	return { url: image }
}
