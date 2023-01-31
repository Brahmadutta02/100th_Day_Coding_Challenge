import _ from 'lodash'
import { withDependencies } from '@wix/thunderbolt-ioc'
import { getFullId, isDisplayedOnly } from '@wix/thunderbolt-commons'
import {
	CompActionsSym,
	ICompActionsStore,
	ICompEventsRegistrar,
	CompEventsRegistrarSubscriber,
	Props,
	IPropsStore,
	PropsMap,
	CompAction,
	EventActionOptions,
	CompEventSymbol,
} from '@wix/thunderbolt-symbols'

type EventPropFunction = ((eventData: { args: Array<any>; compId: string }) => void) & {
	[CompEventSymbol]: true
}
type Subscribers = Array<CompEventsRegistrarSubscriber>

const isEventPropFunction = (callback: any = {}) => !!callback[CompEventSymbol]
const createEventPropFunction = (
	compActionsStore: ICompActionsStore,
	eventName: string,
	compId: string,
	actionHandlersOptions: WeakMap<CompAction, EventActionOptions>
): EventPropFunction => {
	const getCompActionHandlers = () => {
		const compActions = compActionsStore.get(compId)?.[eventName] ?? []
		if (!isDisplayedOnly(compId)) {
			return compActions
		}

		const compTemplateActions = compActionsStore.get(getFullId(compId))?.[eventName] ?? []
		return [...compActions, ...compTemplateActions]
	}
	// @ts-ignore
	const callback: EventPropFunction = ({ args, compId: callerId }) => {
		const compActions = getCompActionHandlers()
		compActions.forEach((eventHandler) => {
			const options = actionHandlersOptions.get(eventHandler)
			if (options?.addCompId) {
				const [event, ...rest] = args
				if (_.isObject(event)) {
					const clonedEvent: any = _.clone(event)
					clonedEvent.compId = callerId
					return eventHandler(clonedEvent, ...rest)
				}
			}
			return eventHandler(...args)
		})
	}
	callback[CompEventSymbol] = true

	return callback
}

export const CompEventsRegistrar = withDependencies(
	[CompActionsSym, Props],
	(compActionsStore: ICompActionsStore, props: IPropsStore): ICompEventsRegistrar => {
		const subscribers: Subscribers = []
		const actionHandlersOptions = new WeakMap<CompAction, EventActionOptions>()

		compActionsStore.subscribeToChanges((partial) => {
			const componentProps = Object.entries(partial).reduce((acc, [compId, compEvents]) => {
				if (!compEvents) {
					// destroyPage flow
					return acc
				}

				const compProps = props.get(compId) || {}
				const actionProps = Object.keys(compEvents)
					// Filter only events that are either new or has event prop that was not created by the compEventsRegistrar
					.filter((eventName) => !compProps[eventName] || !isEventPropFunction(compProps[eventName]))
					.reduce(
						(newProps, eventName) => ({
							...newProps,
							[eventName]: createEventPropFunction(
								compActionsStore,
								eventName,
								compId,
								actionHandlersOptions
							),
						}),
						{}
					)

				return Object.keys(actionProps).length ? { ...acc, [compId]: actionProps } : acc
			}, {} as PropsMap)

			props.update(componentProps)
		})

		const register: ICompEventsRegistrar['register'] = (
			compId,
			eventName,
			compAction,
			eventOptions = { addCompId: false }
		) => {
			actionHandlersOptions.set(compAction, eventOptions)
			const currentActions = compActionsStore.get(compId) || {}

			const mergedActions = {
				[eventName]: [...(currentActions[eventName as string] || []), compAction],
			}

			compActionsStore.update({
				[compId]: {
					...currentActions,
					...mergedActions,
				},
			})

			subscribers.forEach((cb) => {
				cb(compId, { [eventName]: compAction })
			})

			return mergedActions[eventName as string][mergedActions[eventName as string].length - 1]
		}

		const unregister: ICompEventsRegistrar['unregister'] = (compId, eventName, compAction) => {
			actionHandlersOptions.delete(compAction)
			const currentActions = compActionsStore.get(compId) || {}
			const actionIndex = currentActions[eventName].findIndex((action) => action === compAction)
			if (actionIndex < 0) {
				return
			}
			// remove the action
			const newActions = {
				[eventName]: [
					...currentActions[eventName].slice(0, actionIndex),
					...currentActions[eventName].slice(actionIndex + 1),
				],
			}

			compActionsStore.update({
				[compId]: {
					...currentActions,
					...newActions,
				},
			})
		}

		const subscribeToChanges: ICompEventsRegistrar['subscribeToChanges'] = (cb) => {
			subscribers.push(cb)
		}

		return {
			register,
			unregister,
			subscribeToChanges,
		}
	}
)
