import { withDependencies } from '@wix/thunderbolt-ioc'
import { Props, IPropsStore } from '@wix/thunderbolt-symbols'
import { PropsTrait, TraitProvider } from '../types'

const propsTraitFactory = (propsStore: IPropsStore): TraitProvider<PropsTrait> => {
	return (compId) => {
		return {
			updateProps: (partialProps) => propsStore.update({ [compId]: partialProps }),
			getProps: () => propsStore.get(compId),
		}
	}
}

export const PropsTraitFactory = withDependencies([Props], propsTraitFactory)
