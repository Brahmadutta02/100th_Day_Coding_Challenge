import { name } from '../symbols'
import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { TpaHandlerProvider, PageFeatureConfigSymbol, AppStyleProps, TpaCompData } from '@wix/thunderbolt-symbols'
import { TpaPageConfig } from '../types'

export type MessageData = { styleId: string; pageId?: string }
export type HandlerResponse =
	| AppStyleProps['style']
	| {}
	| {
			error: {
				message: string
			}
	  }

export const GetStyleParamsByStyleIdHandler = withDependencies(
	[named(PageFeatureConfigSymbol, name)],
	({ widgets }: TpaPageConfig): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				getStyleParamsByStyleId(compId, msgData: MessageData): HandlerResponse {
					const widget = Object.values(widgets).find((w: TpaCompData) => w.styleId === msgData.styleId)
					const style = widget?.style
					if (!style) {
						return {
							error: {
								message: `Style id "${msgData.styleId}" was not found.`,
							},
						}
					}
					return { ...style }
				},
			}
		},
	})
)
