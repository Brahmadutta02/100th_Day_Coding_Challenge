import { withDependencies } from '@wix/thunderbolt-ioc'
import { TpaHandlerExtras, TpaHandlerProvider, TpaPopupSymbol, ITpaPopup } from '@wix/thunderbolt-symbols'
import { TpaModalSymbol } from '../symbols'
import type { ITpaModal, OpenPopupOptions } from '../types'
import { withViewModeRestriction } from '@wix/thunderbolt-commons'

export type MessageData = { url: string } & OpenPopupOptions

export const OpenPopupHandler = withDependencies(
	[TpaPopupSymbol, TpaModalSymbol],
	({ openPopup }: ITpaPopup, tpaModal: ITpaModal): TpaHandlerProvider => {
		const isAllowedToOpenPopup = (compId: string): Error | null => {
			if (tpaModal.isModal(compId)) {
				const err = new Error('An app can not open a popup from a modal.')
				err.name = 'Operation not supported'
				return err
			}
			return null
		}

		return {
			getTpaHandlers() {
				return {
					openPopup: withViewModeRestriction(
						['site', 'preview'],
						(compId, { url, ...options }: MessageData, { originCompId }: TpaHandlerExtras) => {
							const error = isAllowedToOpenPopup(compId)
							return error ? Promise.reject(error) : openPopup(url, options, originCompId)
						}
					),
					openPersistentPopup: withViewModeRestriction(
						['site', 'preview'],
						(compId, { url, ...options }: MessageData, { originCompId }: TpaHandlerExtras) => {
							const error = isAllowedToOpenPopup(compId)
							return error
								? Promise.reject(error)
								: openPopup(url, { ...options, persistent: true }, originCompId)
						}
					),
				}
			},
		}
	}
)
