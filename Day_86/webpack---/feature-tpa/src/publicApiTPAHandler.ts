import { named, optional, withDependencies } from '@wix/thunderbolt-ioc'
import {
	PlatformWorkerPromise,
	PlatformWorkerPromiseSym,
	SdkHandlersProvider,
	PublicAPI,
	TpaHandlerProvider,
	FeatureStateSymbol,
	IPageWillUnmountHandler,
	ViewerModel,
	ViewerModelSym,
} from '@wix/thunderbolt-symbols'
import { createPromise, loadPmRpc } from '@wix/thunderbolt-commons'
import type { IFeatureState } from 'thunderbolt-feature-state'
import { name } from './symbols'
import { AppsPublicApisGetter, PublicApiTpaSdkHandlers } from './types'

type TpaState = {
	publicApiTPAHandlerState: null | {
		wixCodeWorkerReadyPromise?: Promise<{}>
		resolvePublicApiGetter: (appsPublicApisGetter: AppsPublicApisGetter) => void
		waitForAppsToRegister: Promise<AppsPublicApisGetter>
	}
}

/**
 * Retrieves a platform app's public API if there's at least one (any) platform controller on page
 * Returns null otherwise
 */
export const PublicApiTPAHandler = withDependencies(
	[named(FeatureStateSymbol, name), optional(PlatformWorkerPromiseSym), ViewerModelSym],
	(
		featureState: IFeatureState<TpaState>,
		platformWorkerPromiseObj: {
			platformWorkerPromise: PlatformWorkerPromise
		},
		{ siteAssets, mode: { debug } }: ViewerModel
	): TpaHandlerProvider & SdkHandlersProvider<PublicApiTpaSdkHandlers> & IPageWillUnmountHandler => {
		const {
			promise: waitForAppsToRegister,
			resolver: resolvePublicApiGetter,
		} = createPromise<AppsPublicApisGetter>()

		featureState.update(() => ({
			...featureState.get(),
			publicApiTPAHandlerState: {
				resolvePublicApiGetter,
				waitForAppsToRegister,
			},
		}))

		const waitForWixCodeWorkerToBeReady = async () => {
			if (debug) {
				console.warn(
					'getPublicApi() has high performance overhead as we download and execute all apps on site. consider mitigating this by e.g migrating to Wix Blocks or OOI.'
				)
			}

			const [pmRpc, worker, getPublicApiNames] = await Promise.all([
				loadPmRpc(siteAssets.clientTopology.moduleRepoUrl),
				platformWorkerPromiseObj.platformWorkerPromise as Promise<Worker>,
				featureState.get().publicApiTPAHandlerState!.waitForAppsToRegister,
			])

			const appsPublicApisNames = await getPublicApiNames()

			if (!appsPublicApisNames.length) {
				const errorMessage = 'getPublicApi() rejected since there are no platform apps on page'
				if (debug) {
					console.warn(errorMessage)
				}
				throw new Error(errorMessage)
			}

			await Promise.all(
				appsPublicApisNames.map((appName: string) =>
					pmRpc.api.request(appName, { target: worker }).then((publicAPI: PublicAPI) => {
						pmRpc.api.set(appName, publicAPI)
					})
				)
			)

			return {}
		}

		return {
			pageWillUnmount() {
				featureState.update(() => ({
					...featureState.get(),
					publicApiTPAHandlerState: null,
				}))
			},
			getTpaHandlers() {
				return {
					waitForWixCodeWorkerToBeReady: () => {
						const publicApiTPAHandlerState = featureState.get().publicApiTPAHandlerState!

						if (publicApiTPAHandlerState.wixCodeWorkerReadyPromise) {
							return publicApiTPAHandlerState.wixCodeWorkerReadyPromise
						}

						const wixCodeWorkerReadyPromise = waitForWixCodeWorkerToBeReady()
						featureState.update(() => ({
							...featureState.get(),
							publicApiTPAHandlerState: { ...publicApiTPAHandlerState, wixCodeWorkerReadyPromise },
						}))

						return wixCodeWorkerReadyPromise
					},
				}
			},
			getSdkHandlers: () => ({
				publicApiTpa: {
					registerPublicApiGetter: (appsPublicApisGetter: AppsPublicApisGetter) => {
						featureState.get().publicApiTPAHandlerState?.resolvePublicApiGetter(appsPublicApisGetter)
					},
				},
			}),
		}
	}
)
