import _ from 'lodash'

export function addScriptGroupsBiFields() {
	try {
		const groupsScriptResources = performance
			.getEntries()
			.filter(
				(entry) => entry.entryType === 'resource' && entry.name.includes('.js') && entry.name.includes('group_')
			)

		const countScripts = groupsScriptResources.length.toString()
		const verifyTransferSize = () =>
			groupsScriptResources.every((resource: any) => _.isNumber(resource.transferSize))

		const totalScriptsSize = verifyTransferSize()
			? groupsScriptResources
					.map((resource: any) => resource.transferSize)
					.reduce((acc, current) => acc + current, 0)
					.toString()
			: null

		const longTasksPerformanceApi = window.longTasksPerformanceApi || []
		const getLongTasksEvents = () =>
			longTasksPerformanceApi.map((event) => ({
				startTime: Math.round(event.startTime),
				duration: Math.round(event.duration),
			}))
		const verifyLongTasksEvents = () =>
			window && window.longTasksPerformanceApi && window.longTasksPerformanceApi.length > 0

		const longTasks = verifyLongTasksEvents() ? JSON.stringify(getLongTasksEvents()) : null

		return {
			countScripts,
			...(totalScriptsSize ? { totalScriptsSize } : {}),
			...(longTasks ? { longTasks } : {}),
		}
	} catch (e) {
		console.error(e)
		return {
			countScripts: '',
			totalScriptsSize: '',
			longTasks: '',
		}
	}
}
