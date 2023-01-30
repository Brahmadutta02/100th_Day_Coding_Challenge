import { FetchFn, SiteAssetsClientTopology, SiteAssetsManifests, SiteAssetsModuleName } from '@wix/thunderbolt-symbols'
import { FetcherRequest, ModuleFetchRequest, SiteAssetsModuleFetcher } from '@wix/site-assets-client'
import { loadRequireJS, loadScriptWithRequireJS } from '@wix/thunderbolt-commons'

type Topology = {
	pathInFileRepo: SiteAssetsClientTopology['pathOfTBModulesInFileRepoForFallback']
	fileRepoUrl: SiteAssetsClientTopology['fileRepoUrl']
}

function evalModule(
	moduleCode: string,
	/**
	 * here we define the scope which the "eval" would use:
	 * when the module code is evaluated, it usually checks which variables globally defined,
	 * so it would know which environment it runs in ("UMD")
	 *
	 * Usually most modules start with the following statements:
	 *
	 * if (typeof define === "function" & define.amd )
	 *     define(function(){ return myLib; });
	 * else if (typeof module === "object" && module.exports)
	 *    module.exports = myLib;
	 *
	 * (@see https://github.com/umdjs/umd)
	 *
	 * We want to make the module think we are in Node environment, so it would set it's output
	 * to "module.exports" - where we could easily access it.
	 *
	 * to achieve that, we set the following variables
	 * - `define` - checked in UMD to see if we are in "RequireJS" browser env. we unset it so it won't detect it.
	 * - `module` - checked in UMD to see if we are in node env. we set it so it would use this one
	 * - `exports` - some UMD checks also check for this one. usually unused
	 *
	 * also, by defining all these variables locally, we don't pollute the global "module" (if it exists somehow..)
	 *
	 * Note: we need to make sure these variable names are not being mangled or removed! (e.g. in UglifyJS)
	 */
	module: any = {},
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	exports: any = {},
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	define = {}
) {
	// eslint-disable-next-line no-eval
	eval(moduleCode)
	// populated by the evaluated code:
	return module.exports
}

async function loadModuleByUrl(fetchFn: FetchFn, moduleFileUrl: string): Promise<any> {
	const moduleFileResponse = await fetchFn(moduleFileUrl)
	const moduleFileScript = await moduleFileResponse.text()
	return evalModule(moduleFileScript)
}

async function loadBeckyModule(
	moduleName: SiteAssetsModuleName,
	manifests: SiteAssetsManifests,
	{ pathInFileRepo, fileRepoUrl }: Topology,
	fetchFn: FetchFn,
	env: 'web' | 'webWorker' = 'web',
	cachedModules: { [moduleUrl: string]: any } = {}
) {
	const pathInBeckyRepo = `${pathInFileRepo}${env === 'webWorker' ? 'site-assets-webworker/' : ''}`
	if (env === 'web') {
		const webpackRuntimeBundleHash: string = manifests[env].webpackRuntimeBundle
		const webpackRuntimeBundleUrl = `${fileRepoUrl}/${pathInBeckyRepo}webpack-runtime.${webpackRuntimeBundleHash}.js`
		if (cachedModules[webpackRuntimeBundleUrl]) {
			await cachedModules[webpackRuntimeBundleUrl]
		} else {
			const webpackLoad = loadModuleByUrl(fetchFn, webpackRuntimeBundleUrl)
			cachedModules[webpackRuntimeBundleUrl] = webpackLoad
			await webpackLoad
		}
	}

	const moduleHash: string = manifests[env].modulesToHashes[moduleName]
	const moduleFileUrl = `${fileRepoUrl}/${pathInBeckyRepo}${moduleName}.${moduleHash}.js`
	if (cachedModules[moduleFileUrl]) {
		return cachedModules[moduleFileUrl]
	} else {
		const modulePromise = loadModuleByUrl(fetchFn, moduleFileUrl).then((result) => result.default)
		cachedModules[moduleFileUrl] = modulePromise
		return modulePromise
	}
}

async function loadDataFixersModule(
	moduleName: string,
	version: string,
	moduleRepoUrl: string,
	env: 'web' | 'webWorker' = 'web',
	fetchFn: FetchFn
) {
	const santaDataFixerModuleFileUrl = (() => {
		const santaDataFixerModuleSuffix = env === 'web' ? 'thunderbolt' : 'thunderbolt-webworker'

		if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
			// use hardcoded version that includes thunderbolt dedicated build
			return `${moduleRepoUrl}/@wix/${moduleName}@${version}/dist/${moduleName}-${santaDataFixerModuleSuffix}.js`
		} else {
			return `${moduleRepoUrl}/@wix/${moduleName}@${version}/dist/${moduleName}-${santaDataFixerModuleSuffix}.min.js`
		}
	})()

	if (env === 'web') {
		await loadRequireJS(window, moduleRepoUrl)
		return loadScriptWithRequireJS(santaDataFixerModuleFileUrl)
	} else {
		return loadModuleByUrl(fetchFn, santaDataFixerModuleFileUrl)
	}
}

export const clientModuleFetcher = (
	fetchFn: FetchFn,
	{ fileRepoUrl, pathOfTBModulesInFileRepoForFallback, moduleRepoUrl }: SiteAssetsClientTopology,
	manifests: { thunderbolt: SiteAssetsManifests },
	env: 'web' | 'webWorker' = 'web'
): SiteAssetsModuleFetcher => {
	const cachedModules: { [moduleUrl: string]: any } = {}
	async function handleModuleFetchRequest(request: ModuleFetchRequest) {
		const { module, version } = request

		if (module.startsWith('thunderbolt-')) {
			const topology: Topology = {
				fileRepoUrl,
				pathInFileRepo: pathOfTBModulesInFileRepoForFallback,
			}
			return loadBeckyModule(
				module as SiteAssetsModuleName,
				manifests.thunderbolt,
				topology,
				fetchFn,
				env,
				cachedModules
			)
		} else {
			return loadDataFixersModule(module, version, moduleRepoUrl, env, fetchFn)
		}
	}
	return {
		fetch: async <T>(request: FetcherRequest): Promise<T> => {
			if ('module' in request) {
				return handleModuleFetchRequest(request)
			}

			return loadModuleByUrl(fetchFn, request.fromUrl)
		},
	}
}
