export const createDeepProxy = <T extends Function>(handler: T, path: Array<string> = []): Function => {
	const memoizedValue: { [key: string]: Function } = {}

	const apply = (target: T, thisArg: any, args: Array<any>) => {
		return target(path)(...args)
	}

	const builtInMethods: { [key: string]: Function } = {
		apply: (thisArg: any, args: Array<any>) => {
			return apply(handler, thisArg, args)
		},
		bind: (thisArg: any, ...argsToBind: any) => {
			return (...args: any) => {
				return apply(handler, thisArg, [...argsToBind, ...args])
			}
		},
		call: (thisArg: any, ...args: any) => {
			return apply(handler, thisArg, [...args])
		},
		toJSON: () => undefined,
	}

	return new Proxy(handler, {
		get: (target, prop: string) => {
			if (prop in builtInMethods) {
				return builtInMethods[prop]
			}
			if (memoizedValue[prop]) {
				return memoizedValue[prop]
			}
			memoizedValue[prop] = createDeepProxy(handler, [...path, prop])
			return memoizedValue[prop]
		},
		apply,
	})
}
