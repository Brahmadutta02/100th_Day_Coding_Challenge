import { Container as InversifyContainer, interfaces } from 'inversify'
import type {
	IocContainer,
	ContainerModuleLoader,
	Identifier,
	TargetName,
	Bind,
	BindToSyntax,
	FactoryWithDependencies,
	ProviderCreator,
	BindWhenSyntax,
} from './types'
import { ModuleMetadataSymbol } from './symbols'
import { getDependencies, isNamed, isMulti, isOptional, withDependencies } from './metadata'

const containersStore = new WeakMap<interfaces.Container, IocContainer>()

const makeFactory = (target: FactoryWithDependencies) => (context: interfaces.Context) => {
	const dependenciesValues = getDependencies(target).map((identifier) => {
		const { container } = context
		if (isNamed(identifier)) {
			if (!container.isBoundNamed(identifier.identifier, identifier.name)) {
				throw new Error(
					`Unbound named dependency ${String(identifier.identifier)}("${
						identifier.name
					}") in module ${target.name.replace(/bound\s/g, '')}`
				)
			}

			return container.getNamed(identifier.identifier, identifier.name)
		}
		if (isMulti(identifier)) {
			return container.isBound(identifier.identifier) ? container.getAll(identifier.identifier) : []
		}
		if (isOptional(identifier)) {
			return container.isBound(identifier.identifier) ? container.get(identifier.identifier) : undefined
		}

		if (!container.isBound(identifier)) {
			throw new Error(`Unbound dependency ${String(identifier)} in module ${target.name.replace(/bound\s/g, '')}`)
		}
		return container.get(identifier)
	})
	return target(...dependenciesValues)
}

const makeProvider = (container: IocContainer, target: ProviderCreator<any>) => (context: interfaces.Context) =>
	target(containersStore.get(context.container)!)

export class Container implements IocContainer {
	constructor(private container: interfaces.Container = new InversifyContainer()) {
		this.container.options.defaultScope = 'Singleton'
		containersStore.set(this.container, this)
	}

	private bindAll(...identifiers: Array<Identifier>) {
		if (identifiers.length <= 1) {
			return this.createBindSyntax()(...identifiers)
		}

		return {
			toConstantValue: () => {
				throw new Error('toConstantValue() is not supported with multiple identifiers')
			},
			toProvider: () => {
				throw new Error('toProvider() is not supported with multiple identifiers')
			},
			to: (factory: FactoryWithDependencies) => {
				const bind = this.createBindSyntax()
				let instance: any
				function singletonFactory(...args: any) {
					if (!instance) {
						instance = factory(...args)
					}
					return instance
				}

				Object.defineProperty(singletonFactory, 'name', {
					value: factory.name,
					configurable: true,
				})
				const withDependenciesFactory = withDependencies(
					factory[ModuleMetadataSymbol].dependencies,
					singletonFactory
				)
				identifiers.forEach((symbol: symbol) => bind(symbol).to(withDependenciesFactory))

				return {
					whenTargetNamed: () => {
						throw new Error('whenTargetNamed() is not supported with multiple identifiers')
					},
				}
			},
		}
	}

	private createBindSyntax(): Bind {
		return (identifier) => {
			const fullBindToSyntax = this.container.bind(identifier)
			return this.createBindToSyntax(fullBindToSyntax)
		}
	}

	private createRebindSyntax(): Bind {
		return (identifier) => {
			const fullBindToSyntax = this.container.rebind(identifier)
			return this.createBindToSyntax(fullBindToSyntax)
		}
	}

	private createBindToSyntax<T>(fullBindToSyntax: interfaces.BindingToSyntax<any>): BindToSyntax<T> {
		return {
			to: (target: FactoryWithDependencies) => {
				const fullBindingInWhenOnSyntax = fullBindToSyntax.toDynamicValue(makeFactory(target))
				return this.createBindWhenSyntax(fullBindingInWhenOnSyntax)
			},
			toConstantValue: (target) => {
				const fullBindingInWhenOnSyntax = fullBindToSyntax.toConstantValue(target)
				return this.createBindWhenSyntax(fullBindingInWhenOnSyntax)
			},
			toProvider: (target) => {
				const fullBindingInWhenOnSyntax = fullBindToSyntax.toProvider(makeProvider(this, target))
				return this.createBindWhenSyntax(fullBindingInWhenOnSyntax)
			},
		}
	}

	private createBindWhenSyntax(fullBindingInWhenOnSyntax: interfaces.BindingWhenSyntax<any>): BindWhenSyntax {
		return {
			whenTargetNamed: (name: TargetName) => {
				fullBindingInWhenOnSyntax.whenTargetNamed(name)
			},
		}
	}

	get<T>(identifier: Identifier): T {
		return this.container.get(identifier)
	}

	getAll<T>(identifier: Identifier): Array<T> {
		return this.container.isBound(identifier) ? this.container.getAll(identifier) : []
	}

	getNamed<T>(identifier: Identifier, name: string): T {
		return this.container.getNamed(identifier, name)
	}

	load(...moduleLoaders: Array<ContainerModuleLoader>) {
		moduleLoaders.forEach((loader) => {
			loader(this.bindAll.bind(this))
		})
	}

	bind<T>(identifier: Identifier): BindToSyntax<T> {
		return this.createBindSyntax()(identifier)
	}

	rebind<T>(identifier: Identifier): BindToSyntax<T> {
		return this.createRebindSyntax()(identifier)
	}

	createChild() {
		return new Container(this.container.createChild())
	}
}
