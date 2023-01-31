import { name } from '../symbols'
import { TpaPageConfig } from '../types'
import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	TpaHandlerProvider,
	BrowserWindowSymbol,
	BrowserWindow,
	PageFeatureConfigSymbol,
} from '@wix/thunderbolt-symbols'
import _ from 'lodash'

export type HandlerResponse = {
	offsets: { x: number; y: number }
	rect: {
		width: number
		height: number
		top: number
		bottom: number
		left: number
		right: number
	}
	scale: number
}

export const BoundingRectAndOffsetsHandler = withDependencies(
	[BrowserWindowSymbol, named(PageFeatureConfigSymbol, name)],
	(window: BrowserWindow, pageConfig: TpaPageConfig): TpaHandlerProvider => ({
		getTpaHandlers() {
			const calcHeaderHeight = () => {
				if (!pageConfig.isFixedHeader) {
					return 0
				}
				const siteHeaderElm = window!.document.getElementById('SITE_HEADER')
				if (!siteHeaderElm) {
					return 0
				}
				return siteHeaderElm.getBoundingClientRect().height || 0
			}
			return {
				boundingRectAndOffsets(compId: string): HandlerResponse {
					const result = {
						offsets: { x: 0, y: 0 },
						rect: { left: 0, right: 0, top: 0, bottom: 0, height: 0, width: 0 },
						scale: pageConfig.siteScale,
					}
					const el = window!.document.getElementById(compId)
					if (!el) {
						return result
					}
					const headerHeight = calcHeaderHeight()
					const rect = el.getBoundingClientRect()
					result.offsets = {
						x: rect.left + window!.scrollX,
						y: rect.top + window!.scrollY - headerHeight,
					}
					result.rect = _(rect)
						.pick(['left', 'right', 'top', 'bottom', 'height', 'width'])
						.mapValues((value) => Math.floor(value))
						.value()
					result.rect.top -= headerHeight
					return result
				},
			}
		},
	})
)
