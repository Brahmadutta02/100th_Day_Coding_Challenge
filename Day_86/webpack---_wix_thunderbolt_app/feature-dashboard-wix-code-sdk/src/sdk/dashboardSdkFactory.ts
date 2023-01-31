import { WixCodeApiFactoryArgs } from '@wix/thunderbolt-symbols'
import { namespace, name, DashboardWixCodeSdkHandlers, DashboardWixCodeSdkWixCodeApi } from '..'
import { dashboardApiFacadeFactory } from './services/dashboardApiFacadeFactory'
import { callDashboardApiFactory } from './services/callDashboardApiFactory'
import { transfer as comlinkTransfer } from 'comlink/dist/esm/comlink.js'
import * as dashboardSdk from '@wix/dashboard-sdk/configurable'
import shouldExposeNewSdk from './services/shouldExposeNewSdk'
import getDashboardOrigin from './services/getDashboardOrigin'

export function DashboardSdkFactory({
	handlers,
	platformEnvData,
	onPageWillUnmount,
}: WixCodeApiFactoryArgs<never, never, DashboardWixCodeSdkHandlers>): {
	[namespace]: DashboardWixCodeSdkWixCodeApi
} {
	const callDashboardApi = callDashboardApiFactory(handlers[name].getDashboardApi)

	let newSDKMethods = {}
	try {
		if (
			shouldExposeNewSdk({
				locationHref: platformEnvData.location.rawUrl,
			})
		) {
			const postMessageParent = handlers[name].postMessageParent
			const { init: initSDK, ...sdkMethods } = dashboardSdk
			newSDKMethods = sdkMethods

			const disposeSDK = initSDK({
				origin: getDashboardOrigin(platformEnvData.location.rawUrl) || '',
				postMessage: (message: any, targetOrigin: string, transfer: Array<Transferable>) =>
					postMessageParent(message, targetOrigin, comlinkTransfer(transfer, transfer)),
			})
			onPageWillUnmount(() => {
				disposeSDK && disposeSDK()
			})
		}
	} catch (e) {
		// let the provider capture the error until we get access to an error logger in the factory
		handlers[name].captureError(e)
		throw e
	}

	return {
		[namespace]: {
			...dashboardApiFacadeFactory(callDashboardApi),
			...newSDKMethods,
		},
	}
}
