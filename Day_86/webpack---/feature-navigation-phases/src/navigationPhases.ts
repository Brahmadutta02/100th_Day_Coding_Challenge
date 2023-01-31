import _ from 'lodash'
import { withDependencies } from '@wix/thunderbolt-ioc'
import { INavigationPhases, Phases } from './types'

export const NavigationPhases = withDependencies<INavigationPhases>([], () => {
	const UNFINISHED_PHASE = -1
	let phases: Phases = {}

	return {
		start: (phase) => {
			const start = Date.now()
			phases[phase] = UNFINISHED_PHASE

			return () => {
				phases[phase] = Date.now() - start
			}
		},
		clear: () => {
			phases = {}
		},
		getPhases: () => phases,
		getUnfinishedPhases: () =>
			_(phases)
				.pickBy((value) => value === UNFINISHED_PHASE)
				.keys()
				.value(),
	}
})
