import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { ComponentWillMountSymbol } from 'feature-components'
import { UrlChangeHandlerForPage } from 'feature-router'
import { LoginSocialBar } from './loginSocialBar'

export const page: ContainerModuleLoader = (bind) => {
	bind(ComponentWillMountSymbol, UrlChangeHandlerForPage).to(LoginSocialBar)
}

export const editorPage = page

export { resolveMemberDetails } from './resolveMemberDetails'
