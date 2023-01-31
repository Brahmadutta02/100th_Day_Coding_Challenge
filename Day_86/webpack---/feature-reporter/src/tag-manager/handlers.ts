import { SiteTag, TagLoadedEventHandler, LoadingTagsEventHandler, SUPPORTED_CHANNELS } from './types'

const supportedChannels = Object.values(SUPPORTED_CHANNELS)

export const handleLoadingTagsEvent: LoadingTagsEventHandler = (event, setLoadedScripts) => {
	const scripts: Array<SiteTag> = event?.detail
	const reporterScripts = scripts
		.filter(({ config }) => supportedChannels.includes(config?.type))
		.reduce((scriptsObject, { id, name }) => {
			const script: SiteTag = {
				[id as string]: { name },
			}
			return { ...scriptsObject, ...script }
		}, {})
	setLoadedScripts(reporterScripts)
}

export const handleTagLoadedEvent: TagLoadedEventHandler = (event, setTagLoaded, loadStatus) => {
	const embed = event?.detail?.embed
	const channelName = embed?.config?.type
	const isChannelSupported = supportedChannels.includes(channelName)
	if (isChannelSupported) {
		const script = { [embed.id]: { name: channelName, loadStatus } }
		setTagLoaded(script)
	}
}
