import { withDependencies } from '@wix/thunderbolt-ioc'
import { IPropsStore, IStructureAPI, Props, StructureAPI, TpaHandlerProvider } from '@wix/thunderbolt-symbols'
import { AnchorFormattedData } from '../types'
import _ from 'lodash'

export const GetCurrentPageAnchorsHandler = withDependencies(
	[StructureAPI, Props],
	(structureApi: IStructureAPI, props: IPropsStore): TpaHandlerProvider => {
		return {
			getTpaHandlers() {
				return {
					getCurrentPageAnchors(): Array<AnchorFormattedData> {
						return _(structureApi.getEntireStore())
							.pickBy(({ componentType }) => componentType === 'Anchor')
							.mapValues((struct, id: string) => ({ id, title: props.get(id).name }))
							.values()
							.sortBy(({ id }) => {
								switch (id) {
									case 'SCROLL_TO_TOP':
										return 0
									case 'SCROLL_TO_BOTTOM':
										return 1
									default:
										return 2
								}
							})
							.value()
					},
				}
			},
		}
	}
)
