import { withDependencies } from '@wix/thunderbolt-ioc'
import type { ITpaContextMapping, PageInfo } from './types'

export const TpaContextMappingFactory = withDependencies(
	[],
	(): ITpaContextMapping => {
		const componentsContext: { [compId: string]: PageInfo } = {}
		const componentsTemplateIdToCompId: { [compId: string]: string } = {}
		return {
			/* runtime components that will persist on page navigation will
				fail to find the context id and then fail to invoke any handler.
				for this reason we map compId to its context id to avoid being
				dependent on the structure store after navigation
			 */
			registerTpasForContext({ contextId, pageId }, componentIds) {
				componentIds.forEach((compId) => {
					componentsContext[compId] = { contextId, pageId }
				})
			},
			getTpaComponentPageInfo(compId) {
				return componentsContext[compId]
			},
			registerTpaTemplateId(templateId, componentId) {
				componentsTemplateIdToCompId[templateId] = componentId
			},
			getTpaComponentIdFromTemplate(templateId) {
				return componentsTemplateIdToCompId[templateId]
			},
			unregisterTpa(compId) {
				delete componentsContext[compId]
			},
		}
	}
)
