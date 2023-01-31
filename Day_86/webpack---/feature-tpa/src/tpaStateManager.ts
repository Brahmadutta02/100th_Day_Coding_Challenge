import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { extractInnerRoute } from '@wix/thunderbolt-commons'
import { PageFeatureConfigSymbol, pageIdSym } from '@wix/thunderbolt-symbols'
import { UrlHistoryManagerSymbol, IUrlHistoryManager, IUrlChangeHandler } from 'feature-router'
import type { ITPAEventsListenerManager, TpaPageConfig } from './types'
import { TpaEventsListenerManagerSymbol, name } from './symbols'

export const TpaStateManager = withDependencies(
	[TpaEventsListenerManagerSymbol, UrlHistoryManagerSymbol, named(PageFeatureConfigSymbol, name), pageIdSym],
	(
		tpaEventsListenerManager: ITPAEventsListenerManager,
		urlHistoryManager: IUrlHistoryManager,
		{ tpaInnerRouteConfig }: TpaPageConfig,
		pageId: string
	): IUrlChangeHandler => {
		return {
			async onUrlChange() {
				const relativeUrl = urlHistoryManager.getRelativeUrl()

				const parts = extractInnerRoute(relativeUrl.replace(/^\./, ''), tpaInnerRouteConfig.tpaPageUri)
				const newState = parts ? parts.join('/') : ''

				tpaEventsListenerManager.dispatch(
					'STATE_CHANGED',
					() => {
						return { newState }
					},
					{ pageId }
				)
			},
		}
	}
)
