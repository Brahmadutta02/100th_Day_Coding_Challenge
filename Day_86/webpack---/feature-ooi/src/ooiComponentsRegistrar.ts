import { IComponentsRegistrar } from '@wix/thunderbolt-components-loader'
import { withDependencies } from '@wix/thunderbolt-ioc'

export const ooiComponentsRegistrar = withDependencies(
	[],
	(): IComponentsRegistrar => {
		return {
			getComponents() {
				return {
					tpaWidgetNative: () =>
						Promise.resolve({
							component: (props: any) => props.ReactComponent(props),
						}),
				}
			},
		}
	}
)
