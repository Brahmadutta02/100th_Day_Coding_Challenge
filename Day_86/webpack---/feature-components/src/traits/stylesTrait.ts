import { withDependencies } from '@wix/thunderbolt-ioc'
import { ComponentsStylesOverridesSymbol, IComponentsStylesOverrides } from '@wix/thunderbolt-symbols'
import { TraitProvider, StylesTrait } from '../types'

const stylesTraitFactory = (componentsStylesOverrides: IComponentsStylesOverrides): TraitProvider<StylesTrait> => {
	return (compId) => {
		return {
			updateStyle: (partialStyle) => componentsStylesOverrides.update({ [compId]: partialStyle }),
		}
	}
}

export const StylesTraitFactory = withDependencies([ComponentsStylesOverridesSymbol], stylesTraitFactory)
