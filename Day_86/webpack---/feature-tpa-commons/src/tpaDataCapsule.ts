import { withDependencies, named } from '@wix/thunderbolt-ioc'
import { SiteFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import { ITpaDataCapsule, TpaCommonsSiteConfig } from './types'
import { name } from './symbols'
import _ from 'lodash'
import * as DataCapsule from 'data-capsule'

export const TpaDataCapsule = withDependencies(
	[named(SiteFeatureConfigSymbol, name)],
	({ metaSiteId }: TpaCommonsSiteConfig): ITpaDataCapsule => {
		const widgets: { [compId: string]: string } = {}

		const verifier = (p1: unknown, p2: unknown, compId: string) => {
			return widgets[compId]
		}

		const interceptor = (options: any, p2: unknown, p3: unknown, compId: string) => {
			options.namespace = widgets[compId]
			options.scope = metaSiteId
			return options
		}

		const initFrameStorage = _.once(async () => {
			// @ts-ignore
			new DataCapsule.FrameStorageListener().start(verifier, interceptor)
		})

		return {
			registerToDataCapsule(compId, appDefinitionId) {
				initFrameStorage()
				widgets[compId] = appDefinitionId
			},
			unregister(compId) {
				delete widgets[compId]
			},
		}
	}
)
