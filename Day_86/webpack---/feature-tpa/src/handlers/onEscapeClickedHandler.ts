import { withDependencies } from '@wix/thunderbolt-ioc'
import { TpaHandlerProvider, TpaPopupSymbol, ITpaPopup } from '@wix/thunderbolt-symbols'
import { TpaModalSymbol } from '../symbols'
import type { ITpaModal } from '../types'
import { closeWindow } from '../utils/closeWindow'

export const OnEscapeClickedHandler = withDependencies(
	[TpaModalSymbol, TpaPopupSymbol],
	(tpaModal: ITpaModal, tpaPopup: ITpaPopup): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				onEscapeClicked: (compId) => {
					closeWindow({ tpaModal, tpaPopup, compId })
				},
			}
		},
	})
)
