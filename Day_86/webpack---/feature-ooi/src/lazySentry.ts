import { Hub, EventHint } from '@sentry/types'

// @ts-ignore
const getSentry = () => (process.env.browser ? window.Sentry : require('@sentry/node'))

export default class LazySentry {
	private _nodeClient: Hub | null = null
	private _browserClient: Hub | null = null

	constructor(private readonly options: any, private readonly scopes: Array<any> = []) {}

	captureException(exception: any, hint?: EventHint) {
		if (process.env.browser && window.Sentry) {
			let sentry = getSentry()
			// @ts-ignore
			sentry.onLoad(() => {
				sentry = getSentry()
				if (!this._browserClient) {
					this._browserClient = new sentry.Hub(new sentry.BrowserClient(this.options))
					this.scopes.forEach((fn) => {
						this._browserClient!.configureScope(fn)
					})
				}
				this._browserClient!.captureException(exception, hint)
			})
			// @ts-ignore
			sentry.forceLoad()
		} else {
			const sentry = getSentry()
			if (!this._nodeClient) {
				this._nodeClient = new sentry.Hub(new sentry.NodeClient(this.options))
				this.scopes.forEach((fn) => {
					this._nodeClient!.configureScope(fn)
				})
			}
			this._nodeClient!.captureException(exception, hint)
		}
	}

	configureScope(fn: any) {
		const client = process.env.browser ? this._browserClient : this._nodeClient
		if (client) {
			client.configureScope(fn)
		} else {
			this.scopes.push(fn)
		}
	}
}
