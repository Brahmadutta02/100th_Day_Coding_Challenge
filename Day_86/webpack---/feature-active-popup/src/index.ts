import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { ActivePopupHandler } from './activePopup'
import { ComponentWillMountSymbol } from 'feature-components'

export const page: ContainerModuleLoader = (bind) => {
	bind(ComponentWillMountSymbol).to(ActivePopupHandler)
}

export const editorPage: ContainerModuleLoader = page
