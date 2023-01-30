import { ModuleDeps, ModuleMetadata } from './types'

export { adapter as metadataAdapter, getModules } from './adapter'

type Modules = Record<string, { instances: Array<object>; length: number }>

export function simpleModuleLoader(modulesMetadata: Record<string, ModuleMetadata>) {
	const modules: Modules = {}

	function loadModules(modulesToLoad: Array<string>) {
		// can be improved with deps counter
		const isAllDepsLoaded = (deps: ModuleDeps) =>
			deps.every(
				(d) =>
					modules[d.name] &&
					modules[d.name].instances &&
					modules[d.name].instances.length === modules[d.name].length
			)

		const resolveDeps: (deps: ModuleDeps) => Array<object> = (deps: ModuleDeps) =>
			deps.map((d) => (d.isArray ? modules[d.name].instances : modules[d.name].instances[0]))

		const allModulesLoaded = () =>
			Object.keys(modulesMetadata)
				.filter((m) => modulesToLoad.includes(m))
				.every((m) => modulesMetadata[m] && modulesMetadata[m].instance)

		const isModuleWaitingForThisModule = (thisModule: string, moduleName: string) =>
			modulesMetadata[moduleName].factory &&
			!modulesMetadata[moduleName].instance &&
			(modulesMetadata[moduleName].depsDeep?.includes(thisModule) ||
				modulesMetadata[moduleName].deps.map((d) => d.name).includes(thisModule))

		function checkDeps(moduleName: string) {
			modulesToLoad.forEach((mod) => {
				if (isModuleWaitingForThisModule(moduleName, mod) && isAllDepsLoaded(modulesMetadata[mod].deps)) {
					initModule(mod, modulesMetadata[mod].name)
				}
			})
		}

		function initModule(moduleName: string, name: string) {
			const instance = modulesMetadata[moduleName].factory?.(...resolveDeps(modulesMetadata[moduleName].deps))
			modules[name].instances.push(instance as object)
			modulesMetadata[moduleName].instance = true
			checkDeps(name)
		}

		return new Promise((resolve) => {
			modulesToLoad.forEach((moduleName) => {
				const { name, deps, load, factory } = modulesMetadata[moduleName]
				if (factory) {
					return
				} // module is already loaded

				load().then((module) => {
					// saving factory function for later use (if cant initiate module right now)
					modulesMetadata[moduleName].factory = module

					// registering the module (not the instance, just the module)
					if (!modules[name]) {
						modules[name] = {
							instances: [],
							// tracking the length to know when the dependency is ready to be injected to other modules (multiple modules might implement a single dependency)
							length: Object.keys(modulesMetadata).filter(
								(m) => modulesToLoad.includes(m) && modulesMetadata[m].name === name
							).length,
						}
					}

					if (isAllDepsLoaded(deps)) {
						initModule(moduleName, name)
					}

					if (allModulesLoaded()) {
						resolve(modules)
					}
				})
			})
		})
	}

	// dynamically load a single module
	// async function loadModule(moduleName: string, multiInject: boolean = false) {
	// 	const modulesToLoad = [moduleName, ...modulesMetadata[moduleName].depsDeep]
	// 	const loadedModules = await loadModules(modulesToLoad)
	// 	return multiInject ? loadedModules[moduleName].instances : loadedModules[moduleName].instances[0]
	// }

	return {
		loadModules,
	}
}
