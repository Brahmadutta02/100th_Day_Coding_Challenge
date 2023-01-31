import type { CompControllerUtils } from '@wix/thunderbolt-components-loader'
import Context from './AppContext'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { CompEventSymbol, CompProps, PropsMap, StateRefsValuesMap, Store, ActionProps } from '@wix/thunderbolt-symbols'

const isVisibilityHidden = (compId: string): boolean => {
	const elem = document.getElementById(compId)
	return elem ? window.getComputedStyle(elem).visibility === 'hidden' : false
}

const getFunctionWithEventProps = (
	fnName: string,
	fn: Function & { [CompEventSymbol]?: boolean },
	displayedId: string
) => (...args: Array<any>) => {
	// overcome react bug where onMouseLeave is emitted if element becomes hidden while hovered
	// https://github.com/facebook/react/issues/22883
	if (fnName === 'onMouseLeave' && isVisibilityHidden(displayedId)) {
		return
	}

	return fn[CompEventSymbol] ? fn({ args, compId: displayedId }) : fn(...args)
}

const useFunctionProps = (displayedId: string, compProps: CompProps, propsFromController: CompProps) => {
	const { current: functionPropsWeakMap } = useRef<WeakMap<Function, Function>>(new WeakMap<Function, Function>())

	const updateFunctionPropsWeakMap = useCallback(
		(
			propName: string,
			prop: Function,
			_propsFromController: CompProps,
			_functionPropsWeakMap: WeakMap<Function, Function>
		) => {
			const functionWithEventProps = getFunctionWithEventProps(propName, prop, displayedId)
			const propFunctionIsOverridden =
				_propsFromController?.[propName] && _propsFromController?.[propName] !== prop
			const functionProp = propFunctionIsOverridden
				? (...args: Array<any>) => {
						_propsFromController?.[propName]?.(...args)
						return functionWithEventProps(...args)
				  }
				: functionWithEventProps
			_functionPropsWeakMap.set(prop, functionProp)
		},
		[displayedId]
	)

	// update function props weak map on component props change (e.g. onClick)
	return Object.entries(compProps)
		.filter(([, prop]) => typeof prop === 'function')
		.reduce((acc, [propName, prop]) => {
			if (!functionPropsWeakMap.has(prop)) {
				updateFunctionPropsWeakMap(propName, prop, propsFromController, functionPropsWeakMap)
			}
			acc[propName] = functionPropsWeakMap.get(prop) as Function
			return acc
		}, {} as ActionProps)
}

const useControllerHook = (displayedId: string, compType: string, _compProps: CompProps, stateValues: CompProps) => {
	const { getCompBoundedUpdateProps, getCompBoundedUpdateStyles, compControllers } = useContext(Context)
	const compController = compControllers[compType]

	const compControllerUtilsRef = useRef<CompControllerUtils | undefined>(undefined)
	if (!compControllerUtilsRef.current && compController) {
		compControllerUtilsRef.current = {
			updateProps: getCompBoundedUpdateProps(displayedId),
			updateStyles: getCompBoundedUpdateStyles(displayedId),
		}
	}

	const propsFromCompController = compController?.useComponentProps(
		_compProps,
		stateValues,
		compControllerUtilsRef.current!
	)
	const compProps = propsFromCompController ?? _compProps
	const functionProps = useFunctionProps(displayedId, _compProps, propsFromCompController)

	return { ...compProps, ...functionProps }
}

const getProps = (
	store: Store<PropsMap> | Store<StateRefsValuesMap>,
	isRepeatedComp: boolean,
	compId: string,
	displayedId: string
) => (isRepeatedComp ? { ...store.get(compId), ...store.get(displayedId) } : store.get(compId) ?? {})

export const useProps = (displayedId: string, compId: string, compType: string): CompProps => {
	const { props: propsStore, stateRefs: stateRefsStore } = useContext(Context)
	const isRepeatedComp = displayedId !== compId
	const compProps = getProps(propsStore, isRepeatedComp, compId, displayedId)
	const compStateRefValues = getProps(stateRefsStore, isRepeatedComp, compId, displayedId)

	return useControllerHook(displayedId, compType, compProps, compStateRefValues)
}

export const useStoresObserver = (id: string, displayedId: string): void => {
	const { structure: structureStore, props: propsStore, compsLifeCycle, stateRefs: stateRefsStore } = useContext(
		Context
	)

	const [, setTick] = useState(0)
	const forceUpdate = useCallback(() => setTick((tick) => tick + 1), [])

	const subscribeToStores = () => {
		compsLifeCycle.notifyCompDidMount(id, displayedId) // we call it when the id\displayed id changes although it's not mount
		const stores = [propsStore, structureStore, stateRefsStore]
		const unSubscribers: Array<() => void> = []
		stores.forEach((store) => {
			const unsubscribe = store.subscribeById(displayedId, forceUpdate)
			unSubscribers.push(unsubscribe)
			if (displayedId !== id) {
				forceUpdate() // sync repeated component props with stores props in case stores props were updated during first render
				unSubscribers.push(store.subscribeById(id, forceUpdate))
			}
		})

		return () => {
			unSubscribers.forEach((cb) => cb())
		}
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(subscribeToStores, [id, displayedId])
}
