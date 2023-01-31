import _ from 'lodash'
// wix code and blocks viewer apps expects regeneratorRuntime to be defined :/
// https://wix.slack.com/archives/CKDB50KE2/p1655630884212889
// https://wix.slack.com/archives/CGJREGM7B/p1653330082949059
import 'regenerator-runtime/runtime'
import type { ModuleLoader } from '@wix/thunderbolt-symbols'
import type { ModuleFactory, ScriptCache } from './types'
import { fetchEval } from './fetchEval'

declare let self: DedicatedWorkerGlobalScope & {
	define?: ((nameOrDependencies: string | Array<string>, dependenciesOrFactory: Array<string> | Function, factory?: Function) => void) & { amd?: boolean }
}

export default function ({ scriptsCache }: { scriptsCache: ScriptCache }): ModuleLoader {
	const defaultDependencies: { [name: string]: unknown } = {
		lodash: _,
		_,
		'wix-data': { default: { dsn: 'https://b58591105c1c42be95f1e7a3d5b3755e@sentry.io/286440' } },
	}
	const resolveDeps = ({ url, moduleDependenciesIds, dependencies }: { url: string; moduleDependenciesIds: Array<string>; dependencies: Record<string, unknown> }): Array<unknown> => {
		if (dependencies.globals) {
			/** Temporary fix for blocks viewer app - since they use the wix-code-bundler and it does not pass the "globals" string as deps we will inject it
			 	until they pass "globals" to the dependency list (and then it will be resoled automatically with the code below)
			 	more info here: https://wix.slack.com/archives/C02SQCQ5G1J/p1644349623037979?thread_ts=1644340840.426809&cid=C02SQCQ5G1J
			 */
			return [dependencies.globals]
		}
		return moduleDependenciesIds.map((id: string) => {
			if (!(id in dependencies)) {
				throw new Error(`Module "${url}" dependency "${id}" is missing from provided dependencies map`)
			}
			return dependencies[id]
		})
	}

	return {
		loadModule: async (url, moduleDependencies = {}) => {
			const dependencies = { ...defaultDependencies, ...moduleDependencies }
			if (scriptsCache[url]) {
				const deps = resolveDeps({ url, dependencies, moduleDependenciesIds: scriptsCache[url].moduleDependenciesIds || [] })
				return scriptsCache[url](...deps)
			}

			let moduleFactory: ModuleFactory = _.noop
			let moduleInstance = null

			const defineAmdGlobals = () => {
				self.define = (nameOrDependenciesIds: string | Array<string>, dependenciesIdsOrFactory: Array<string> | Function, factory: Function | undefined) => {
					const isNamedDefine = _.isString(nameOrDependenciesIds)
					// const moduleName = isNamedDefine ? args[0] : null
					const moduleDependenciesIds = ((isNamedDefine ? dependenciesIdsOrFactory : nameOrDependenciesIds) || []) as Array<string>
					const amdModuleFactory = (isNamedDefine ? factory : dependenciesIdsOrFactory) as ModuleFactory
					// save factory for caching
					moduleFactory = amdModuleFactory
					// save moduleDependenciesIds to use it when moduleFactory is cached.
					moduleFactory.moduleDependenciesIds = moduleDependenciesIds
					moduleInstance = amdModuleFactory(...resolveDeps({ url, moduleDependenciesIds, dependencies }))
				}

				self.define.amd = true
			}
			const cleanupAmdGlobals = () => delete self.define

			const fetchModule = () => fetchEval(url, { beforeEval: defineAmdGlobals, afterEval: cleanupAmdGlobals })

			try {
				await fetchModule()
			} catch {
				await fetchModule() // retry
			}

			scriptsCache[url] = moduleFactory

			return moduleInstance
		},
	}
}
