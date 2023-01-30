import { EventsApi } from '../utils/api'
import { EventFieldset } from '@wix/ambassador-wix-events-web/types'

export const getEvent = async (eventId: string) => {
	return (await EventsApi())
		.EventManagement()
		.getEvent({
			fieldset: [EventFieldset.FORM, EventFieldset.REGISTRATION],
			id: eventId,
		})
		.then(({ event }) => event)
}
