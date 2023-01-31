import { withDependencies } from '@wix/thunderbolt-ioc'
import { ResolvableReadyForScrollPromiseSymbol } from './symbols'
import type { IResolvableReadyForScrollPromise } from './types'
import { IPageDidMountHandler } from '@wix/thunderbolt-symbols'

const createResolver = () => {
	let resolve: () => void
	const promise = new Promise<void>((res) => {
		resolve = res
	})
	return { promise, resolve: () => resolve() }
}

const ResolvableReadyForScrollPromise = withDependencies(
	[],
	(): IResolvableReadyForScrollPromise => {
		const { promise, resolve } = createResolver()
		return {
			readyForScrollPromise: promise,
			setReadyForScroll: resolve,
		}
	}
)

const ResolveReadyForScroll = withDependencies(
	[ResolvableReadyForScrollPromiseSymbol],
	({ setReadyForScroll }: IResolvableReadyForScrollPromise): IPageDidMountHandler => {
		return {
			pageDidMount: () => {
				setReadyForScroll()
			},
		}
	}
)

export { ResolveReadyForScroll, ResolvableReadyForScrollPromise }
