import BaseEmitter from 'tiny-emitter'
import { ControllerEventsAPI } from '@wix/thunderbolt-symbols'
import { CONTROLLER_EVENTS } from './moduleNames'

export type IControllerEvents = {
	createScopedControllerEvents: (controllerId: string) => ControllerEventsAPI
}

const ControllerEvents = (): IControllerEvents => {
	// @ts-ignore
	const emitter = new BaseEmitter()
	const scopeEvent = (controllerId: string, event: string) => `${controllerId}_${event}`

	return {
		createScopedControllerEvents: (controllerId: string): ControllerEventsAPI => ({
			on(event: string, callback: Function, context: any) {
				const scopedEvent = scopeEvent(controllerId, event)
				emitter.on(scopedEvent, callback, context)
				return () => emitter.off(scopedEvent, callback)
			},

			once(event: string, callback: Function, context: any) {
				const scopedEvent = scopeEvent(controllerId, event)
				emitter.once(scopedEvent, callback, context)
				return () => emitter.off(scopedEvent, callback)
			},

			off(event: string, callback: Function) {
				emitter.off(scopeEvent(controllerId, event), callback)
			},

			fireEvent(event: string, ...args: any) {
				emitter.emit(scopeEvent(controllerId, event), ...args)
			},
		}),
	}
}

export default {
	factory: ControllerEvents,
	deps: [],
	name: CONTROLLER_EVENTS,
}
