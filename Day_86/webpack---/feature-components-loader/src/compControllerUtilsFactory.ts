import { withDependencies } from '@wix/thunderbolt-ioc'
import {
	ComponentsStylesOverridesSymbol,
	IComponentsStylesOverrides,
	IPlatformPropsSyncManager,
	IPropsStore,
	IRendererPropsExtender,
	IStructureStore,
	PlatformPropsSyncManagerSymbol,
	Props,
	Structure,
} from '@wix/thunderbolt-symbols'
import { getFullId } from '@wix/thunderbolt-commons'
import { GetCompBoundedUpdateProps, GetCompBoundedUpdateStyles } from './types'

export const compControllerUtilsFactory = withDependencies(
	[Props, Structure, ComponentsStylesOverridesSymbol, PlatformPropsSyncManagerSymbol],
	(
		propsStore: IPropsStore,
		structureStore: IStructureStore,
		componentsStylesOverrides: IComponentsStylesOverrides,
		platformPropsSyncManager: IPlatformPropsSyncManager
	): IRendererPropsExtender => {
		const shouldIgnoreOtherPageHandlers = (displayedId: string, initialContextId: string | null) => {
			const currentContextId = structureStore.getContextIdOfCompId(getFullId(displayedId))
			return !structureStore.get(getFullId(displayedId)) || initialContextId !== currentContextId
		}

		const getCompBoundedUpdateProps: GetCompBoundedUpdateProps = (displayedId: string) => {
			const initialContextId = structureStore.getContextIdOfCompId(getFullId(displayedId))

			return (overrideProps) => {
				// Ignore invocations from handlers that were created on other pages
				if (shouldIgnoreOtherPageHandlers(displayedId, initialContextId)) {
					return
				}

				propsStore.update({ [displayedId]: overrideProps })
				platformPropsSyncManager.triggerPlatformPropsSync(displayedId, overrideProps)
			}
		}

		const getCompBoundedUpdateStyles: GetCompBoundedUpdateStyles = (displayedId: string) => {
			const initialContextId = structureStore.getContextIdOfCompId(getFullId(displayedId))

			return (overrideStyles) => {
				// Ignore invocations from handlers that were created on other pages
				if (shouldIgnoreOtherPageHandlers(displayedId, initialContextId)) {
					return
				}

				componentsStylesOverrides.update({ [displayedId]: overrideStyles })
			}
		}

		return {
			async extendRendererProps() {
				return {
					getCompBoundedUpdateProps,
					getCompBoundedUpdateStyles,
				}
			},
		}
	}
)
