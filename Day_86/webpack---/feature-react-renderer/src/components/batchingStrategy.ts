import { BatchingStrategy } from '@wix/thunderbolt-symbols'

export const createBatchingStrategy = (batchingFunction: (update: () => void) => void): BatchingStrategy => {
	let promise: Promise<void> | null = null
	const batchingStrategy: BatchingStrategy = {
		batch: (fn) => {
			if (!promise) {
				batchingFunction(fn)
			} else {
				promise.then(() => {
					batchingFunction(fn)
					promise = null
				})
			}
		},
		batchAsync: (waitBeforeBatch) => {
			promise = waitBeforeBatch
		},
	}
	return batchingStrategy
}
