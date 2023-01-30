import type { ConsentPolicyChangedHandler, IConsentPolicyManager, OnPageWillUnmount } from '@wix/thunderbolt-symbols'
import type { ConsentPolicy, PolicyDetails, PolicyHeaderObject } from '@wix/cookie-consent-policy-client'
import type { BootstrapData } from '../../types'
import type { IViewerHandlers } from '../types'
import { BOOTSTRAP_DATA, CONSENT_POLICY_MANAGER, ON_PAGE_WILL_UNMOUNT, VIEWER_HANDLERS } from './moduleNames'

const ConsentPolicyManager = ({ viewerHandlers }: IViewerHandlers, { platformEnvData }: BootstrapData, onPageWillUnmount: OnPageWillUnmount): IConsentPolicyManager => {
	const { isSSR } = platformEnvData.window
	let { details: consentPolicyDetails, header: consentPolicyHeaderObject } = platformEnvData.consentPolicy

	const clonePolicyDetails = (policyDetails: PolicyDetails) => ({
		...policyDetails,
		policy: {
			...policyDetails.policy,
		},
	})

	const clonePolicyHeaderObject = (policyHeaderObject: PolicyHeaderObject) => ({
		...policyHeaderObject,
	})

	const consentPolicyChangedHandlers: Array<ConsentPolicyChangedHandler> = []

	if (process.env.browser) {
		viewerHandlers.consentPolicy
			.registerToConsentPolicyUpdates((policyDetails: PolicyDetails, policyHeaderObject: PolicyHeaderObject) => {
				consentPolicyDetails = policyDetails
				consentPolicyHeaderObject = policyHeaderObject
				consentPolicyChangedHandlers.forEach((handler) => handler(clonePolicyDetails(policyDetails)))
			})
			.then(onPageWillUnmount)
	}

	return {
		getDetails() {
			return clonePolicyDetails(consentPolicyDetails)
		},
		getHeader() {
			return clonePolicyHeaderObject(consentPolicyHeaderObject)
		},
		setPolicy(policy: ConsentPolicy) {
			return isSSR ? Promise.resolve(consentPolicyDetails) : viewerHandlers.consentPolicy.setConsentPolicy(policy)
		},
		resetPolicy() {
			return isSSR ? Promise.resolve() : viewerHandlers.consentPolicy.resetConsentPolicy()
		},
		onChanged(handler: ConsentPolicyChangedHandler) {
			consentPolicyChangedHandlers.push(handler)
		},
	}
}

export default {
	factory: ConsentPolicyManager,
	deps: [VIEWER_HANDLERS, BOOTSTRAP_DATA, ON_PAGE_WILL_UNMOUNT],
	name: CONSENT_POLICY_MANAGER,
}
