import { IRegistryRuntime, ILibraryTopology } from '@wix/editor-elements-registry/2.0/types'

export function getRegistryGlobalNamespace() {
	const context = typeof self !== 'undefined' ? self : (globalThis as typeof self)

	if (!context.componentsRegistry) {
		context.componentsRegistry = {}
	}

	return context.componentsRegistry
}
export function getGlobalRegistryRuntime(): IRegistryRuntime | null {
	if (process.env.browser) {
		return window.componentsRegistry?.runtime
	}

	return null
}

export function getComponentsLibrariesFromViewerModel(): Array<ILibraryTopology> {
	if (process.env.browser) {
		const libraries = window.viewerModel.componentsLibrariesTopology
		return libraries ? libraries : []
	}

	return []
}
