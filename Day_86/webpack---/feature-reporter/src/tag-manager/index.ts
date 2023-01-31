import type { OnTagManagerReady, LoadedScripts } from './types'
import { Event, LoadStatus } from './types'
import { handleLoadingTagsEvent, handleTagLoadedEvent } from './handlers'

export const onTagManagerReady: OnTagManagerReady = (initChannels) => {
	let loadedScripts: LoadedScripts = {}

	const setLoadedScripts = (scripts = {}) => {
		if (Object.entries(scripts).length) {
			loadedScripts = scripts
			const scriptValues = Object.values(loadedScripts || {})
			const isLoaded = scriptValues.every((script: any) => script.loadStatus)
			if (isLoaded) {
				initChannels(loadedScripts)
			}
		} else {
			initChannels(loadedScripts)
		}
	}
	const setTagLoaded = (loadedScript = {}) => {
		const updatedScripts = { ...loadedScripts, ...loadedScript }
		setLoadedScripts(updatedScripts)
	}

	window.addEventListener(Event.LoadingTags, ((event: CustomEvent) =>
		handleLoadingTagsEvent(event, setLoadedScripts)) as EventListener)

	window.addEventListener(Event.TagLoaded, ((event: CustomEvent) =>
		handleTagLoadedEvent(event, setTagLoaded, LoadStatus.Success)) as EventListener)

	window.addEventListener(Event.TagLoadError, ((event: CustomEvent) =>
		handleTagLoadedEvent(event, setTagLoaded, LoadStatus.Error)) as EventListener)
}
