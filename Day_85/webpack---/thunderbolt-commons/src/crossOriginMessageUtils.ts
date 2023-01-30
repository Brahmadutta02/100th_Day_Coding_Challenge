export const parseMessage = (evt: MessageEventInit) => {
	if (evt.data) {
		try {
			return JSON.parse(evt.data)
		} catch (e) {}
	}
	return {}
}
