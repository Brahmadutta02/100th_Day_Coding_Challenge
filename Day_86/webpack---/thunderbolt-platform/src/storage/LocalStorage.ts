import { BrowserWindow } from '@wix/thunderbolt-symbols'

export function LocalStorage(_window: BrowserWindow) {
	return {
		setItem(key: string, value: string) {
			_window!.localStorage.setItem(key, value)
		},

		getItem(key: string) {
			return _window!.localStorage.getItem(key)
		},

		removeItem(key: string) {
			_window!.localStorage.removeItem(key)
		},

		getStorage() {
			return _window!.localStorage
		},
	}
}
