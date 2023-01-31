import Raven from '@wix/fe-essentials-viewer-platform/raven-js'
import _ from 'lodash'

export const monitoringFactory = ({ url, viewMode, viewerVersion, referrer }: { url: string; viewMode: 'site' | 'preview'; viewerVersion: string; referrer: string | undefined }) => {
	const sessionData = {
		extra: {
			renderingEnvironment: process.env.browser ? 'browser' : 'backend',
			referrer,
		},
		tags: {
			fullUrl: url,
			viewMode,
			artifactVersion: `thunderbolt-${viewerVersion}`,
		},
		request: {
			url,
		},
	}

	return {
		createMonitor: (dsn: string, dataCallback = _.noop) => {
			// @ts-ignore
			const monitor = new Raven.Client()
			monitor.config(dsn, {
				dataCallback: (data: any) => _.merge({}, sessionData, dataCallback(data)),
			})
			return monitor
		},
		getSessionData: () => sessionData,
	}
}
