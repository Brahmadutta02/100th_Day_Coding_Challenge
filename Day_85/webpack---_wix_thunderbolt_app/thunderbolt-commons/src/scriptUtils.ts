import { BrowserWindow } from '@wix/thunderbolt-symbols'
import _ from 'lodash'

export type PmRpc = {
	api: {
		set(appId: string, api: any): void
		request<T>(appId: string, target: { target: Element | Window | Worker }): Promise<T>
	}
}

declare global {
	interface Window {
		define?: Function & { amd: boolean }
		pmrpc?: PmRpc
	}
}

type ScriptType = 'module'
function _loadScriptTag(src: string, type?: ScriptType): Promise<unknown> {
	return new Promise((resolve, reject) => {
		if (!document) {
			reject('document is not defined when trying to load script tag')
		}
		const script = document.createElement('script')
		script.src = src
		if (type) {
			script.type = type
		}
		script.onerror = reject
		script.onload = resolve
		document.head.appendChild(script)
	})
}

export function loadScriptTag(src: string): Promise<unknown> {
	return _loadScriptTag(src)
}

export function loadModuleScriptTag(src: string): Promise<unknown> {
	return _loadScriptTag(src, 'module')
}

export function loadScriptWithRequireJS<T>(src: string): Promise<T> {
	return new Promise((resolve, reject) => __non_webpack_require__([src], resolve, reject))
}

export const scriptUrls = (moduleRepoUrl: string) => ({
	PM_RPC: `${moduleRepoUrl}/pm-rpc@3.0.3/build/pm-rpc.min.js`,
	REQUIRE_JS: `${moduleRepoUrl}/requirejs-bolt@2.3.6/requirejs.min.js`,
})

export const loadPmRpc = async (moduleRepoUrl: string) => {
	if (window.pmrpc) {
		return window.pmrpc
	}
	if (window.define?.amd) {
		return loadScriptWithRequireJS<PmRpc>(scriptUrls(moduleRepoUrl).PM_RPC) as Promise<PmRpc>
	}
	await loadScriptTag(scriptUrls(moduleRepoUrl).PM_RPC)
	return window.pmrpc!
}

export const loadRequireJS = _.once(
	async (window: NonNullable<BrowserWindow>, moduleRepoUrl = 'https://static.parastorage.com/unpkg') => {
		// since react umd bundles do not define named modules, we must load react before loading requirejs.
		// further details here: https://requirejs.org/docs/errors.html#mismatch
		// requirejs will be hopefully removed once ooi comps will be consumed as comp libraries.
		await window.reactAndReactDOMLoaded
		await loadScriptTag(scriptUrls(moduleRepoUrl).REQUIRE_JS)
		window.define!('lodash', [], () => _)
		window.define!('_', [], () => _)
		window.define!('reactDOM', [], () => window.ReactDOM)
		window.define!('react', [], () => window.React)
		window.define!('imageClientSDK', [], () => window.__imageClientApi__.sdk)
	}
)
