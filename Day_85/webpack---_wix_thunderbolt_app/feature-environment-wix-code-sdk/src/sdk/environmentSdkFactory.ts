import { namespace } from '../symbols'
import type { EnvironmentWixCodeSdkApi } from '../types'
import type { WixCodeApiFactoryArgs } from '@wix/thunderbolt-symbols'

declare const self: DedicatedWorkerGlobalScope & { console: Console }

export function EnvironmentSdkFactory({
	moduleLoader,
	onPageWillUnmount,
}: WixCodeApiFactoryArgs): {
	[namespace]: EnvironmentWixCodeSdkApi
} {
	// TODO security: destruct self methods once before we run any 3rd party code and inject the methods to sdk factorties.
	//  this is to avoid future tampering.
	const {
		setTimeout,
		clearTimeout,
		setInterval,
		clearInterval,
		queueMicrotask,
		importScripts,
		fetch,
		console: { log, warn, error, debug, info },
	} = self

	const setTimeoutIds: Array<number> = []
	const setIntervalIds: Array<number> = []

	onPageWillUnmount(() => {
		setTimeoutIds.forEach(clearTimeout)
		setIntervalIds.forEach(clearInterval)
	})

	return {
		[namespace]: {
			timers: {
				setTimeout: (...args) => {
					const id = setTimeout(...args)
					setTimeoutIds.push(id)
					return id
				},
				clearTimeout,
				setInterval: (...args) => {
					const id = setInterval(...args)
					setIntervalIds.push(id)
					return id
				},
				clearInterval,
				queueMicrotask,
			},
			network: {
				importScripts: (...args) => {
					console.warn(
						'Using importScripts api is not recommended as it may negatively impact SSR performance, consider using importAMDModule instead'
					)
					return importScripts(...args)
				},
				importAMDModule: moduleLoader.loadModule,
				fetch,
			},
			console: {
				log,
				warn,
				error,
				debug,
				info,
			},
		},
	}
}
