export const debounce = (fn: () => void) => {
	let promise: Promise<void> | null = null
	return () => {
		if (!promise) {
			promise = Promise.resolve().then(() => {
				promise = null
				fn()
			})
		}
	}
}
