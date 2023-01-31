import _ from 'lodash'

export default class MemoryStorage {
	setItem(key: string, value: string) {
		_.set(this, key, String(value))
	}

	getItem(key: string) {
		return _.get(this, key)
	}

	removeItem(key: string) {
		_.set(this, key, undefined)
	}

	getStorage() {
		return this
	}
}
