import { withDependencies, multi } from '@wix/thunderbolt-ioc'
import { RendererPropsExtenderSym, IRendererPropsExtender } from '@wix/thunderbolt-symbols'
import type { IRendererPropsProvider, RendererProps } from './types'

const rendererPropsProvider = (rendererPropsExtenders: Array<IRendererPropsExtender>): IRendererPropsProvider => {
	let rendererProps: RendererProps
	return {
		resolveRendererProps: async () => {
			const resolvedRendererPropsExtenders = await Promise.all(
				rendererPropsExtenders.map((extender) => extender.extendRendererProps())
			)
			rendererProps = resolvedRendererPropsExtenders.reduce(
				(acc, partialContext) => Object.assign(acc, partialContext),
				{}
			) as RendererProps
		},
		getRendererProps: () => {
			if (!rendererProps) {
				throw new Error('Reading the props can be done only after resolving them using resolveRendererProps')
			}
			return rendererProps
		},
	}
}

export const RendererPropsProvider = withDependencies([multi(RendererPropsExtenderSym)], rendererPropsProvider)
