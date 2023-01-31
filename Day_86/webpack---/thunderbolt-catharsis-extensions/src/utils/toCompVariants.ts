import { BaseDataItem } from '@wix/thunderbolt-becky-types'
import { CompVariantsViewItem } from '@wix/thunderbolt-catharsis'
import { isVariantRelation } from './variantsUtils'

export const toCompVariants = (dataItems: Array<BaseDataItem>): CompVariantsViewItem =>
	dataItems.reduce<CompVariantsViewItem>((acc, item) => {
		if (!isVariantRelation(item)) {
			return acc
		}
		for (const variant of item.variants) {
			acc[variant.id] = variant
		}
		return acc
	}, {})
