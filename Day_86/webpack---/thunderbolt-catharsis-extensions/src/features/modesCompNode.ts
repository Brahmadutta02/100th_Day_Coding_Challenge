import { hasResponsiveLayout } from '../utils/hasResponsiveLayout'
import { Component, ComponentOverride } from '@wix/thunderbolt-becky-types'
import { CompNode, createCompNode, NodeRefs } from '@wix/thunderbolt-catharsis'
import _ from 'lodash'
import { CssObject, Modes } from '../shared.types'

type StructureOverrides = Array<keyof ComponentOverride>
type ComponentModes = { [modeId: string]: Component }

const EMPTY_ARRAY: Array<ComponentOverride> = []

const getComponentsModes = (component: Component, overrides: StructureOverrides): ComponentModes =>
	(component.modes?.overrides || EMPTY_ARRAY).reduce<ComponentModes>(
		(acc, override) => {
			if (overrides.some((field) => override[field]) && override.modeIds) {
				const [modeId] = override.modeIds
				acc[modeId] = { ...component, ...override }
			}
			return acc
		},
		{ '': component }
	)

export const withModes = <TDependencies, TViewerItem extends CssObject | null, TComponentNodeRefs>(
	compNode: CompNode<TDependencies, TViewerItem, TComponentNodeRefs>,
	structureOverrides: StructureOverrides
) =>
	createCompNode({
		getDependencies: (component: Component, refs: NodeRefs<TComponentNodeRefs>) => {
			if (hasResponsiveLayout(component)) {
				return null
			}

			const modes = getComponentsModes(component, structureOverrides)

			return {
				modes: _.mapValues(modes, (__, modeId) => (modeId ? refs.modes(modeId) : null)),
				deps: _.mapValues(modes, (comp) => compNode.getDependencies(comp, refs)),
			}
		},
		toViewItem: (component, deps) => {
			if (!deps) {
				return null
			}

			const modes = getComponentsModes(component, structureOverrides)

			const css = Object.keys(modes).reduce<Partial<Record<Modes, CssObject | null>>>((acc, modeId) => {
				const prefix = deps.modes[modeId]?.prefix || ''
				acc[prefix] = compNode.toViewItem(modes[modeId], deps.deps[modeId])
				return acc
			}, {})

			return { type: 'classic' as const, css }
		},
	})
