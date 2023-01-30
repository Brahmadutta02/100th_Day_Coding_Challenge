import type { ITpaModal } from '../types'
import type { ITpaPopup } from '@wix/thunderbolt-symbols'

export const closeWindow = ({
	tpaModal,
	tpaPopup,
	compId = '',
	onCloseMessage,
}: {
	tpaModal: ITpaModal
	tpaPopup: ITpaPopup
	compId?: string
	onCloseMessage?: any
}) => {
	if (tpaPopup.isPopup(compId)) {
		tpaPopup.closePopup(compId, onCloseMessage)
	} else {
		tpaModal.closeModal(onCloseMessage)
	}
}
