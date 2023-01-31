import { withDependencies } from '@wix/thunderbolt-ioc'
import { IStructureStore, Structure, BatchingStrategy, IAppDidMountHandler } from '@wix/thunderbolt-symbols'
import { INavigationManager, NavigationManagerSymbol } from 'feature-navigation-manager'
import { createBatchingStrategy } from './batchingStrategy'
import ReactDOM from 'react-dom'

export const ClientBatchingStrategy = withDependencies<BatchingStrategy & IAppDidMountHandler>(
	[Structure, NavigationManagerSymbol],
	(structureStore: IStructureStore, navigationManager: INavigationManager) => {
		let fns = [] as Array<() => void>
		let finishRenderFirstPage = false
		const batchingStartegy = createBatchingStrategy((fn) => {
			if (navigationManager.shouldBlockRender() && finishRenderFirstPage) {
				fns.push(fn)
				return
			}
			if (fns.length) {
				const localFns = [...fns, fn]
				fns = []
				ReactDOM.unstable_batchedUpdates(() => {
					localFns.forEach((deferredFunc) => deferredFunc())
				})
			} else {
				ReactDOM.unstable_batchedUpdates(fn)
			}
		})
		return {
			...batchingStartegy,
			appDidMount: () => {
				finishRenderFirstPage = true
			},
		}
	}
)
