import _ from 'lodash'
import type { ICommonConfigModule, IPlatformLogger, SessionServiceAPI, WixCodeBootstrapData, PlatformEnvData } from '@wix/thunderbolt-symbols'
import { WixCodeAppDefId } from './constants'

declare let self: DedicatedWorkerGlobalScope & { elementorySupport: any }

export function elementorySupportScriptUrlFor(wixCodeBootstrapData: WixCodeBootstrapData) {
	return `${wixCodeBootstrapData.wixCodePlatformBaseUrl}/elementory-browser-support.min.js`
}

const createElementorySupportQueryParams = ({ codeAppId, wixCodeInstance, viewMode }: { codeAppId: string; wixCodeInstance: string; viewMode: string }) =>
	`?gridAppId=${codeAppId}&instance=${wixCodeInstance}&viewMode=${viewMode}`

export const importAndInitElementorySupport = async ({
	importScripts,
	wixCodeBootstrapData,
	sessionService,
	viewMode,
	csrfToken,
	commonConfig,
	logger,
	platformEnvData,
}: {
	importScripts: any
	wixCodeBootstrapData: WixCodeBootstrapData
	sessionService: SessionServiceAPI
	viewMode: string
	csrfToken: string
	commonConfig: ICommonConfigModule
	logger: IPlatformLogger
	platformEnvData: PlatformEnvData
}) => {
	const shouldUseElementorySupportSdk = platformEnvData.site.experiments['specs.thunderbolt.WixCodeElementorySupportSdk']

	if (shouldUseElementorySupportSdk) {
		return
	}

	if (!self.elementorySupport) {
		try {
			await logger.runAsyncAndReport(`import_scripts_wixCodeNamespacesAndElementorySupport`, async () => {
				const elementorySupportScriptUrl = elementorySupportScriptUrlFor(wixCodeBootstrapData)
				try {
					await importScripts(elementorySupportScriptUrl)
				} catch {
					await importScripts(elementorySupportScriptUrl) // retry
				}
			})
		} catch {}
	}

	if (!self.elementorySupport) {
		const error = new Error('could not load elementorySupport')
		logger.captureError(error, { tags: { elementorySupportImport: true }, extra: { elementorySupportScriptUrl: elementorySupportScriptUrlFor(wixCodeBootstrapData) } })
		return
	}

	const options = { headers: { 'X-XSRF-TOKEN': csrfToken, commonConfig: commonConfig.getHeader(), Authorization: sessionService.getWixCodeInstance() } }
	self.elementorySupport.baseUrl = wixCodeBootstrapData.elementorySupport.baseUrl
	self.elementorySupport.options = _.assign({}, self.elementorySupport.options, options)
	if (wixCodeBootstrapData.wixCodeModel) {
		self.elementorySupport.queryParameters = createElementorySupportQueryParams({
			codeAppId: wixCodeBootstrapData.wixCodeModel.appData.codeAppId,
			viewMode,
			wixCodeInstance: sessionService.getWixCodeInstance(),
		})

		sessionService.onInstanceChanged(({ instance: wixCodeInstance }) => {
			self.elementorySupport.queryParameters = createElementorySupportQueryParams({
				codeAppId: wixCodeBootstrapData.wixCodeModel.appData.codeAppId,
				viewMode,
				wixCodeInstance,
			})
			self.elementorySupport.options.headers.Authorization = wixCodeInstance
		}, WixCodeAppDefId)

		commonConfig.registerToChange(() => {
			self.elementorySupport.options.headers.commonConfig = commonConfig.getHeader()
		})
	}
}
