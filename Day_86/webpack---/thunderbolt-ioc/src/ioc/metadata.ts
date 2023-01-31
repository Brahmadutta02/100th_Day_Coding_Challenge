import type {
	FactoryWithDependencies,
	Identifier,
	Factory,
	NamedIdentifier,
	MultiIdentifier,
	Dependencies,
	OptionalIdentifier,
} from './types'
import { ModuleMetadataSymbol } from './symbols'

export const withDependencies = <T>(
	dependencies: Array<Dependencies>,
	target: Factory<T>
): FactoryWithDependencies<T> => {
	const _target = target.bind(null) as FactoryWithDependencies
	_target[ModuleMetadataSymbol] = {
		dependencies,
	}
	return _target
}

export const getDependencies = (target: FactoryWithDependencies): Array<Dependencies> =>
	target[ModuleMetadataSymbol].dependencies

export const named = (identifier: Identifier, name: string): NamedIdentifier => ({
	name,
	identifier,
})

export const isNamed = (identifier: any): identifier is NamedIdentifier => !!(identifier.name && identifier.identifier)

export const multi = (identifier: any): MultiIdentifier => ({
	identifier,
	multi: true,
})

export const isMulti = (identifier: any): identifier is MultiIdentifier => !!(identifier.multi && identifier.identifier)

export const optional = (identifier: any): OptionalIdentifier => ({
	identifier,
	optional: true,
})

export const isOptional = (identifier: any): identifier is OptionalIdentifier =>
	!!(identifier.optional && identifier.identifier)
