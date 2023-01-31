import { RendererProps } from '../types'
import Context from './AppContext'
import React, { useContext, ComponentType, useCallback, useMemo } from 'react'
import { ErrorBoundary, DeadComp } from './ErrorBoundary'
import _ from 'lodash'
import { getDisplayedId, getDefaultCompId } from '@wix/thunderbolt-commons'
import { useProps, useStoresObserver } from './hooks'
import { DeletedComp } from './DeletedComp'
import { getChildScope, getScopesAttributes, emptyScope } from './scopesApi'
import type { ScopeData } from './scopesApi'

const isDs = process.env.PACKAGE_NAME === 'thunderbolt-ds'

// id is the actual DOM id and compId is the id of the comp in the structure
type StructureComponentProps = {
	id: string
	compId?: string
	scopeData: ScopeData
	displayedItemId?: string
}
const renderComp = (
	propsStore: RendererProps['props'],
	childId: string,
	scopeData: ScopeData,
	displayedItemId?: string
) => {
	const childProps = propsStore.get(childId)

	const defaultChildId = getDefaultCompId(childId)
	return (
		<StructureComponent
			displayedItemId={displayedItemId}
			compId={childId}
			scopeData={scopeData}
			id={defaultChildId}
			key={
				childProps?.key || (displayedItemId ? getDisplayedId(defaultChildId, displayedItemId!) : defaultChildId)
			}
		/>
	)
}
const StructureComponent: ComponentType<StructureComponentProps> = React.memo(
	({ id, compId = id, displayedItemId = '', scopeData = emptyScope }) => {
		const { structure: structureStore, props: propsStore, comps, translate, logger }: RendererProps = useContext(
			Context
		)
		let displayedId = displayedItemId ? getDisplayedId(compId, displayedItemId) : compId

		const compStructure = structureStore.get(displayedId) || structureStore.get(compId) || {}
		const { componentType, uiType, deleted } = compStructure
		const compClassType = uiType ? `${componentType}_${uiType}` : componentType
		if (!(compClassType in comps)) {
			console.warn('Unknown component type', compClassType)
		}
		const Comp = comps[compClassType]

		useStoresObserver(compId, displayedId)
		const compProps = useProps(displayedId, compId, compClassType)
		const components = compStructure!.components
		const parentScope = scopeData
		const children = useCallback(
			(childScopeData?: { scopeId: string; parentType: string; itemIndex?: number }) =>
				(components || []).map((childId) => {
					const itemId = childScopeData?.parentType === 'Repeater' ? childScopeData!.scopeId : displayedItemId

					const childScope = isDs ? getChildScope(compId, parentScope, childScopeData) : emptyScope
					return renderComp(propsStore, childId, childScope, itemId)
				}),
			[components, displayedItemId, propsStore, compId, parentScope]
		)

		const slots = compStructure!.slots
		const slotsProps = useMemo(
			() => _.mapValues(slots, (slotId) => renderComp(propsStore, slotId, parentScope, displayedItemId)),
			[slots, displayedItemId, propsStore, parentScope]
		)

		const scopeAttr = isDs ? getScopesAttributes(scopeData) : {}

		// TODO: Remove the fallback once all components are implemented
		// in case comp is not inside repeater, remove hover box suffix if exist
		displayedId = displayedItemId ? displayedId : getDefaultCompId(id)
		const component = deleted ? (
			<DeletedComp />
		) : Comp ? (
			<Comp
				translate={translate}
				className={compProps?.className ? `${compProps.className} ${compId}` : compId}
				{...compProps}
				{...scopeAttr}
				slots={slotsProps}
				id={displayedId}
			>
				{children}
			</Comp>
		) : (
			<DeadComp id={displayedId}>{children()}</DeadComp>
		)

		return (
			<ErrorBoundary
				id={displayedId}
				logger={logger}
				recursiveChildren={children}
				Component={Comp}
				compClassType={compClassType}
				sentryDsn={compProps?.sentryDsn}
			>
				{component}
			</ErrorBoundary>
		)
	}
)

export default StructureComponent
