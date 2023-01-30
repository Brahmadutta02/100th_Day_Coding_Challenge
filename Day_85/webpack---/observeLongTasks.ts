window.longTasksPerformanceApi = []
export function observeLongTasks() {
	if (window.PerformanceObserver) {
		const observer = new PerformanceObserver(function (list) {
			const perfEntries = list.getEntries()
			window.longTasksPerformanceApi.push(...perfEntries)
		})
		observer.observe({ entryTypes: ['longtask'] })
	}
}
