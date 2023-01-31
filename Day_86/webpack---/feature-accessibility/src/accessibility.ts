import { withDependencies } from '@wix/thunderbolt-ioc'
import {
	BrowserWindow,
	BrowserWindowSymbol,
	IPageDidMountHandler,
	IPageDidUnmountHandler,
	ExperimentsSymbol,
	Experiments,
} from '@wix/thunderbolt-symbols'
import { accessibilityUtils } from './accessibilityUtils'

const accessibilityFactory = (
	window: BrowserWindow,
	experiments: Experiments
): IPageDidMountHandler & IPageDidUnmountHandler => {
	const { addFocusRingAndKeyboardTabbingOnClasses, removeKeyboardTabbingOnClass } = accessibilityUtils(
		window,
		experiments
	)

	return {
		pageDidMount() {
			window!.addEventListener('keydown', addFocusRingAndKeyboardTabbingOnClasses)
			window!.addEventListener('click', removeKeyboardTabbingOnClass)
		},
		pageDidUnmount() {
			window!.removeEventListener('keydown', addFocusRingAndKeyboardTabbingOnClasses)
			window!.removeEventListener('click', removeKeyboardTabbingOnClass)
		},
	}
}

export const Accessibility = withDependencies([BrowserWindowSymbol, ExperimentsSymbol], accessibilityFactory)
