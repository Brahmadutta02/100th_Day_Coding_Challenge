import { withDependencies } from '@wix/thunderbolt-ioc'
import type { IPageDidMountHandler } from '@wix/thunderbolt-symbols'
import { CommonConfigSymbol, ICommonConfig } from 'feature-common-config'
import { TpaEventsListenerManagerSymbol } from './symbols'
import type { ITPAEventsListenerManager } from './types'

export const tpaCommonConfigUpdater = withDependencies(
	[CommonConfigSymbol, TpaEventsListenerManagerSymbol],
	(commonConfig: ICommonConfig, tpaEventsListenerManager: ITPAEventsListenerManager): IPageDidMountHandler => {
		return {
			pageDidMount: () =>
				commonConfig.registerToCommonConfigChange((newCommonConfig) =>
					tpaEventsListenerManager.dispatch('COMMON_CONFIG_UPDATE', () => newCommonConfig)
				),
		}
	}
)
