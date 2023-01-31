import { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { LifeCycle, TpaSrcQueryParamProviderSymbol } from '@wix/thunderbolt-symbols'
import {
	MasterPageTpaPropsCacheSymbol,
	TpaContextMappingSymbol,
	TpaSectionSymbol,
	TpaSrcBuilderSymbol,
} from './symbols'
import { TpaContextMappingFactory } from './tpaContextMapping'
import { TpaSrcBuilder } from './tpaSrcBuilder'
import { TpaSection } from './tpaSection'
import {
	AppSectionTpaSrcQueryParamProvider,
	BaseTpaSrcQueryParamProvider,
	CommonConfigTpaSrcQueryParamProvider,
	CurrencyTpaSrcQueryParamProvider,
	InstanceTpaSrcQueryParamProvider,
	RouteTpaSrcQueryParamProvider,
} from './tpaSrcQueryParamProviders'
import { TpaMessageContextPicker } from './tpaMessageContextPicker'
import { TpaPropsCacheFactory } from './tpaPropsCache'

export const bindSharedFeatureParts: ContainerModuleLoader = (bind) => {
	bind(MasterPageTpaPropsCacheSymbol).to(TpaPropsCacheFactory)
	bind(LifeCycle.AppDidMountHandler).to(TpaMessageContextPicker)
	bind(TpaContextMappingSymbol).to(TpaContextMappingFactory)
	bind(TpaSrcBuilderSymbol).to(TpaSrcBuilder)
	bind(TpaSectionSymbol).to(TpaSection)
	bind(TpaSrcQueryParamProviderSymbol).to(BaseTpaSrcQueryParamProvider)
	bind(TpaSrcQueryParamProviderSymbol).to(InstanceTpaSrcQueryParamProvider)
	bind(TpaSrcQueryParamProviderSymbol).to(CurrencyTpaSrcQueryParamProvider)
	bind(TpaSrcQueryParamProviderSymbol).to(CommonConfigTpaSrcQueryParamProvider)
	bind(TpaSrcQueryParamProviderSymbol).to(RouteTpaSrcQueryParamProvider)
	bind(TpaSrcQueryParamProviderSymbol).to(AppSectionTpaSrcQueryParamProvider)
}
