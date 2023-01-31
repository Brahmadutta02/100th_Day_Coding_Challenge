import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { TpaSrcQueryParamProviderSymbol } from '@wix/thunderbolt-symbols'
import { TpaDataCapsuleSymbol } from './symbols'
import {
	BITpaSrcQueryParamProvider,
	ConsentPolicyTpaSrcQueryParamProvider,
	ExternalIdTpaSrcQueryParamProvider,
} from './tpaSrcQueryParamProviders'
import { TpaDataCapsule } from './tpaDataCapsule'
import { bindSharedFeatureParts } from './featureLoader'

export const site: ContainerModuleLoader = (bind) => {
	bindSharedFeatureParts(bind)
	bind(TpaSrcQueryParamProviderSymbol).to(ConsentPolicyTpaSrcQueryParamProvider)
	bind(TpaSrcQueryParamProviderSymbol).to(ExternalIdTpaSrcQueryParamProvider)
	bind(TpaSrcQueryParamProviderSymbol).to(BITpaSrcQueryParamProvider)
	if (process.env.browser) {
		bind(TpaDataCapsuleSymbol).to(TpaDataCapsule)
	}
}

export {
	TpaHandlersManagerSymbol,
	TpaSectionSymbol,
	name,
	TpaDataCapsuleSymbol,
	TpaContextMappingSymbol,
	MasterPageTpaPropsCacheSymbol,
	TpaSrcBuilderSymbol,
	PinnedExternalIdStoreSymbol,
	TpaSrcUtilitySymbol,
} from './symbols'
export * from './types'
