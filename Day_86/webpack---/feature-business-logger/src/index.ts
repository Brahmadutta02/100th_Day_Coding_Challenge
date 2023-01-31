import _ from 'lodash'
import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { withDependencies } from '@wix/thunderbolt-ioc'
import { BusinessLoggerFactory } from './businessLogger'
import { BsiManagerSymbol, name } from './symbols'
import { WixCodeSdkHandlersProviderSym, BusinessLoggerSymbol } from '@wix/thunderbolt-symbols'
import { bsiSdkHandlersProvider } from './bsiSdkHandlersProvider'
import { BsiManager } from './bsiManager'
import { UrlChangeHandlerForPage } from 'feature-router'

export const site: ContainerModuleLoader = (bind) => {
	bind(BusinessLoggerSymbol).to(BusinessLoggerFactory)
	bind(BsiManagerSymbol, UrlChangeHandlerForPage).to(BsiManager) // TODO bind to page container
	bind(WixCodeSdkHandlersProviderSym).to(bsiSdkHandlersProvider)
}

export const editor: ContainerModuleLoader = (bind) => {
	bind(WixCodeSdkHandlersProviderSym).to(
		withDependencies([], () => {
			return {
				getSdkHandlers: () => ({
					reportActivity: _.noop,
				}),
			}
		})
	)
}

export type { BusinessLogger, IBsiManager } from './types'
export { BsiManagerSymbol, name }
