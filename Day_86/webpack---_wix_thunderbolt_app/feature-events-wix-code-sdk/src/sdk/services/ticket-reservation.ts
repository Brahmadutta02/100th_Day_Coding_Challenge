import { EventsApi } from '../utils/api'
import { ReserveTicketsResponseCorvid, SelectedTickets, TicketReservationCorvid } from '../types/types'
import { omit } from 'lodash'
import { TicketReservation } from '@wix/ambassador-wix-events-web/types'

export const reserveTickets = async (
	eventId: string,
	selectedTickets: SelectedTickets
): Promise<ReserveTicketsResponseCorvid> => {
	const result = await (await EventsApi()).CheckoutService().createReservation({
		eventId,
		ticketQuantities: selectedTickets.map((selectedTicket) => ({
			ticketDefinitionId: selectedTicket.ticketId,
			quantity: selectedTicket.quantity,
		})),
	})

	return {
		...omit(result, 'expires'),
		reservations: result.reservations.map(formatTicketReservation),
		expirationTime: new Date(result.expires),
	}
}

const formatTicketReservation = (reservation: TicketReservation): TicketReservationCorvid => ({
	...reservation,
	ticket: {
		...omit(reservation.ticket, 'id'),
		_id: reservation.ticket.id,
	},
})
