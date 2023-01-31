import { BrowserWindow, Experiments } from '@wix/thunderbolt-symbols'

const tabClasses = ['focus-ring-active', 'keyboard-tabbing-on']

const KEYBOARD_NAVIGATION_ACCESSIBILITY_KEYS = ['Tab', 'ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft']
const BASIC_ACCESSIBILITY_KEYS = ['Tab']

export const accessibilityUtils = (window: BrowserWindow, experiments: Experiments) => {
	const isRepeaterKeyboardNavigationAvailable = experiments['specs.thunderbolt.repeater_keyboard_navigation']

	const FOCUS_RING_KEYS = isRepeaterKeyboardNavigationAvailable
		? KEYBOARD_NAVIGATION_ACCESSIBILITY_KEYS
		: BASIC_ACCESSIBILITY_KEYS

	return {
		addFocusRingAndKeyboardTabbingOnClasses: (event: KeyboardEvent): void => {
			if (FOCUS_RING_KEYS.includes(event.key)) {
				// TODO: Think of a better way to get the site container in page features
				const target: HTMLElement = window!.document.getElementById('SITE_CONTAINER')!
				target.classList.add(...tabClasses)
			}
		},
		removeKeyboardTabbingOnClass: (): void => {
			const target: HTMLElement = window!.document.getElementById('SITE_CONTAINER')!
			target.classList.remove('keyboard-tabbing-on')
		},
	}
}
