import _ from 'lodash'
import { getRelativeUrl } from 'feature-router'
import type { ILocationManager, LocationOnChangeHandler, OnPageWillUnmount } from '@wix/thunderbolt-symbols'
import type { BootstrapData } from '../../types'
import type { IViewerHandlers } from '../types'
import { LOCATION_MANAGER, VIEWER_HANDLERS, BOOTSTRAP_DATA, ON_PAGE_WILL_UNMOUNT } from './moduleNames'

const LocationManager = ({ viewerHandlers }: IViewerHandlers, bootstrapData: BootstrapData, onPageWillUnmount: OnPageWillUnmount): ILocationManager => {
	const {
		platformAPIData: { routersConfigMap },
		platformEnvData: {
			location: { rawUrl, externalBaseUrl },
		},
	} = bootstrapData

	let url = getDecodedUrlObject(rawUrl)

	const onChangeHandlers: Array<LocationOnChangeHandler> = []

	if (process.env.browser) {
		viewerHandlers.platformUrlManager
			.registerLocationOnChangeHandler((href: string) => {
				url = getDecodedUrlObject(href)
				onChangeHandlers.forEach((handler) => handler({ path: getPath() }))
			})
			.then(onPageWillUnmount)
	}

	const getFullPath = () => {
		if (externalBaseUrl) {
			return getRelativeUrl(url.href, externalBaseUrl).replace(/^\.\//, '').split('/')
		}

		return url.pathname.substring(1).split('/').slice(1)
	}

	const getPath = () => {
		const fullPath = getFullPath()
		return fullPath[0] === prefix ? fullPath.slice(1) : fullPath
	}

	const routerData = getFullPath()[0] && _.find(routersConfigMap, { prefix: getFullPath()[0] })
	const prefix = routerData && routerData.prefix

	return {
		getBaseUrl() {
			return externalBaseUrl
		},
		getLocation() {
			return url
		},
		getSearchParams() {
			const params: Record<string, Array<string> | string> = {}
			url.searchParams.forEach((value, key) => {
				const values = url.searchParams.getAll(key)
				params[key] = values.length > 1 ? values : value
			})
			return params
		},
		setSearchParam(key, value) {
			url.searchParams.set(key, value)
		},
		deleteSearchParam(key) {
			url.searchParams.delete(key)
		},
		onChange(handler) {
			onChangeHandlers.push(handler)
		},
		getPath,
		getPrefix() {
			return prefix
		},
	}
}

const getDecodedUrlObject = (url: string) =>
	new Proxy(new URL(url), {
		get(target, prop: keyof URL) {
			switch (prop) {
				case 'href':
				case 'pathname':
					try {
						return decodeURI(target[prop])
					} catch (ex) {
						return ''
					}
				case 'search':
					try {
						return decodeURIComponent(target[prop])
					} catch (ex) {
						return ''
					}
				default:
					return target[prop]
			}
		},
	})

export default {
	factory: LocationManager,
	deps: [VIEWER_HANDLERS, BOOTSTRAP_DATA, ON_PAGE_WILL_UNMOUNT],
	name: LOCATION_MANAGER,
}
