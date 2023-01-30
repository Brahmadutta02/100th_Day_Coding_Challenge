import { decorateReporter } from './decorateReporter'
import type { BiProps, EmbeddedChannel } from './types'

export const getEmbeddedChannels = (biProps: BiProps): Array<EmbeddedChannel> => {
	if (!window.promoteAnalyticsChannels) {
		return []
	}

	const embeddedChannels = window.promoteAnalyticsChannels.map((channel: EmbeddedChannel) => ({
		name: channel.name,
		events: channel.events,
		report: decorateReporter(biProps, channel.name, channel.report),
		config: channel.config,
	}))

	return embeddedChannels
}
