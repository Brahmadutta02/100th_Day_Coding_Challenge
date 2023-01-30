import { channelNames } from '@wix/promote-analytics-adapter'
import { BusinessLogger } from '@wix/thunderbolt-symbols'
import { IConsentPolicy } from 'feature-consent-policy'
import { decorateReporter } from './decorateReporter'
import type { BiProps } from './types'
import { getUtmParams } from '../utm-params'
import { isUserConsentProvided } from '../utils'
import { PROMOTE_BI_ENDPOINT, PURCHASE_EVENT } from './constants'

export const getDefaultChannels = (biProps: BiProps, businessLogger: BusinessLogger, consentPolicy: IConsentPolicy) => {
	return [
		{
			name: channelNames.BI_ANALYTICS,
			report: decorateReporter(biProps, channelNames.BI_ANALYTICS, (params: any) => {
				const isPurchseEvent = params.src === PURCHASE_EVENT.SRC && params.evid === PURCHASE_EVENT.EVID
				if (isPurchseEvent) {
					const utmParams = getUtmParams()
					params = {
						...params,
						...(utmParams &&
							isUserConsentProvided(consentPolicy) && { utmData: JSON.stringify(utmParams) }),
					}
				}
				log(params)
			}),
		},
	]

	function log(params: object) {
		businessLogger.logger.log(params, { endpoint: PROMOTE_BI_ENDPOINT })
	}
}
