import { IComponentsStylesOverrides, IStylesStore, StylesStoreSymbol } from '@wix/thunderbolt-symbols'
import { withDependencies } from '@wix/thunderbolt-ioc'

const ComponentsStylesOverridesFactory = (stylesStore: IStylesStore): IComponentsStylesOverrides => {
	return {
		getCompStyle: (compId) => stylesStore.get(compId),
		isHidden: (compId) => {
			const compStyle = stylesStore.get(compId)
			return Boolean(compStyle?.visibility?.includes('hidden'))
		},
		update: (overrideStyles) => stylesStore.update(overrideStyles),
		set: (styles) => stylesStore.set(styles),
	}
}

export const ComponentsStylesOverrides = withDependencies([StylesStoreSymbol], ComponentsStylesOverridesFactory)
