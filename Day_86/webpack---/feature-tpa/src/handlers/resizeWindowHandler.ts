import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	TpaHandlerProvider,
	Props,
	BrowserWindowSymbol,
	IPropsStore,
	SiteFeatureConfigSymbol,
} from '@wix/thunderbolt-symbols'
import { computeTpaPopupStyleOverrides, isFullScreen, parseCssSize } from '../utils/tpaStyleOverridesBuilder'
import { ISiteScrollBlocker, SiteScrollBlockerSymbol } from 'feature-site-scroll-blocker'
import { TpaModalSymbol } from '../symbols'
import { ITpaModal, TpaPopupProps } from '../types'
import _ from 'lodash'
import { name as tpaCommonsName, TpaCommonsSiteConfig } from 'feature-tpa-commons'
import { runtimeTpaCompIdBuilder } from '@wix/thunderbolt-commons'

type WindowSizeDimensions = { width?: number | string; height?: number | string }

export type ResizeWindowMessageData = { width: number | string; height: number | string }
export type HeightChangedMessageData = { height: number; overflow?: boolean }

export const ResizeWindowHandler = withDependencies(
	[
		Props,
		BrowserWindowSymbol,
		SiteScrollBlockerSymbol,
		named(SiteFeatureConfigSymbol, tpaCommonsName),
		TpaModalSymbol,
	],
	(
		props: IPropsStore,
		window: Window,
		siteScrollBlocker: ISiteScrollBlocker,
		tpaCommonsSiteConfig: TpaCommonsSiteConfig,
		tpaModal: ITpaModal
	): TpaHandlerProvider => {
		const computeModalStyleOverrides = (newSize: WindowSizeDimensions): { width?: number; height?: number } => {
			const dimensions: Array<keyof WindowSizeDimensions> = ['height', 'width']
			return dimensions.reduce((overrides: any, dimension) => {
				const value = newSize[dimension]
				if (!_.isNil(value)) {
					const { unit, size } = parseCssSize(value!)
					if (!unit) {
						overrides[dimension] = size
					}
				}
				return overrides
			}, {})
		}

		const _resizeModalOrPopupWindow = (compId: string, newSize: WindowSizeDimensions) => {
			const { options, originCompId } = props.get(compId) as TpaPopupProps
			const updatedOptions = { ...options, ...newSize }

			// its either a modal or a popup
			const styleOverrides = tpaModal.isModal(compId)
				? computeModalStyleOverrides(newSize)
				: computeTpaPopupStyleOverrides(updatedOptions, window, originCompId)
			props.update({
				[compId]: {
					styleOverrides,
				},
			})
			siteScrollBlocker.setSiteScrollingBlocked(
				tpaCommonsSiteConfig.isMobileView && isFullScreen(styleOverrides, window),
				compId
			)
		}

		return {
			getTpaHandlers() {
				return {
					async resizeWindow(compId, msgData: ResizeWindowMessageData, { tpaCompData }): Promise<void> {
						const isTpaPopupOrModal = runtimeTpaCompIdBuilder.isRuntimeCompId(compId)
						if (isTpaPopupOrModal) {
							_resizeModalOrPopupWindow(compId, msgData)
						} else if (tpaCompData?.isPinned) {
							const styleOverrides = {
								width: _.isNumber(msgData.width) ? `${msgData.width}px` : msgData.width,
								height: _.isNumber(msgData.height) ? `${msgData.height}px` : msgData.height,
							}
							if (!_.isEqual(styleOverrides, props.get(compId).styleOverrides)) {
								props.update({
									[compId]: {
										styleOverrides,
									},
								})
							}
						}
					},
					heightChanged(compId, msgData: HeightChangedMessageData, { tpaCompData }): void {
						// In editing mode this handler will cause re-measurement and adjustment of adjacent components
						// it's the equivalent of using the resize handle in the editor (i.e it pushes other components when used)
						if (runtimeTpaCompIdBuilder.isRuntimeCompId(compId)) {
							_resizeModalOrPopupWindow(compId, { height: msgData.height })
						} else {
							if (msgData.height === 0 && !tpaCompData?.isPinned) {
								return
							}

							props.update({
								[compId]: {
									heightOverride: msgData.height,
									heightOverflow: Boolean(msgData.overflow), // false by default
								},
							})
						}
					},
				}
			},
		}
	}
)
