import {
	IPageWillMountHandler,
	IPropsStore,
	IStructureAPI,
	PageFeatureConfigSymbol,
	Props,
	StructureAPI,
} from '@wix/thunderbolt-symbols'
import type { SospPageConfig } from './types'
import { resolveSospOnPage } from './sospApi'
import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { name } from './symbols'

export const Sosp = withDependencies(
	[named(PageFeatureConfigSymbol, name), StructureAPI, Props],
	(sospConfig: SospPageConfig, structureApi: IStructureAPI, propsStore: IPropsStore): IPageWillMountHandler => ({
		name: 'sosp',
		pageWillMount(pageId) {
			resolveSospOnPage(pageId, sospConfig, structureApi, propsStore)
		},
	})
)
