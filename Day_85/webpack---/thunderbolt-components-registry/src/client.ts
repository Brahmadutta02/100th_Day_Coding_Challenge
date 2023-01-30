import { IComponentsRegistrar } from '@wix/thunderbolt-components-loader'
import { getGlobalRegistryRuntime, getComponentsLibrariesFromViewerModel } from './runtime'
import { IRegistryRunAndReport, getReportMetricName } from './metrics'

import { registry, IThunderboltComponentsRegistry } from '@wix/editor-elements-registry/2.0/thunderbolt'

/**
 * Components Registry for Thunderbolt Client Side Rendering
 */
export interface IComponentsRegistryCSR {
	getRegistryAPI: () => IThunderboltComponentsRegistry
	/**
	 * Legacy API is used for migrating to the thunderbolt + registry integration
	 */
	getComponentsLibrariesAPI: () => IComponentsRegistrar
}

const METRIC_CREATE_REGISTRY = getReportMetricName({ host: 'viewer' })

export async function createComponentsRegistryCSR({
	runAndReport,
}: IRegistryRunAndReport): Promise<IComponentsRegistryCSR> {
	if (window.componentsRegistry) {
		await window.componentsRegistry.runtimeReady
	}

	const runtime = getGlobalRegistryRuntime()
	const libraries = getComponentsLibrariesFromViewerModel()

	const registryAPI = await runAndReport(METRIC_CREATE_REGISTRY, () =>
		registry({
			options: {
				useScriptsInsteadOfEval: true,
				usePartialManifests: true,
			},
			mode: 'lazy',
			libraries: [...(runtime?.libraries || []), ...libraries],
		})
	)

	/**
	 * Workaround until deduplication is fixed at registry
	 */
	let pending: Promise<void> | null = null
	return {
		getComponentsLibrariesAPI() {
			return {
				getComponents() {
					return registryAPI.getComponentsLoaders()
				},
				async getAllComponentsLoaders() {
					if (!pending) {
						pending = registryAPI.ensureManifestsAreLoaded()
					}

					await pending

					return registryAPI.getComponentsLoaders()
				},
			}
		},
		getRegistryAPI() {
			return registryAPI
		},
	}
}
