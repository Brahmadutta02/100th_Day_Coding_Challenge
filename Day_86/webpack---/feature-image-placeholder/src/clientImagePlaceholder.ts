import { withDependencies, named } from '@wix/thunderbolt-ioc'
import { name } from './symbols'
import { PageFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import createFactory from './createPropsExtenderFactory'

export function createClientImagePlaceholder(getImageClientApi: any) {
	const clientImagePlaceholderFactory = createFactory(getImageClientApi)

	return withDependencies([named(PageFeatureConfigSymbol, name)], clientImagePlaceholderFactory)
}
