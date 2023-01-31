import { withDependencies } from '@wix/thunderbolt-ioc'
import type { ITpaModal } from '../types'
import { TpaModalSymbol } from '../symbols'
import { TpaHandlerProvider, TpaPopupSymbol, ITpaPopup } from '@wix/thunderbolt-symbols'
import { closeWindow } from '../utils/closeWindow'

export const CloseWindowHandler = withDependencies(
	[TpaModalSymbol, TpaPopupSymbol],
	(tpaModal: ITpaModal, tpaPopup: ITpaPopup): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				closeWindow: (compId, onCloseMessage) => closeWindow({ tpaModal, tpaPopup, compId, onCloseMessage }),
			}
		},
	})
)
