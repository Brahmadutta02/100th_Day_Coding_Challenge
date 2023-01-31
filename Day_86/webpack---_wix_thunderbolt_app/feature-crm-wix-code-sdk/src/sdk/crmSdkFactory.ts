import { WixCodeApiFactoryArgs } from '@wix/thunderbolt-symbols'
import { namespace, CrmWixCodeSdkWixCodeApi, ContactInfo } from '..'
import {
	AppDefIds,
	EMAIL_CONTACT_URL,
	CREATE_LEGACY_CONTACT_URL,
	EMAIL_MEMBER_URL,
	SUBMIT_CONTACT_URL,
} from './common/config'
import type { ContactV1Info } from '../types'
import { validateEmailContactParams, validateContactInfo, validateContactV1Info } from './common/validations'
import { post } from './common/api'
import { createFedopsLogger } from './common/fedops'
import { mapContactToServerDTO } from './common/utils'
import { contacts as contactsJsCommons } from '@wix/crm-wixcode-js-commons'

function buildEmailContact(methodName, fedopsLogger, sessionService) {
	return async function emailContact(emailId, toContact, options) {
		const { valid, processedOptions } = validateEmailContactParams(emailId, toContact, options)
		if (!valid) {
			return Promise.reject('error')
		}
		const body =
			methodName === 'email-member'
				? { emailId, memberId: toContact, options: processedOptions }
				: { emailId, contactId: toContact, options: processedOptions }
		fedopsLogger.interactionStarted(methodName)
		const resp = await post({
			url: methodName === 'email-member' ? EMAIL_MEMBER_URL : EMAIL_CONTACT_URL,
			instanceId: sessionService.getInstance(AppDefIds.shoutOut),
			body,
		})
		fedopsLogger.interactionEnded(methodName)
		return resp
	}
}

export function CrmSdkFactory({ platformUtils }: WixCodeApiFactoryArgs): { [namespace]: CrmWixCodeSdkWixCodeApi } {
	const { sessionService, biUtils, essentials } = platformUtils

	const fedopsLogger = createFedopsLogger(essentials, biUtils)
	return {
		[namespace]: {
			async createContact(contactInfo: ContactV1Info): Promise<any> {
				fedopsLogger.interactionStarted('create-contact')
				if (!validateContactV1Info(contactInfo)) {
					return
				}

				const serializedContactInfo = contactsJsCommons.serializeContactInfo(contactInfo)

				try {
					const { contact } = await post({
						url: CREATE_LEGACY_CONTACT_URL,
						instanceId: sessionService.getInstance(AppDefIds.wixCode),
						body: { contact: serializedContactInfo },
					})
					return contact.id
				} catch (message) {
					return message
				} finally {
					fedopsLogger.interactionEnded('create-contact')
				}
			},
			contacts: {
				async appendOrCreateContact(contactInfo: ContactInfo): Promise<any> {
					fedopsLogger.interactionStarted('submit-contact')
					if (!validateContactInfo(contactInfo)) {
						return
					}
					try {
						return await post({
							url: SUBMIT_CONTACT_URL,
							instanceId: sessionService.getInstance(AppDefIds.wixCode),
							body: mapContactToServerDTO(contactInfo),
						})
					} catch (message) {
						return message
					} finally {
						fedopsLogger.interactionEnded('submit-contact')
					}
				},
			},
			emailContact: buildEmailContact('email-contact', fedopsLogger, sessionService),
			triggeredEmails: {
				emailContact: buildEmailContact('email-contact', fedopsLogger, sessionService),
				emailMember: buildEmailContact('email-member', fedopsLogger, sessionService),
			},
		},
	}
}
