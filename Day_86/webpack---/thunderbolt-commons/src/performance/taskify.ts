export const taskify = async <T>(task: () => T) => {
	if (process.env.browser) {
		await new Promise((resolve) => setTimeout(resolve, 0))
	}
	return task()
}

// break long task to smaller tasks, see here: https://web.dev/optimize-long-tasks/#use-asyncawait-to-create-yield-points
export const yieldToMain = () => {
	return new Promise((resolve) => {
		setTimeout(resolve, 0)
	})
}
