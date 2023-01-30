import { $W, WixCodeApi } from '@wix/thunderbolt-symbols'

export type PlatformDebugApi = {
	setWixCodeInterfaces: (wixCodeInterfaces: { wixCodeApi: WixCodeApi; $w: $W }) => void
	logPlatformOperation: (operation: string, ...args: Array<unknown>) => void
	wrapFunctionArg: (fn: Function, path: Array<string>, index: number) => never
}

export type PlatformDebugApiOptions = {
	autoLog: boolean
}

type LogEntry = {
	op: string
	params: Array<any>
	printStackTrace: () => void
}

type PlatformDebugUtility = {
	wixCodeApi?: WixCodeApi
	$w?: $W
	trace: {
		setAutoLog: (enable: boolean) => void
		getLog: () => Array<LogEntry>
		clearLog: () => void
	}
}

export class DebugTraceError extends Error {
	constructor(root: Function, ...args: Array<any>) {
		super(...args)
		if (typeof Error.captureStackTrace === 'function') {
			Error.captureStackTrace(this, root)
		} else {
			this.stack = new Error(this.message).stack
		}
	}
}

declare const self: DedicatedWorkerGlobalScope & { debugApi: PlatformDebugUtility }

export const PlatformDebugApiFactory = (options: PlatformDebugApiOptions = { autoLog: false }): PlatformDebugApi => {
	const handlerCalls: Array<LogEntry> = []

	const logPlatformOperation: PlatformDebugApi['logPlatformOperation'] = (operation, ...params) => {
		const stackTraceRecorder = new DebugTraceError(logPlatformOperation)
		const printStackTrace = () => {
			console.log(stackTraceRecorder)
		}
		handlerCalls.push({
			op: operation,
			params,
			printStackTrace,
		})

		if (options.autoLog) {
			console.log(operation, params, stackTraceRecorder)
		}
	}

	const setAutoLog = (enableAutoLog: boolean) => {
		options.autoLog = enableAutoLog
	}

	const wrapFunctionArg: PlatformDebugApi['wrapFunctionArg'] = (fn, path, index) => {
		return ((...args: Array<unknown>) => {
			logPlatformOperation(`${path.join('.')}.$arg${index}`, ...args)
			return fn(...args)
		}) as never
	}

	self.debugApi = {
		trace: {
			setAutoLog,
			getLog: () => handlerCalls,
			clearLog: () => {
				handlerCalls.length = 0
			},
		},
	}

	return {
		logPlatformOperation,
		wrapFunctionArg,
		setWixCodeInterfaces: ({ wixCodeApi, $w }: { wixCodeApi: WixCodeApi; $w: $W }) => {
			self.debugApi.$w = $w
			self.debugApi.wixCodeApi = wixCodeApi
		},
	}
}
