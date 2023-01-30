import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { Pubsub, TPA_PUB_SUB_PREFIX, stripPubSubPrefix } from './pubsub'
import { PlatformPubsubSymbol, name } from './symbols'
import { WixCodeSdkHandlersProviderSym, LifeCycle } from '@wix/thunderbolt-symbols'
import { pubsubSdkHandlers } from './sdk/pubsubSdkProvider'
import { PubsubCleanup } from './PubsubCleanup'

export const page: ContainerModuleLoader = (bind) => {
	bind(PlatformPubsubSymbol).to(Pubsub)
	bind(WixCodeSdkHandlersProviderSym).to(pubsubSdkHandlers)
	bind(LifeCycle.PageWillUnmountHandler).to(PubsubCleanup)
}

export const editorPage = page

export * from './types'
export * from './symbols'
export { PlatformPubsubSymbol, name, TPA_PUB_SUB_PREFIX, stripPubSubPrefix }
