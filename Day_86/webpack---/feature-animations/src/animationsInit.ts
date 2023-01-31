import { FeatureStateSymbol, IPageWillMountHandler, ViewMode, ViewModeSym } from '@wix/thunderbolt-symbols'
import { IFeatureState } from 'thunderbolt-feature-state'
import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { name } from './symbols'
import type { AnimationsPageState, IAnimations } from './types'
import { taskify, createPromise } from '@wix/thunderbolt-commons'
import { AnimatorManager } from './types'

export const AnimationsInit = withDependencies(
	[named(FeatureStateSymbol, name), ViewModeSym],
	(featureState: IFeatureState<AnimationsPageState>, viewMode: ViewMode): IPageWillMountHandler & IAnimations => {
		const animatorManager = featureState.get()?.animatorManager
		const { promise, resolver } = createPromise<AnimatorManager>()
		if (!animatorManager) {
			featureState.update(() => ({ animatorManager: promise }))
		}

		return {
			name: 'animationsInit',
			pageWillMount() {
				if (!animatorManager) {
					const animatorManagerPromise = import(
						'./animatorManagerFactory' /* webpackChunkName: "animatorManagerFactory" */
					).then(({ createAnimatorManager }) => taskify(() => createAnimatorManager(viewMode)))
					resolver(animatorManagerPromise)
				}
			},
			getInstance: () => {
				return featureState.get().animatorManager
			},
		}
	}
)
