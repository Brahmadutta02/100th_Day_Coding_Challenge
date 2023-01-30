import { IPropsStore, IStructureAPI } from '@wix/thunderbolt-symbols'
import { SospPageConfig } from './types'

export const resolveSospOnPage = (
	pageId: string,
	sospConfig: SospPageConfig,
	structureApi: IStructureAPI,
	propsStore: IPropsStore
) => {
	const { sospCompId, sospParentId, position, pagesToShowSosp } = sospConfig
	const sospParentComp = structureApi.get(sospParentId)
	if (sospParentComp) {
		if (pagesToShowSosp[pageId]) {
			if (!sospParentComp.components.includes(sospCompId)) {
				structureApi.addComponentToParent(sospParentId, sospCompId, position)
			}
			propsStore.update({ [sospParentId]: { className: 'page-with-sosp' } })
		} else {
			if (sospParentComp.components.includes(sospCompId)) {
				structureApi.removeComponentFromParent(sospParentId, sospCompId)
			}
			propsStore.update({ [sospParentId]: { className: 'page-without-sosp' } })
		}
	}
}
