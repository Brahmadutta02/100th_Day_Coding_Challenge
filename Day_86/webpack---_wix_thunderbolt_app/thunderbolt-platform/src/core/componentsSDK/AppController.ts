import _ from 'lodash'
import type { IModelsAPI } from '@wix/thunderbolt-symbols'
import type { ComponentSdkFactory, componentSdkFactoryArgs } from '@wix/thunderbolt-platform-types'
import type { AppControllerSDK } from '../../types'
import type { IControllersExports } from '../types'
import type { IControllerEvents } from '../modules/controllerEvents'
import { composeSDKFactories, createElementPropsSDKFactory, childrenPropsSDKFactory } from '@wix/editor-elements-corvid-utils/dist/esm'

export const AppControllerSdk = ({
	controllersExports,
	modelsApi,
	controllerEvents,
}: {
	controllersExports: IControllersExports
	modelsApi: IModelsAPI
	controllerEvents: IControllerEvents
}): ComponentSdkFactory => {
	const sdk = AppControllerSdkFactory({ controllersExports, modelsApi, controllerEvents })
	// remove `any` after https://jira.wixpress.com/browse/WCR-208
	return composeSDKFactories(createElementPropsSDKFactory(), sdk as any) as any
}

export const AppControllerWithChildrenSdk = ({
	controllersExports,
	modelsApi,
	controllerEvents,
}: {
	controllersExports: IControllersExports
	modelsApi: IModelsAPI
	controllerEvents: IControllerEvents
}): ComponentSdkFactory => {
	const sdk = AppControllerSdkFactory({ controllersExports, modelsApi, controllerEvents })
	// remove `any` after https://jira.wixpress.com/browse/WCR-208
	return composeSDKFactories(createElementPropsSDKFactory(), childrenPropsSDKFactory, sdk as any) as any
}

function assignWithGettersAndSetters(target: any, source: any) {
	Object.defineProperties(target, _.fromPairs(Object.keys(source).map((key) => [key, Object.getOwnPropertyDescriptor(source, key)!])))
}

function AppControllerSdkFactory({
	controllersExports,
	modelsApi,
	controllerEvents,
}: {
	controllersExports: IControllersExports
	modelsApi: IModelsAPI
	controllerEvents: IControllerEvents
}): ComponentSdkFactory {
	return ({ compId, $wScope, createEvent }: componentSdkFactoryArgs): AppControllerSDK => {
		const scopedControllerEvents = controllerEvents.createScopedControllerEvents(compId)
		const controllerExportsFunc = controllersExports[compId]
		const controllerExports = controllerExportsFunc ? controllerExportsFunc($wScope, createEvent) || {} : {}

		const controllerApi = {
			get type() {
				return modelsApi.getControllerTypeByCompId(compId)
			},
			on(event: string, callback: Function, context: any) {
				scopedControllerEvents.on(event, callback, context)
			},
			off(event: string, callback: Function) {
				scopedControllerEvents.off(event, callback)
			},
			once(event: string, callback: Function, context: any) {
				scopedControllerEvents.once(event, callback, context)
			},
		}
		assignWithGettersAndSetters(controllerApi, controllerExports)
		return controllerApi
	}
}
