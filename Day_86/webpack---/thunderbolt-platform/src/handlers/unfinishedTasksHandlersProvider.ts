import { withDependencies } from '@wix/thunderbolt-ioc'
import type { SdkHandlersProvider } from '@wix/thunderbolt-symbols'
import { INavigationPhases, NavigationPhasesSymbol } from 'feature-navigation-phases'
import type { UnfinishedTasksHandlers, UnfinishedTasksManager } from '../types'

export const unfinishedTasksHandlersProvider = withDependencies([NavigationPhasesSymbol], (navigationPhases: INavigationPhases): SdkHandlersProvider<UnfinishedTasksHandlers> &
	UnfinishedTasksManager => {
	const unfinishedTasks: { [id: string]: { name: string; endPhase: () => void } } = {}

	return {
		getSdkHandlers: () => ({
			unfinishedTasks: {
				add: (id: string, name: string) => {
					unfinishedTasks[id] = { name, endPhase: navigationPhases.start(`platform_${name}`) }
				},
				remove: (id: string): void => {
					unfinishedTasks[id].endPhase()
					delete unfinishedTasks[id]
				},
			},
		}),
		getAll: (): Array<string> =>
			Object.entries(unfinishedTasks)
				.sort((a, b) => (a[0] > b[0] ? 1 : -1))
				.map((item) => item[1].name),
	}
})
