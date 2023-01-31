import _ from 'lodash'
// @ts-ignore TODO remove all utils from platform APIs. let apps bundle their utils dependencies.
import { LinkData } from '@wix/thunderbolt-becky-types'
import { mediaItemUtils } from '@wix/santa-platform-utils'
import { PlatformAPI, IPlatformUtils } from '@wix/thunderbolt-symbols'
import { BootstrapData, CreateWixStorageAPI } from '../../types'
import { IViewerHandlers } from '../types'
import { BOOTSTRAP_DATA, CREATE_STORAGE_API, PLATFORM_API, PLATFORM_UTILS, VIEWER_HANDLERS } from './moduleNames'

const { types, parseMediaItemUri, createMediaItemUri } = mediaItemUtils

export type IPlatformApi = (appDefinitionId: string, instanceId: string) => PlatformAPI

// BOLT: https://github.com/wix-private/bolt/blob/c83dc8f4b36f78e7b9c52eec63afdee045b34ecc/viewer-platform-worker/src/utils/platformUtilities.js#L5
const PlatformApi = (bootstrapData: BootstrapData, platformUtils: IPlatformUtils, createStorageApi: CreateWixStorageAPI, { viewerHandlers }: IViewerHandlers): IPlatformApi => {
	return (appDefinitionId: string, instanceId: string) => {
		const pubSub = process.env.browser
			? {
					subscribe: (eventKey: string, cb: Function, isPersistent: boolean) => {
						viewerHandlers.subscribe(appDefinitionId, eventKey, cb, isPersistent)
					},
					unsubscribe: (eventKey: string) => {
						viewerHandlers.unsubscribe(appDefinitionId, eventKey)
					},
					publish: (eventKey: string, data: any, isPersistent: boolean) => {
						viewerHandlers.publish(appDefinitionId, eventKey, data, isPersistent)
					},
			  }
			: {
					subscribe: _.noop,
					unsubscribe: _.noop,
					publish: _.noop,
			  }

		return {
			links: {
				toUrl: (linkObject: LinkData) => platformUtils.linkUtils.getLinkUrlFromDataItem(linkObject),
			},
			storage: createStorageApi(`${appDefinitionId}_${instanceId}`, viewerHandlers, bootstrapData.platformEnvData.storage.storageInitData),
			pubSub,
			mediaItemUtils: {
				types,
				parseMediaItemUri,
				createMediaItemUri,
			},
		}
	}
}

export default {
	factory: PlatformApi,
	deps: [BOOTSTRAP_DATA, PLATFORM_UTILS, CREATE_STORAGE_API, VIEWER_HANDLERS],
	name: PLATFORM_API,
}
