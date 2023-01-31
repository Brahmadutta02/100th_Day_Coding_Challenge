import _ from 'lodash'
import 'proxy-polyfill'
import { proxy, wrap, createEndpoint } from 'comlink/dist/esm/comlink.js' // eslint-disable-line no-restricted-syntax
import { withDependencies } from '@wix/thunderbolt-ioc'
import {
	AppDidMountPromiseSymbol,
	BrowserWindow,
	BrowserWindowSymbol,
	IAppWillRenderFirstPageHandler,
	IComponentsStylesOverrides,
	IPropsStore,
	Props,
	Structure,
	ComponentsStylesOverridesSymbol,
	PlatformWorkerPromiseSym,
	PlatformWorkerPromise,
	ILogger,
	LoggerSymbol,
	IStructureStore,
} from '@wix/thunderbolt-symbols'
import { IWarmupDataProvider, WarmupDataProviderSymbol } from 'feature-warmup-data'
import type { BootstrapData, PlatformInitializer, PlatformWarmupData } from '../types'
import type { InvokeSiteHandler, InvokeViewerHandler, PlatformClientWorkerAPI } from '../core/types'

export default withDependencies<PlatformInitializer>(
	[WarmupDataProviderSymbol, AppDidMountPromiseSymbol, Props, Structure, BrowserWindowSymbol, ComponentsStylesOverridesSymbol, LoggerSymbol, PlatformWorkerPromiseSym],
	(
		warmupDataProvider: IWarmupDataProvider,
		appDidMountPromise: Promise<unknown>,
		propsStore: IPropsStore,
		structureStore: IStructureStore,
		window: BrowserWindow,
		componentsStylesOverrides: IComponentsStylesOverrides,
		logger: ILogger,
		{ platformWorkerPromise }: { platformWorkerPromise: PlatformWorkerPromise }
	): PlatformInitializer & IAppWillRenderFirstPageHandler => {
		platformWorkerPromise.then((worker) =>
			worker!.addEventListener('error', ({ message }) => {
				logger.captureError(new Error(message), {
					tags: { feature: 'platform', worker: true },
				})
			})
		)

		return {
			async initPlatformOnSite(bootstrapData: BootstrapData, invokeSiteHandler: InvokeSiteHandler) {
				const worker = (await platformWorkerPromise)!
				const { initPlatformOnSite }: PlatformClientWorkerAPI = wrap(worker)
				initPlatformOnSite(
					bootstrapData,
					proxy(async (...args) => {
						const res = await invokeSiteHandler(...args)
						return _.isFunction(res) ? proxy(res) : res
					})
				)
			},
			async runPlatformOnPage(bootstrapData: BootstrapData, invokeViewerHandler: InvokeViewerHandler) {
				const worker = (await platformWorkerPromise)!
				const workerProxy = wrap(worker)
				const workerMessagePort = await workerProxy[createEndpoint]()
				// prevent malicious "self.onmessage =" user code from sniffing messages upon navigation, specifically platformEnvData.site.applicationsInstances.
				const workerSecureProxy: PlatformClientWorkerAPI = wrap(workerMessagePort)
				return workerSecureProxy.runPlatformOnPage(
					bootstrapData,
					proxy(async (...args) => {
						const res = await invokeViewerHandler(...args)
						return _.isFunction(res) ? proxy(res) : res
					})
				)
			},
			async updateProps(partialProps) {
				const platformWarmupData = await warmupDataProvider.getWarmupData<PlatformWarmupData>('platform')
				if (platformWarmupData /* TODO && !preview */) {
					// queue props to be flushed after hydration. function props are not queued cause they're set via the registerEvent() viewer api.
					// ooi props are not queued cause they're set via the setControllerProps() viewer api.
					await appDidMountPromise
				}
				propsStore.update(partialProps)
			},
			async updateStyles(styleData) {
				const platformWarmupData = await warmupDataProvider.getWarmupData<PlatformWarmupData>('platform')
				if (platformWarmupData /* TODO && !preview */) {
					// queue styles to be flushed after hydration.
					await appDidMountPromise
				}
				componentsStylesOverrides.set(styleData as {})
			},
			async updateStructure(partialStructure) {
				const platformWarmupData = await warmupDataProvider.getWarmupData<PlatformWarmupData>('platform')
				if (platformWarmupData) {
					await appDidMountPromise
				}
				structureStore.update(partialStructure)
			},
			async appWillRenderFirstPage() {
				// update props store with props from warmup data before hydrating
				const platformWarmupData = await warmupDataProvider.getWarmupData<PlatformWarmupData>('platform')
				platformWarmupData?.ssrPropsUpdates.forEach(propsStore.update) // eslint-disable-line no-unused-expressions
				platformWarmupData?.ssrStyleUpdates.forEach(componentsStylesOverrides.set) // eslint-disable-line no-unused-expressions
			},
		}
	}
)
