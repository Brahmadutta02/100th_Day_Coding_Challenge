import type { Intersection, TriggerType, ViewportManager } from './types'
import { ScreenInManager } from './ScreenInManager/ScreenInManager'

export default function init({ manager }: { manager: ScreenInManager }): ViewportManager {
	const SCREEN_IN_ACTION = 'screenIn'
	const HIGHER_THAN_VIEWPORT_THRESHOLD = 0.01

	const observers: Record<string, IntersectionObserver> = {}

	/**
	 * Get screen in threshold from animation definition
	 * @param {ScreenInManager} screeInManager
	 * @param {string} animationName
	 * @returns {*}
	 */
	function getAnimationThreshold(screeInManager: ScreenInManager, animationName: string) {
		return screeInManager.getAnimationProperties(animationName).viewportThreshold
	}

	/**
	 * build an intersection observer
	 * @param callback
	 * @param threshold
	 * @returns {IntersectionObserver}
	 */
	function getObserver(callback: Function, threshold: number) {
		const options = {
			root: null, // document
			rootMargin: '0px',
			threshold: [threshold],
		}

		function handler(entries: Array<IntersectionObserverEntry>, observer: IntersectionObserver) {
			const intersections = entries.map((entry: IntersectionObserverEntry) => ({
				visible: entry.isIntersecting,
				ratio: entry.intersectionRatio,
				rect: entry.intersectionRect,
				id: entry.target.id,
			}))

			entries.forEach(
				(entry: IntersectionObserverEntry) => entry.isIntersecting && observer.unobserve(entry.target)
			)

			callback(intersections)
		}

		return new window.IntersectionObserver(handler, options)
	}

	/**
	 * trigger animation when element is visible
	 * @param intersections
	 */
	function intersectionHandler(intersections: Array<Intersection>) {
		const idsToTrigger: Array<TriggerType> = intersections
			.filter((inter: Intersection) => inter.visible)
			.map((inter: Intersection) => ({
				compId: inter.id,
				action: SCREEN_IN_ACTION,
			}))

		manager.trigger(idsToTrigger)
	}

	/**
	 * Observe elements and save to observers array
	 * @param el
	 * @param threshold
	 */
	function observeElement(el: HTMLElement, threshold: number) {
		const observer = observers[threshold] || getObserver(intersectionHandler, threshold)
		observer.observe(el)

		if (!observers[threshold]) {
			observers[threshold] = observer
		}
	}

	/**
	 * Connect element to intersection observer event
	 */
	function connectElementToIntersectionObserver(id: string, el: HTMLElement, animationName: string) {
		const screenHeight = window.innerHeight
		if (el) {
			const height = el.offsetHeight
			const threshold =
				height > screenHeight
					? HIGHER_THAN_VIEWPORT_THRESHOLD
					: getAnimationThreshold(manager, animationName) || 0
			observeElement(el, threshold)
		}
	}

	return {
		start: connectElementToIntersectionObserver,
	}
}
