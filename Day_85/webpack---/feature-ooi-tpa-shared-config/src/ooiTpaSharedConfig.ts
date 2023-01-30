import { withDependencies, named } from '@wix/thunderbolt-ioc'
import { MasterPageFeatureConfigSymbol, SiteFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import type { OoiTpaSharedConfigSiteConfig, IOoiTpaSharedConfig, OoiTpaSharedConfigMasterPageConfig } from './types'
import { name } from './symbols'

export const OoiTpaSharedConfig = withDependencies(
	[named(SiteFeatureConfigSymbol, name), named(MasterPageFeatureConfigSymbol, name)],
	(
		{ wixStaticFontsLinks, imageSpriteUrl }: OoiTpaSharedConfigSiteConfig,
		{ fontsMeta }: OoiTpaSharedConfigMasterPageConfig
	): IOoiTpaSharedConfig => ({
		getFontsConfig() {
			return {
				cssUrls: wixStaticFontsLinks,
				fontsMeta,
				imageSpriteUrl,
			}
		},
	})
)
