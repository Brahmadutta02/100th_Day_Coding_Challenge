import { withDependencies } from '@wix/thunderbolt-ioc'
import { ICompsLifeCycle } from '@wix/thunderbolt-symbols'
import _ from 'lodash'

type CompCallbacks = { [compId: string]: { callbacks: { [callbackName: string]: Function } } }
type UnregisterFromCompLifeCycle = (compIds: Array<string>, callbackName: string) => void
const omitSingle = (key: string, { [key]: __, ...obj }) => obj

export const CompsLifeCycle = withDependencies(
	[],
	(): ICompsLifeCycle => {
		const onCompRenderedCallbacks: CompCallbacks = {}
		const registerToCompLifeCycle: ICompsLifeCycle['registerToCompLifeCycle'] = (
			compIds,
			callbackName,
			callback
		) => {
			compIds.forEach((compId) => {
				onCompRenderedCallbacks[compId] = onCompRenderedCallbacks[compId] || {}
				if (!onCompRenderedCallbacks[compId].callbacks) {
					onCompRenderedCallbacks[compId].callbacks = { [callbackName]: callback }
				} else {
					onCompRenderedCallbacks[compId].callbacks[callbackName] = callback
				}
			})
			return () => unregisterFromCompLifeCycle(compIds, callbackName)
		}

		const notifyCompDidMount: ICompsLifeCycle['notifyCompDidMount'] = (compId, displayedId) => {
			const triggerCallbacks = (callbacksObject: Record<string, Function>) =>
				Object.values(callbacksObject).forEach((cb) => {
					cb(compId, displayedId, document.getElementById(displayedId))
				})

			if (onCompRenderedCallbacks[compId]) {
				triggerCallbacks(onCompRenderedCallbacks[compId].callbacks)
			}

			if (compId !== displayedId && onCompRenderedCallbacks[displayedId]) {
				// The call to waitForComponentToRender or registerToCompLifeCycle were called using a displayedId
				triggerCallbacks(onCompRenderedCallbacks[displayedId].callbacks)
			}
		}

		const unregisterFromCompLifeCycle: UnregisterFromCompLifeCycle = (compIds, callbackName) => {
			compIds.forEach((compId) => {
				onCompRenderedCallbacks[compId].callbacks = omitSingle(
					callbackName,
					onCompRenderedCallbacks[compId].callbacks
				)
			})
		}

		const waitForComponentToRender: ICompsLifeCycle['waitForComponentToRender'] = (compId) => {
			const callbackName = _.uniqueId('waitForComponentToRender_')
			return new Promise((resolve) => {
				registerToCompLifeCycle([compId], callbackName, (__, ___, htmlElement) => {
					unregisterFromCompLifeCycle([compId], callbackName)
					resolve(htmlElement)
				})
			})
		}

		return {
			registerToCompLifeCycle,
			notifyCompDidMount,
			waitForComponentToRender,
		}
	}
)
