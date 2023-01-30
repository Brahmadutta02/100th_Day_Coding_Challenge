import { withDependencies } from '@wix/thunderbolt-ioc'
import { ILogger, LoggerSymbol, SdkHandlersProvider } from '@wix/thunderbolt-symbols'
import { FedopsnWixCodeSdkHandlers } from '../types'

export const FedopsSdkHandlersProvider = withDependencies(
	[LoggerSymbol],
	(logger: ILogger): SdkHandlersProvider<FedopsnWixCodeSdkHandlers> => {
		return {
			getSdkHandlers: () => ({
				fedopsWixCodeSdk: {
					registerWidgets: (widgetAppNames: Array<string>) => {
						logger.registerPlatformWidgets(widgetAppNames)
					},
				},
			}),
		}
	}
)
