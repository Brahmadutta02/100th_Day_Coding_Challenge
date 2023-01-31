import _ from 'lodash'
import { simpleModuleLoader } from './index'

export function adapter(modules: any) {
	return _.mapValues(modules, (module, name) => {
		if (!module || !module.deps) {
			return {
				load: () => Promise.resolve(() => module),
				deps: [],
				name,
			}
		}
		return {
			load: () => Promise.resolve(module.factory),
			deps: module.deps.map((dep: string) => ({ name: dep })),
			name: module.name,
		}
	})
}

export async function getModules(modulesToLoad: any) {
	const { loadModules } = simpleModuleLoader(adapter(modulesToLoad))
	const modules: any = await loadModules(Object.keys(modulesToLoad))
	return _.mapValues(modules, (m: any) => m.instances[0])
}
