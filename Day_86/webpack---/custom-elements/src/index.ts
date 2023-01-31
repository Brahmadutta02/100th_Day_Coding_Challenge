// @ts-nocheck

import * as imageKit from '@wix/image-kit'
import wixCustomElementsRegistry from './wixCustomElementsRegistry'

export default {
	imageClientApi: imageKit,
	...wixCustomElementsRegistry,
}
