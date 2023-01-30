import _ from 'lodash'
import { BatchedUpdateFunction } from '../types'

type Batch = Parameters<BatchedUpdateFunction>[0]

export function batchUpdateFactory(batchedUpdateFunc: BatchedUpdateFunction) {
	let shouldScheduleFlush = !!process.env.browser /* in ssr, no need to intermediately flush updates, all updates will be flushed before platform resolves */
	let batch: Batch = {}
	const flushUpdates = () => {
		if (!_.isEmpty(batch)) {
			batchedUpdateFunc(batch)
			batch = {}
		}
		shouldScheduleFlush = true
	}
	return {
		batchUpdate: (data: { [compId: string]: any }) => {
			Object.entries(data).forEach(([compId, val]) => {
				batch[compId] = batch[compId] || {}
				Object.assign(batch[compId], val)
			})
			if (shouldScheduleFlush) {
				Promise.resolve().then(flushUpdates)
				shouldScheduleFlush = false
			}
			return Promise.resolve()
		},
		flushUpdates,
	}
}
