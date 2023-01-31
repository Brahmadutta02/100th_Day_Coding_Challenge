const {
	siteAssets: { clientTopology },
	siteFeatures,
	siteFeaturesConfigs: { platform },
	site: { externalBaseUrl },
} = window.viewerModel

const shouldCreateWebWorker = Worker && siteFeatures.includes('platform')

const createWorkerBlobUrl = (workerUrl: string) => {
	const blob = new Blob([`importScripts('${workerUrl}');`], { type: 'application/javascript' })
	return URL.createObjectURL(blob)
}

const createWorker = async () => {
	const starMark = 'platform_create-worker started'
	performance.mark(starMark)

	const clientWorkerUrl = platform.clientWorkerUrl
	const url =
		clientWorkerUrl.startsWith('http://localhost:4200/') || clientWorkerUrl.startsWith('https://bo.wix.com/suricate/') || document.baseURI !== location.href
			? createWorkerBlobUrl(platform.clientWorkerUrl)
			: clientWorkerUrl.replace(clientTopology.fileRepoUrl, `${externalBaseUrl}/_partials`)

	const platformWorker = new Worker(url)
	const nonFederatedAppsOnPageScriptsUrls = Object.keys(platform.appsScripts.urls)
		.filter((id) => !platform.bootstrapData.appsSpecData[id]?.isModuleFederated)
		.reduce((appsScriptsUrls: typeof platform.appsScripts.urls, id) => {
			appsScriptsUrls[id] = platform.appsScripts.urls[id]
			return appsScriptsUrls
		}, {})

	platformWorker.postMessage({
		type: 'platformScriptsToPreload',
		appScriptsUrls: nonFederatedAppsOnPageScriptsUrls,
	})

	const endMark = 'platform_create-worker ended'
	performance.mark(endMark)
	performance.measure('Create Platform Web Worker', starMark, endMark)

	return platformWorker
}

export const platformWorkerPromise = shouldCreateWebWorker ? createWorker() : Promise.resolve()
