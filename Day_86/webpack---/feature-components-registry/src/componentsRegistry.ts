import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	BrowserWindow,
	SiteFeatureConfigSymbol,
	BrowserWindowSymbol,
	PlatformEnvDataProvider,
} from '@wix/thunderbolt-symbols'
import { name, IComponentsRegistrySiteConfig } from './symbols'

const componentsRegistryPlatformFactory = (
	componentsRegistrySiteConfig: IComponentsRegistrySiteConfig,
	window: BrowserWindow
): PlatformEnvDataProvider => {
	return {
		platformEnvData: {
			componentsRegistry: {
				librariesTopology: componentsRegistrySiteConfig.librariesTopology,
				mode: window ? 'lazy' : 'eager',
			},
		},
	}
}

export const СomponentsRegistryPlatformEnvDataProvider = withDependencies(
	[named(SiteFeatureConfigSymbol, name), BrowserWindowSymbol],
	componentsRegistryPlatformFactory
)
