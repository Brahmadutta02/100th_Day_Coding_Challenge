import { withDependencies, multi } from '@wix/thunderbolt-ioc'
import { IPageWillMountHandler, IPropsStore, Props, AppStructure, PropsMap } from '@wix/thunderbolt-symbols'
import { PageStructureJsonSymbol, PagePropsJsonSymbol } from 'feature-pages'
import type { IComponentPropsExtender } from './types'
import { ComponentPropsExtenderSymbol } from './symbols'
import { groupByMultipleComponentTypes } from './groupByMultipleComponentTypes'

const pageWillMountPropsExtender = (
	beckyPropsExtenders: Array<IComponentPropsExtender<{}>>,
	propsStore: IPropsStore,
	pageStructure: AppStructure,
	pageProps: PropsMap
): IPageWillMountHandler => {
	return {
		name: 'pageWillMountPropsExtender',
		async pageWillMount() {
			const extendersPerComponentType = groupByMultipleComponentTypes(beckyPropsExtenders)

			const extendedPropsPromises = Object.entries(pageStructure).map(async ([compId, { componentType }]) => {
				const allExtended = (extendersPerComponentType[componentType] || []).map((x) =>
					x.getExtendedProps(compId, pageProps[compId])
				)

				if (allExtended.length) {
					return { [compId]: Object.assign({}, ...(await Promise.all(allExtended))) }
				}

				return null
			})

			const extendedProps = Object.assign({}, ...(await Promise.all(extendedPropsPromises)))

			propsStore.update(extendedProps)
		},
	}
}

export const PageWillMountPropsExtender = withDependencies(
	[multi(ComponentPropsExtenderSymbol), Props, PageStructureJsonSymbol, PagePropsJsonSymbol],
	pageWillMountPropsExtender
)
