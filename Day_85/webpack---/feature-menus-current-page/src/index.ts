import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { ComponentWillMountSymbol } from 'feature-components'
import { VerticalMenus, ExpandableAndDropdownMenus } from './menusCurrentPage'

export const page: ContainerModuleLoader = (bind) => {
	bind(ComponentWillMountSymbol).to(VerticalMenus)
	bind(ComponentWillMountSymbol).to(ExpandableAndDropdownMenus)
}

export const editorPage: ContainerModuleLoader = page
