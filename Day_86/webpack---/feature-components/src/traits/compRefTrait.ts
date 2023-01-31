import { withDependencies } from '@wix/thunderbolt-ioc'
import { CompRefAPISym, CompRefAPI } from '@wix/thunderbolt-symbols'
import { CompRefTrait, TraitProvider } from '../types'

const compRefTraitFactory = (compRefAPI: CompRefAPI): TraitProvider<CompRefTrait> => {
	return (compId) => {
		return {
			getCompRef: () => compRefAPI.getCompRefById(compId),
		}
	}
}

export const CompRefTraitFactory = withDependencies([CompRefAPISym], compRefTraitFactory)
