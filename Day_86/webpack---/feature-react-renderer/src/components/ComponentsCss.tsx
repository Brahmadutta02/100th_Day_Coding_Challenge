import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
	getSingleComponentCss,
	ComponentCss,
	getChildrenAndSlots,
	stringifySingleComponentCss,
	accumulateCssContext,
} from '@wix/thunderbolt-catharsis-extensions'
import { Component } from '@wix/thunderbolt-becky-types'
import _ from 'lodash'
import { ComponentCssContextValue, StructureComponentCssProps, ComponentsCssProps } from './ComponentsCss.types'
import { debounce } from './debounce'

const ComponentCssContext = React.createContext<ComponentCssContextValue>({} as ComponentCssContextValue)

const StructureComponentCss = React.memo(
	({ id, ancestorComponentBreakpointsOrder, cssContext }: StructureComponentCssProps) => {
		const { getByCompId, subscribeByCompId, experiments } = useContext<ComponentCssContextValue>(
			ComponentCssContext
		)

		const data = getByCompId(id)
		const { structure, breakpointsOrder = ancestorComponentBreakpointsOrder, compSpecificData, ...compCss } = data

		const [, setTick] = useState(0)
		const forceUpdate = useCallback(() => setTick((tick) => tick + 1), [])

		const accumulatedCssContext = accumulateCssContext(structure, cssContext, compSpecificData)

		// eslint-disable-next-line react-hooks/exhaustive-deps
		useEffect(() => subscribeByCompId(id, forceUpdate), [])

		if (!structure) {
			return null
		}

		const singleComponentCss = getSingleComponentCss(
			id,
			breakpointsOrder,
			accumulatedCssContext,
			compCss,
			experiments
		)
		const cssString = stringifySingleComponentCss(singleComponentCss)
		const currentComp = <style data-comp-id={id}>{cssString}</style>

		accumulatedCssContext.isInRepeater =
			accumulatedCssContext.isInRepeater || structure.componentType === 'Repeater'
		const children = getChildrenAndSlots(structure).map((childId) => (
			<StructureComponentCss
				key={childId}
				id={childId}
				cssContext={accumulatedCssContext}
				ancestorComponentBreakpointsOrder={breakpointsOrder}
			/>
		))
		return (
			<React.Fragment>
				{currentComp}
				{children}
			</React.Fragment>
		)
	},
	(prevProps, nextProps) => _.isEqual(prevProps, nextProps)
)

export const ComponentsCss = (props: ComponentsCssProps) => {
	const structureStore = props.megaStore.getChildStore('structure')
	const cssStore = props.megaStore.getChildStore('componentCss')

	const updateStore = (partialStore: any) => {
		for (const compId in partialStore) {
			structureStore.updateById(compId, partialStore[compId])
		}
	}
	updateStore(props.structureStore.getEntireStore())
	props.structureStore.subscribeToChanges(updateStore)

	const getByCompId = (compId: string) => ({
		structure: structureStore.getById<Component>(compId),
		...cssStore.getById<ComponentCss>(compId),
	})

	const stores = [structureStore, cssStore]

	const subscribeByCompId = (compId: string, callback: () => void) => {
		const debounced = debounce(() => props.batchingStrategy.batch(callback))
		const unsubscribes = stores.map((store) => store.subscribeById(compId, debounced))
		return () => unsubscribes.forEach((unsubscribe) => unsubscribe())
	}

	const storesContextValue = { getByCompId, subscribeByCompId, experiments: props.experiments }

	return (
		<ComponentCssContext.Provider value={storesContextValue}>
			<StructureComponentCss id={props.rootCompId} cssContext={{}} />
		</ComponentCssContext.Provider>
	)
}
