import { SiteAssetsResourceType } from '@wix/thunderbolt-symbols'
import { FallbackStrategy } from '@wix/site-assets-client'

export const toFallbackStrategy = (
	resourceType: SiteAssetsResourceType,
	fallbackStrategy: string | SiteAssetsResourceType | 'all'
): FallbackStrategy => {
	switch (fallbackStrategy) {
		case 'all':
			return 'force' as FallbackStrategy
		case 'platform':
			return (resourceType === 'platform' ? 'force' : 'enable') as FallbackStrategy
		case 'features':
			return (resourceType === 'features' ? 'force' : 'enable') as FallbackStrategy
		case 'css':
			return (resourceType === 'css' ? 'force' : 'enable') as FallbackStrategy
		default:
			return 'enable' as FallbackStrategy
	}
}
export const resolveFallbackStrategy = (
	fallbackStrategyOverride: 'enable' | 'disable' | 'force' | undefined,
	resourceType: 'platform' | 'features' | 'css' | 'siteMap' | 'mobileAppBuilder',
	fallbackStrategy: string
) => (fallbackStrategyOverride ? fallbackStrategyOverride : toFallbackStrategy(resourceType, fallbackStrategy))
