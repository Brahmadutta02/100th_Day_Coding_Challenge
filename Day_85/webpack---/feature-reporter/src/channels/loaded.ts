import { LoadedScripts } from '../tag-manager/types'
import { getManagedChannels } from './managed'
import { getEmbeddedChannels } from './embedded'
import type { BiProps } from './types'

export const getLoadedChannels = (biProps: BiProps, loadedScripts: LoadedScripts) => {
	const loadedManagedChannelNames = getLoadedChannelNames(loadedScripts)
	const managedChannels = getManagedChannels().filter((channel) =>
		loadedManagedChannelNames.some((name) => name === channel.name)
	)

	return [...getEmbeddedChannels(biProps), ...managedChannels]
}

function getLoadedChannelNames(loadedScripts: LoadedScripts) {
	return Object.values(loadedScripts).map(({ name }) => name)
}
