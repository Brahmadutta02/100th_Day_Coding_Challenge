import { named, withDependencies } from '@wix/thunderbolt-ioc'
import {
	CompsLifeCycleSym,
	ICompsLifeCycle,
	IPageWillMountHandler,
	IPageWillUnmountHandler,
	PageFeatureConfigSymbol,
	ReducedMotionSymbol,
} from '@wix/thunderbolt-symbols'
import type { Actions, GetScreenInInitCallback } from './types'
import { name, ScreenInInitCallbackSymbol, SCREEN_IN_CALLBACK } from './symbols'

export const ScreenInInit = withDependencies(
	[named(PageFeatureConfigSymbol, name), ScreenInInitCallbackSymbol, CompsLifeCycleSym, ReducedMotionSymbol],
	(
		featureConfig: { compIdToActions: Actions },
		getScreenInInitCallback: GetScreenInInitCallback,
		compsLifeCycle: ICompsLifeCycle
	): IPageWillMountHandler | IPageWillUnmountHandler => {
		let unregisterFromCompLifeCycle = () => {}

		return {
			name: 'screenInInit',
			pageWillMount() {
				const initCallback = getScreenInInitCallback()

				if (!initCallback) {
					return
				}

				const compIds = Object.keys(featureConfig.compIdToActions || {})

				unregisterFromCompLifeCycle = compsLifeCycle.registerToCompLifeCycle(
					compIds,
					SCREEN_IN_CALLBACK,
					initCallback
				)
			},
			pageWillUnmount() {
				unregisterFromCompLifeCycle()
			},
		}
	}
)
