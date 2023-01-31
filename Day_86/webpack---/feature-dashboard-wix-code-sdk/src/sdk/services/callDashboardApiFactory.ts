import { wrap, proxy, Remote, Endpoint } from 'comlink/dist/esm/comlink.js' // eslint-disable-line no-restricted-syntax
import { DashboardApi, NeedsProxy, ProxifiedDashboardApi } from '../..'

/*
 * Promisify methods of DashboardApi
 */
export type CallDashboardApi = <E extends keyof DashboardApi>(
	endpoint: E,
	...args: Parameters<DashboardApi[E]>
) => Promise<ReturnType<DashboardApi[E]>>

function isFunction(functionToCheck: any): functionToCheck is Function {
	return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
}

const toClonablesProxiesTuple = (original: any) => {
	const proxies: Array<NeedsProxy> = []
	const toProxy = (obj: NeedsProxy) => {
		proxies.push(obj)
		return { proxyId: proxies.length - 1 }
	}
	const toClones = (obj: any): any => {
		if (obj instanceof Promise) {
			return toProxy(obj)
		}

		if (isFunction(obj)) {
			return toProxy(obj)
		}

		if (Array.isArray(obj)) {
			return obj.map(toClones)
		}

		if (obj === Object(obj)) {
			return Object.entries(obj).reduce((entries, [key, value]) => {
				entries[key] = toClones(value)
				return entries
			}, {} as any)
		}

		return obj
	}
	const clones = toClones(original)

	return [clones, proxy(proxies)]
}

export const callDashboardApiFactory = (getDashboardApi: () => Promise<Endpoint> | void): CallDashboardApi => {
	let dashboardApi: Remote<ProxifiedDashboardApi>
	let dashboardApiFunction
	const callDashboardApi: CallDashboardApi = async (endpoint, ...args) => {
		if (!dashboardApi) {
			dashboardApiFunction = await getDashboardApi()
			if (dashboardApiFunction) {
				dashboardApi = wrap<ProxifiedDashboardApi>(dashboardApiFunction)
			}
		}

		const [clones, proxies] = toClonablesProxiesTuple(args)

		return dashboardApi && dashboardApi[endpoint](clones, proxies)
	}

	return callDashboardApi
}
