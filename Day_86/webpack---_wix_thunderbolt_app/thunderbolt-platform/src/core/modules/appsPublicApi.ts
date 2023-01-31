import _ from 'lodash'
import { createPromise } from '@wix/thunderbolt-commons'
import type { IPlatformLogger, PublicAPI, ClientSpecMapAPI, IModelsAPI, Initializable } from '@wix/thunderbolt-symbols'
import type { BootstrapData } from '../../types'
import type { IViewerHandlers } from '../types'
import { MODELS_API, CLIENT_SPEC_MAP_API, PLATFORM_LOGGER, VIEWER_HANDLERS, BOOTSTRAP_DATA, IMPORT_SCRIPTS, APPS_PUBLIC_API } from './moduleNames'

type PublicApiProviderFunc = (appDefinitionId: string) => void

export type IAppsPublicApi = {
	resolvePublicApi: (appDefinitionId: string, publicApi: PublicAPI) => void
	getPublicApi: (appDefinitionId: string) => Promise<PublicAPI>
	registerPublicApiProvider: (publicApiProviderFunc: PublicApiProviderFunc) => void
}
type PublicApisPromises = { [appDefinitionId: string]: { setPublicApi: (api: PublicAPI) => void; publicApiPromise: Promise<PublicAPI> } }

const createPromiseForApp = () => {
	const { resolver, promise } = createPromise<PublicAPI>()
	return { publicApiPromise: promise, setPublicApi: resolver }
}

const AppsPublicApi = (
	modelsApi: IModelsAPI,
	clientSpecMapApi: ClientSpecMapAPI,
	logger: IPlatformLogger,
	{ viewerHandlers }: IViewerHandlers,
	bootstrapData: BootstrapData,
	importScripts: (url: string) => Promise<void>
): Initializable & IAppsPublicApi => {
	const publicApisPromises: PublicApisPromises = _.mapValues(modelsApi.getApplications(), createPromiseForApp)
	let publicApiProviderFunc: PublicApiProviderFunc
	const pageId = bootstrapData.currentPageId

	async function getPublicApi(appDefinitionId: string) {
		if (!clientSpecMapApi.isAppOnSite(appDefinitionId)) {
			throw new Error(`getPublicAPI() of ${appDefinitionId} failed. The app does not exist on site.`)
		}
		if (!publicApisPromises[appDefinitionId]) {
			publicApisPromises[appDefinitionId] = createPromiseForApp()
			if (!publicApiProviderFunc) {
				logger.captureError(new Error('appsPublicApiManager Error: runApplicationFunc is not a function'), {
					tags: { appsPublicApiManager: true },
					extra: { appDefinitionId },
				})
				throw new Error(`getPublicAPI() of ${appDefinitionId} failed`)
			}
			publicApiProviderFunc(appDefinitionId) // the provider resolves the publicApisPromises[appDefinitionId] promise
		}

		return publicApisPromises[appDefinitionId].publicApiPromise
	}

	const resolvePublicApi = (appDefinitionId: string, publicApi: PublicAPI): void => {
		publicApisPromises[appDefinitionId].setPublicApi(publicApi)
	}

	const registerPublicApiProvider = (_publicApiProviderFunc: PublicApiProviderFunc) => {
		publicApiProviderFunc = _publicApiProviderFunc

		if (process.env.browser) {
			viewerHandlers.publicApiTpa.registerPublicApiGetter(async () => {
				if (!self.pmrpc) {
					await logger.runAsyncAndReport(`import_scripts_pm-rpc`, async () => {
						try {
							await importScripts('https://static.parastorage.com/unpkg/pm-rpc@3.0.3/build/pm-rpc.min.js')
						} catch {
							await importScripts('https://static.parastorage.com/unpkg/pm-rpc@3.0.3/build/pm-rpc.min.js') // retry
						}
					})
				}

				// wix code has hard time when we call their createControllers() with no controllers
				const wixCodeAppDefinitionId = clientSpecMapApi.getWixCodeAppDefinitionId()
				const publicApis = await Promise.all(
					clientSpecMapApi
						.getAppsOnSite()
						.filter((appDefinitionId) => appDefinitionId !== wixCodeAppDefinitionId)
						.map(async (appDefinitionId) => {
							const publicAPI = await getPublicApi(appDefinitionId)
							return { appDefinitionId, publicAPI }
						})
				)

				return publicApis
					.filter(({ publicAPI }) => publicAPI)
					.map(({ appDefinitionId, publicAPI }) => {
						const name = `viewer_platform_public_api_${appDefinitionId}_${pageId}`
						self.pmrpc!.api.set(name, publicAPI)
						return name
					})
			})
		}
	}

	return {
		init: () => {
			if (_.isEmpty(modelsApi.getApplications()) && modelsApi.hasTPAComponentOnPage()) {
				// a TPA component may Wix.SuperApps.getPublicAPI(). the below code resolves this promise.
				registerPublicApiProvider((appDefinitionId) => {
					resolvePublicApi(appDefinitionId, null)
				})
			}
		},
		resolvePublicApi,
		registerPublicApiProvider,
		getPublicApi,
	}
}

export default {
	factory: AppsPublicApi,
	deps: [MODELS_API, CLIENT_SPEC_MAP_API, PLATFORM_LOGGER, VIEWER_HANDLERS, BOOTSTRAP_DATA, IMPORT_SCRIPTS],
	name: APPS_PUBLIC_API,
}
