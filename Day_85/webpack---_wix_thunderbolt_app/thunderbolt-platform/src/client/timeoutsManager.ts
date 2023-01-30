// Override setInterval & setTimeout, to track the IDs and clear them on each runPlatformOnPage,
// so they don't persist across navigation.

declare const self: {
	setTimeout: (...args: any) => number
	setInterval: (...args: any) => number
}

const timeoutIds: Array<number> = []
const intervalIds: Array<number> = []
const realSetTimeout = self.setTimeout.bind(self)
const realSetInterval = self.setInterval.bind(self)

self.setTimeout = (...args: any) => {
	const id = realSetTimeout(...args)
	timeoutIds.push(id)
	return id
}

self.setInterval = (...args: any) => {
	const id = realSetInterval(...args)
	intervalIds.push(id)
	return id
}

export function clearTimeouts() {
	timeoutIds.map(clearTimeout)
	timeoutIds.length = 0

	intervalIds.map(clearInterval)
	intervalIds.length = 0
}
