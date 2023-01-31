import _ from 'lodash'
import { withDependencies } from '@wix/thunderbolt-ioc'
import { IPropsStore, Props, SdkHandlersProvider, OoiSdkHandlers } from '@wix/thunderbolt-symbols'

export default withDependencies(
	[Props],
	(propsStore: IPropsStore): SdkHandlersProvider<OoiSdkHandlers> => ({
		getSdkHandlers: () => ({
			ooi: {
				setControllerProps: (controllerCompId, controllerDataProps, functionNames, invokeFunction) => {
					functionNames.forEach((functionName) =>
						_.set(controllerDataProps, functionName, (...args: any) => {
							if (process.env.browser || process.env.NODE_ENV === 'test') {
								invokeFunction(functionName, args)
							} else {
								throw new Error(
									`Controller ${controllerCompId} attempted to invoke ${functionName} during SSR - function props can only be invoked on user interaction or mount handlers of the component`
								)
							}
							return // make sure controller functions are not returning values
						})
					)

					propsStore.update({ [controllerCompId]: controllerDataProps })
				},
			},
		}),
	})
)
