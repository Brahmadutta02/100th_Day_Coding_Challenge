import { ProviderCreator } from '@wix/thunderbolt-ioc'
import { ILightbox, LightboxSymbol } from 'feature-lightbox'

export type IPopupApi = { getPopupsApi: () => ILightbox | null }

export const popupApiProvider: ProviderCreator<IPopupApi> = (container) => {
	return async () => ({
		getPopupsApi: (): ILightbox | null => {
			try {
				return container.get(LightboxSymbol)
			} catch {
				return null
			}
		},
	})
}
