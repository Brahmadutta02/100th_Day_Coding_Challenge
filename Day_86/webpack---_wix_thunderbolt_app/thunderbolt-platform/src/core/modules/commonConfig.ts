import { getCommonConfigHeader } from '@wix/thunderbolt-commons'
import type { CommonConfig, OnPageWillUnmount, ICommonConfigModule } from '@wix/thunderbolt-symbols'
import type { IViewerHandlers } from '../types'
import { COMMON_CONFIG, VIEWER_HANDLERS, ON_PAGE_WILL_UNMOUNT } from './moduleNames'

declare const self: {
	commonConfig: CommonConfig
}

const CommonConfigModule = ({ viewerHandlers }: IViewerHandlers, onPageWillUnmount: OnPageWillUnmount): ICommonConfigModule => {
	const subscribers: Array<(commonConfig: CommonConfig) => void> = []

	if (process.env.browser) {
		viewerHandlers
			.registerToCommonConfigChange((newCommonConfig: CommonConfig) => {
				self.commonConfig = newCommonConfig
				subscribers.forEach((subscriber) => subscriber(newCommonConfig))
			})
			.then(onPageWillUnmount)
	}

	return {
		registerToChange: (handler) => subscribers.push(handler),
		get: () => self.commonConfig,
		getHeader: () => encodeURIComponent(JSON.stringify(getCommonConfigHeader(self.commonConfig))),
	}
}

export default {
	factory: CommonConfigModule,
	deps: [VIEWER_HANDLERS, ON_PAGE_WILL_UNMOUNT],
	name: COMMON_CONFIG,
}
