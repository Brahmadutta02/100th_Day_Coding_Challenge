import { loadScriptWithRequireJS } from '@wix/thunderbolt-commons'
import { ModuleFederationContainer, WebpackSharedScope } from '../types'

export async function loadComponentWithModuleFederation(
	moduleFederationEntryUrl: string,
	widgetName: string,
	sharedScope: WebpackSharedScope
) {
	const container = (await loadScriptWithRequireJS(moduleFederationEntryUrl)) as ModuleFederationContainer
	const component = await loadComponent(container, widgetName, sharedScope)
	return component
}

async function loadComponent(container: ModuleFederationContainer, module: string, sharedScope: WebpackSharedScope) {
	await container.init(sharedScope)
	const factory = await container.get(module)
	const component = factory()
	return component
}
