import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { WixCodeSdkHandlersProviderSym } from '@wix/thunderbolt-symbols'
import { ConsentPolicySymbol } from './symbols'
import { ConsentPolicyBrowser } from './consentPolicyBrowser'
import { ConsentPolicySdkHandlersProvider } from './consentPolicySdkHandlersProvider'

export { createConsentPolicyLogger } from './consentPolicyLogger'

export const site: ContainerModuleLoader = (bind) => {
	bind(ConsentPolicySymbol).to(ConsentPolicyBrowser)
	bind(WixCodeSdkHandlersProviderSym).to(ConsentPolicySdkHandlersProvider)
}

export const editor = site

export * from './types'
export * from './symbols'
