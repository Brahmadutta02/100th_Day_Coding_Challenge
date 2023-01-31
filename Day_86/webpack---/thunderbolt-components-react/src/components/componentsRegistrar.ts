import { withDependencies } from '@wix/thunderbolt-ioc'
import { IComponentsRegistrar } from '@wix/thunderbolt-components-loader'
import { componentsLoaders } from './componentsLoaders'

export const ComponentsRegistrar = withDependencies<IComponentsRegistrar>([], () => {
	return {
		getComponents() {
			return componentsLoaders
		},
	}
})
