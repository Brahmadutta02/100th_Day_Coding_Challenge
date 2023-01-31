import { BrowserWindow } from '@wix/thunderbolt-symbols'

export function SessionStorage(_window: BrowserWindow) {
	return {
		setItem(key: string, value: string) {
			_window!.sessionStorage.setItem(key, value)
		},

		getItem(key: string) {
			return _window!.sessionStorage.getItem(key)
		},

		removeItem(key: string) {
			_window!.sessionStorage.removeItem(key)
		},

		getStorage() {
			return _window!.sessionStorage
		},
	}
}
