import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { SiteFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import { IRoutingConfig } from '.'
import { name } from './symbols'
import { IPagesMap } from './types'

const pagesMap = (routingConfig: IRoutingConfig): IPagesMap => {
	return {
		getPageById: (pageId) => {
			return routingConfig.pagesMap[pageId]
		},
	}
}

export const PagesMap = withDependencies([named(SiteFeatureConfigSymbol, name)], pagesMap)
