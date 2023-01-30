import { logSdkWarning } from '@wix/thunderbolt-commons'

export const reportNonAnimatableComponents = (nonAnimatables: Array<any>) => {
	nonAnimatables.forEach((comp) => {
		if (!comp.isAnimatable) {
			logSdkWarning(
				`The "timeline.add" function called on "${comp.id}" was not executed because "${comp.id}" cannot be animated.`
			)
		} else if (comp.global) {
			logSdkWarning(
				`The "timeline.add" function called on "${comp.id}" was not executed because "${comp.id}" is shown on all pages.`
			)
		}
	})
}
