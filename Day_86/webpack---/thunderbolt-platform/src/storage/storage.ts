import _ from 'lodash'
import { withDependencies } from '@wix/thunderbolt-ioc'
import { BrowserWindowSymbol, BrowserWindow, SdkHandlersProvider, PlatformEnvDataProvider } from '@wix/thunderbolt-symbols'
import MemoryStorage from './MemoryStorage'
import { SessionStorage } from './SessionStorage'
import { LocalStorage } from './LocalStorage'

const prefix = 'platform_app_'

function getPlatformStorage(storage: any) {
	const scopedValues = {}
	const filteredKeys = Object.keys(storage).filter((keyName) => _.startsWith(keyName, prefix))
	for (const keyName of filteredKeys) {
		_.set(scopedValues, keyName.replace(prefix, ''), storage.getItem(keyName))
	}
	return scopedValues
}

function isStorageSupported(window: BrowserWindow) {
	try {
		window!.localStorage.setItem('', '')
		window!.localStorage.removeItem('')
		return true
	} catch (e) {
		return false
	}
}

type StoragePlatformHandlers = {
	storage: {
		memorySetItem: (key: string, value: string) => void
		sessionSetItem: (key: string, value: string) => void
		localSetItem: (key: string, value: string) => void
	}
}
export const Storage = withDependencies([BrowserWindowSymbol], (window: BrowserWindow): PlatformEnvDataProvider & SdkHandlersProvider<StoragePlatformHandlers> => {
	const storageSupported = process.env.browser ? isStorageSupported(window) : false

	const memoryStorage = new MemoryStorage()
	const sessionStorage = storageSupported ? SessionStorage(window) : new MemoryStorage()
	const localStorage = storageSupported ? LocalStorage(window) : new MemoryStorage()

	const localStorageChangeHandlers: Set<Function> = new Set()

	if (process.env.browser) {
		window!.addEventListener('storage', (event: StorageEvent) => {
			if (!event.newValue || !event.key || !event.key.startsWith(prefix)) {
				return
			}

			localStorageChangeHandlers.forEach((handler) => handler(event.key!.replace(prefix, ''), event.newValue))
		})
	}

	function getStore() {
		return process.env.browser
			? {
					local: getPlatformStorage(localStorage.getStorage()),
					session: getPlatformStorage(sessionStorage.getStorage()),
					memory: getPlatformStorage(memoryStorage.getStorage()),
			  }
			: {
					local: {},
					session: {},
			  }
	}

	return {
		getSdkHandlers: () => ({
			storage: {
				memorySetItem(key, value) {
					memoryStorage.setItem(prefix + key, value)
				},
				sessionSetItem(key, value) {
					sessionStorage.setItem(prefix + key, value)
				},
				localSetItem(key, value) {
					localStorage.setItem(prefix + key, value)
				},
				registerToLocalStorageChanges(handler: Function) {
					localStorageChangeHandlers.add(handler)
					return () => localStorageChangeHandlers.delete(handler)
				},
			},
		}),
		get platformEnvData() {
			return {
				storage: {
					storageInitData: getStore(),
				},
			}
		},
	}
})
