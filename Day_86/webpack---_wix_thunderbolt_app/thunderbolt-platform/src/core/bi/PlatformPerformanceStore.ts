export const PlatformPerformanceStore = (initialData: Array<PlatformPerformanceEvent> = []) => {
	const eventData: Array<PlatformPerformanceEvent> = initialData
	const addPlatformPerformanceEvent = (name: string) => {
		eventData.push({ name: `${name} (server)`, startTime: Date.now() })
	}
	const getAllPlatformPerformanceEvents = () => eventData

	return { addPlatformPerformanceEvent, getAllPlatformPerformanceEvents }
}

export type PlatformPerformanceStoreType = {
	getAllPlatformPerformanceEvents: () => Array<PlatformPerformanceEvent>
	addPlatformPerformanceEvent: (name: string) => void
}

export type PlatformPerformanceEvent = {
	name: string
	startTime: number
}
