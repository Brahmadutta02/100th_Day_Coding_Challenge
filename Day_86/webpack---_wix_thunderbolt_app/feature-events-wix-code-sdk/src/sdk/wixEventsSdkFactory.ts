import { GetInvoiceResponse } from '@wix/ambassador-wix-events-web/types'
import { WixCodeApiFactoryArgs } from '@wix/thunderbolt-symbols'
import { namespace, WixEventsWixCodeSdkWixCodeApi } from '..'
import { EVENT_APP_DEF_ID } from './constants'
import { convertInputsToMap } from './helpers'
import { checkout, updateOrder, verifyCoupon } from './services/checkout'
import { createForm } from './services/form'
import { formatRegistrationFormDataLegacy, getRegistrationFormData } from './services/form-data'
import { createRsvp } from './services/rsvp'
import { reserveTickets } from './services/ticket-reservation'
import { ValidationService } from './services/validation-service'
import {
	CheckoutResponseCorvid,
	EditorInputs,
	LegacyFormData,
	ReserveTicketsResponseCorvid,
	RsvpCorvid,
	SelectedTickets,
	ValidationResponse,
} from './types/types'
import { prepareEventsApi } from './utils/api'

export function WixEventsSdkFactory({
	platformUtils,
}: WixCodeApiFactoryArgs): { [namespace]: WixEventsWixCodeSdkWixCodeApi } {
	const { sessionService } = platformUtils

	const getRequestHeaders = () => ({
		Authorization: sessionService.getInstance(EVENT_APP_DEF_ID),
		Accept: 'application/json',
	})

	prepareEventsApi(getRequestHeaders)

	return {
		[namespace]: {
			createEventRsvpForm(eventId: string) {
				let validationService: ValidationService | null

				const initValidationService = async () => {
					if (!validationService) {
						const form = await getRegistrationFormData(eventId)
						validationService = new ValidationService(form)
					}
				}

				const refreshValidationService = async () => {
					validationService = null
					return initValidationService()
				}

				return {
					submit: async (editorInputs: EditorInputs): Promise<RsvpCorvid> => {
						await refreshValidationService()
						const parsedEditorInputs = convertInputsToMap(editorInputs)
						validationService!.validate(parsedEditorInputs)
						const inputValues = createForm(parsedEditorInputs)
						const { rsvpStatus } = parsedEditorInputs
						return createRsvp(eventId, { inputValues }, rsvpStatus)
					},

					getRsvpData: async (): Promise<LegacyFormData> => {
						return formatRegistrationFormDataLegacy(await getRegistrationFormData(eventId))
					},

					validate: async (editorInputs: EditorInputs): Promise<ValidationResponse> => {
						await refreshValidationService()
						const parsedEditorInputs = convertInputsToMap(editorInputs)
						return validationService.validate(parsedEditorInputs)
					},

					validateInput: async (
						inputId: string,
						allEditorInputs: EditorInputs
					): Promise<ValidationResponse> => {
						await initValidationService()
						const parsedEditorInputs = convertInputsToMap(allEditorInputs)
						return validationService!.validateInput(inputId, parsedEditorInputs)
					},
				}
			},
			rsvp: {
				createRsvp(eventId: string, form: EditorInputs) {
					const parsedEditorInputs = convertInputsToMap(form)
					const inputValues = createForm(parsedEditorInputs)
					const { rsvpStatus } = parsedEditorInputs
					return createRsvp(eventId, { inputValues }, rsvpStatus)
				},
			},
			tickets: {
				reserve: (eventId: string, selectedTickets: SelectedTickets): Promise<ReserveTicketsResponseCorvid> => {
					return reserveTickets(eventId, selectedTickets)
				},
				verifyCoupon: (eventId: string, reservationId: string, coupon: string): Promise<GetInvoiceResponse> => {
					return verifyCoupon(eventId, reservationId, coupon)
				},
				checkout: (
					eventId: string,
					reservationId: string,
					data: { formValues: EditorInputs; coupon: string }
				): Promise<CheckoutResponseCorvid> => {
					return checkout(eventId, reservationId, {
						guest: createForm(convertInputsToMap(data.formValues)),
						couponCode: data.coupon,
					})
				},
				updateOrder: (eventId: string, orderNumber: string, data: { formValues: EditorInputs }) => {
					return updateOrder(eventId, orderNumber, {
						guest: createForm(convertInputsToMap(data.formValues)),
					})
				},
			},
			getForm: async (eventId: string) => {
				const form = await getRegistrationFormData(eventId)
				const validationService = new ValidationService(form)

				return {
					formData: form,
					validate: async (editorInputs: EditorInputs): Promise<ValidationResponse> => {
						const parsedEditorInputs = convertInputsToMap(editorInputs)
						return validationService.validate(parsedEditorInputs)
					},
					validateInput: (inputId: string, allEditorInputs: EditorInputs): ValidationResponse => {
						const parsedEditorInputs = convertInputsToMap(allEditorInputs)
						return validationService.validateInput(inputId, parsedEditorInputs)
					},
				}
			},
		},
	}
}
