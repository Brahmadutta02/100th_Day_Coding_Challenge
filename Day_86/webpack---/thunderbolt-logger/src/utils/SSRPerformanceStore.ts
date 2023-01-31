import type { ServerPerformanceEvent } from '../types'

export const SSRPerformanceStore = (initialData: Array<ServerPerformanceEvent> = []) => {
	const eventData: Array<ServerPerformanceEvent> = initialData

	const addSSRPerformanceEvent = (name: string) => {
		eventData.push({ name: `${name} (server)`, startTime: Date.now() })
	}
	const addSSRPerformanceEvents = (events: Array<ServerPerformanceEvent>) => {
		eventData.push(...events)
	}
	const getAllSSRPerformanceEvents = () => eventData

	return { addSSRPerformanceEvent, getAllSSRPerformanceEvents, addSSRPerformanceEvents }
}

export type SSRPerformanceStoreType = {
	getAllSSRPerformanceEvents: () => Array<ServerPerformanceEvent>
	addSSRPerformanceEvent: (name: string) => void
	addSSRPerformanceEvents: (events: Array<ServerPerformanceEvent>) => void
}
