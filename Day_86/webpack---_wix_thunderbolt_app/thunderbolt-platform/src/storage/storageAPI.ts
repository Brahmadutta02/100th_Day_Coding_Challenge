import _ from 'lodash'
import type { StorageInitData } from '@wix/thunderbolt-symbols'
import type { CreateWixStorageAPI, StorageAPI, WixStorageAPI } from '../types'
import { InvokeSiteHandler } from '../core/types'

export const createStorageAPI = ({ invokeSiteHandler }: { invokeSiteHandler: InvokeSiteHandler }): CreateWixStorageAPI => {
	enum TYPES {
		LOCAL = 'local',
		SESSION = 'session',
		MEMORY = 'memory',
	}

	const store = {}

	const setData = (storageObject: object, type: TYPES, appPrefix: string, appDataToStore: string, handlers: any): void => {
		const path = [`${type}Storage`, appPrefix]

		const typeToSetImplMapping = {
			[TYPES.LOCAL]: handlers.storage.localSetItem,
			[TYPES.MEMORY]: handlers.storage.memorySetItem,
			[TYPES.SESSION]: handlers.storage.sessionSetItem,
		}

		_.set(storageObject, path, appDataToStore)
		typeToSetImplMapping[type] && typeToSetImplMapping[type](appPrefix, _.get(storageObject, path))
	}

	invokeSiteHandler('storage.registerToLocalStorageChanges', (key: string, newValue: string) => {
		_.set(store, [`${TYPES.LOCAL}Storage`, key], newValue)
	})

	return (appPrefix: string, handlers: any, storageStore: StorageInitData): WixStorageAPI => {
		_.set(store, `${TYPES.LOCAL}Storage`, _.get(storageStore, TYPES.LOCAL))
		_.set(store, `${TYPES.SESSION}Storage`, _.get(storageStore, TYPES.SESSION))
		_.set(store, `${TYPES.MEMORY}Storage`, _.get(storageStore, TYPES.MEMORY))

		const memory: StorageAPI = {
			setItem: (key: string, value: string) => setItemImp(TYPES.MEMORY, store, key, value),
			getItem: (key: string) => getItemImp(TYPES.MEMORY, store, key),
			removeItem: (key: string) => removeItemImp(TYPES.MEMORY, store, key),
			clear: () => clearImp(TYPES.MEMORY, store),
		}

		const session: StorageAPI = {
			setItem: (key: string, value: string) => setItemImp(TYPES.SESSION, store, key, value),
			getItem: (key: string) => getItemImp(TYPES.SESSION, store, key),
			removeItem: (key: string) => removeItemImp(TYPES.SESSION, store, key),
			clear: () => clearImp(TYPES.SESSION, store),
		}

		const local: StorageAPI = {
			setItem: (key: string, value: string) => setItemImp(TYPES.LOCAL, store, key, value),
			getItem: (key: string) => getItemImp(TYPES.LOCAL, store, key),
			removeItem: (key: string) => removeItemImp(TYPES.LOCAL, store, key),
			clear: () => clearImp(TYPES.LOCAL, store),
		}

		const setItemImp = (type: TYPES, storageObject: object, key: string, value: string) => {
			if (!process.env.browser) {
				return
			}

			const newData = { [String(key)]: String(value) }
			const appDataToStore = JSON.stringify(_.assign({}, getParsedStoredAppData(type, storageObject), newData))
			const maxDataSize = type === TYPES.MEMORY ? 1000000 : 50000

			if (appDataToStore.length > maxDataSize) {
				throw new Error(`QuotaExceededError - ${type} storage limit is ${type === TYPES.MEMORY ? '1mb' : '50kb'}`)
			}

			setData(storageObject, type, appPrefix, appDataToStore, handlers)
		}

		const getItemImp = (type: TYPES, storageObject: object, key: string) => {
			if (!process.env.browser) {
				return null
			}

			const storedAppData = getParsedStoredAppData(type, storageObject)
			return _.get(storedAppData, String(key), null)
		}

		const removeItemImp = (type: TYPES, storageObject: object, key: string) => {
			if (!process.env.browser) {
				return
			}

			const storedAppData = getParsedStoredAppData(type, storageObject)
			const appDataToStore = JSON.stringify(_.omit(storedAppData, key))

			setData(storageObject, type, appPrefix, appDataToStore, handlers)
		}

		const clearImp = (type: TYPES, storageObject: object) => {
			if (!process.env.browser) {
				return
			}

			setData(storageObject, type, appPrefix, '{}', handlers)
		}

		const getParsedStoredAppData = (type: TYPES, storageObject: object) => {
			return JSON.parse(_.get(storageObject, [`${type}Storage`, appPrefix], '{}'))
		}

		return {
			memory,
			session,
			local,
		}
	}
}
