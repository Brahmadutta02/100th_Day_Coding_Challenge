export function createPromise<T = void>(): {
	resolver: (resolvedData: T | PromiseLike<T>) => void
	promise: Promise<T>
} {
	let resolver: (resolvedData: T | PromiseLike<T>) => void = () => {}
	const promise = new Promise<T>((_resolver) => (resolver = _resolver))
	return {
		resolver,
		promise,
	}
}
