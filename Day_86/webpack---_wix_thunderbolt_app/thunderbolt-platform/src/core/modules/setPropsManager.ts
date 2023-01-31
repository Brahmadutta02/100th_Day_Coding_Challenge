import _ from 'lodash'
import { getDisplayedId } from '@wix/thunderbolt-commons'
import type { ComponentEventContext, ISetProps, IPlatformLogger, IModelsAPI } from '@wix/thunderbolt-symbols'
import type { IViewerHandlers } from '../types'
import { MODELS_API, PLATFORM_LOGGER, SET_PROPS_MANAGER, VIEWER_HANDLERS } from './moduleNames'

export type CreateSetProps = (compId: string) => (partialProps: object | Promise<object>) => void

export type CreateSetPropsForOOI = (controllerCompId: string, context?: ComponentEventContext) => (partialProps: object) => void

const removeFunctions = (obj: object) => _.omitBy(obj, _.isFunction)
const extractFunctions = (obj: object) => _.pickBy(obj, _.isFunction)

function propsPartition(props: object, allowSecondLevelFunctions: boolean) {
	// first level
	const dataProps = removeFunctions(props)
	const functionProps = extractFunctions(props)
	// second level
	if (allowSecondLevelFunctions) {
		_.forEach(dataProps, (val, key) => {
			if (_.isObject(val) && !_.isArray(val)) {
				_.assign(
					functionProps,
					_.mapKeys(extractFunctions(val), (v, k) => `${key}.${k}`)
				)
				_.assign(dataProps, { [key]: removeFunctions(val) })
			} else {
				_.assign(dataProps, { [key]: val })
			}
		})
	}
	return { dataProps, functionProps }
}

export interface ISetPropsManager {
	createSetProps: (compId: string) => ISetProps
	createSetPropsForOOI: (controllerCompId: string, context?: ComponentEventContext) => (partialProps: object) => void
	waitForUpdatePropsPromises: () => Promise<Array<any> | void>
}

const SetPropsManager = (modelsApi: IModelsAPI, logger: IPlatformLogger, { viewerHandlers }: IViewerHandlers): ISetPropsManager => {
	const updatePropsPromises: Array<Promise<any>> = []
	const waitForUpdatePropsPromises = () => logger.runAsyncAndReport('waitForUpdatePropsPromises', () => Promise.all(updatePropsPromises)).catch(_.noop)

	function updateProps(compId: string, resolvedProps: any) {
		modelsApi.updateProps(compId, resolvedProps)
		viewerHandlers.stores.updateProps({ [compId]: resolvedProps })
	}

	function createSetProps(compId: string): ISetProps {
		return (partialProps: object | Promise<object>) => {
			const _setProps = (resolvedProps: object) => {
				updateProps(compId, resolvedProps)
				if (modelsApi.isRepeaterTemplate(compId)) {
					modelsApi.getDisplayedIdsOfRepeaterTemplate(compId).forEach((displayedId: string) => updateProps(displayedId, resolvedProps))
				}
			}
			if (partialProps instanceof Promise) {
				updatePropsPromises.push(partialProps.then(_setProps))
			} else {
				_setProps(partialProps)
			}
		}
	}

	function createSetPropsForOOI(controllerCompId: string, context?: ComponentEventContext) {
		return (partialProps: object) => {
			const { functionProps, dataProps } = propsPartition(partialProps, true)
			const compId = context ? getDisplayedId(controllerCompId, context.itemId) : controllerCompId
			viewerHandlers.ooi.setControllerProps(compId, dataProps, Object.keys(functionProps), (functionName: string, args: any) => functionProps[functionName](...args))
		}
	}

	return {
		createSetProps,
		createSetPropsForOOI,
		waitForUpdatePropsPromises,
	}
}

export default {
	factory: SetPropsManager,
	deps: [MODELS_API, PLATFORM_LOGGER, VIEWER_HANDLERS],
	name: SET_PROPS_MANAGER,
}
