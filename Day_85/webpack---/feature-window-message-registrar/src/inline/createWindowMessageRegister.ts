import { MessageRegistrarWindow, WindowMessageConsumer } from '../types'

export function createRegistrar(window: MessageRegistrarWindow) {
	// TODO this code creates an inherit issue where messages without consumer are left in the queue indefinitely
	const messagesBeforeHydration = new Set<MessageEventInit>()
	const messageHandlers: Array<WindowMessageConsumer> = []

	const flushMessages = (handler: WindowMessageConsumer) => {
		const consumableMessages: Array<MessageEventInit> = []
		messagesBeforeHydration.forEach((evt) => {
			if (handler.canHandleEvent(evt)) {
				consumableMessages.push(evt)
			}
		})
		consumableMessages.forEach((evt) => {
			messagesBeforeHydration.delete(evt)
			handler.handleEvent(evt)
		})
	}

	const queueOrDispatch = (evt: MessageEventInit) => {
		const event = { source: evt.source, data: evt.data, origin: evt.origin }
		const handler = messageHandlers.find((h) => h.canHandleEvent(event))
		if (handler) {
			flushMessages(handler)
			handler.handleEvent(event)
		} else {
			messagesBeforeHydration.add(event)
		}
	}

	window.addEventListener('message', queueOrDispatch)

	window._addWindowMessageHandler = (handler) => {
		messageHandlers.push(handler)
		flushMessages(handler)
	}
}
