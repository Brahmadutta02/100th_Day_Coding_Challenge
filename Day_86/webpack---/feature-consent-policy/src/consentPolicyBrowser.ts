import { withDependencies, named } from '@wix/thunderbolt-ioc'
import {
	SiteFeatureConfigSymbol,
	ViewerModel,
	ViewerModelSym,
	BrowserWindow,
	BrowserWindowSymbol,
} from '@wix/thunderbolt-symbols'
import { CommonConfigSymbol, ICommonConfig } from 'feature-common-config'
import type { IConsentPolicy, ConsentPolicySiteConfig, ConsentPolicyUpdatesListener } from './types'
import { name } from './symbols'

// This loads the consentPolicyManager client script, as part of the feature bundle
import '@wix/cookie-consent-policy-client'

export const ConsentPolicyBrowser = withDependencies(
	[named(SiteFeatureConfigSymbol, name), CommonConfigSymbol, ViewerModelSym, BrowserWindowSymbol],
	(
		config: ConsentPolicySiteConfig,
		commonConfig: ICommonConfig,
		viewerModel: ViewerModel,
		window: BrowserWindow
	): IConsentPolicy => {
		const listeners: Set<ConsentPolicyUpdatesListener> = new Set()

		const api: IConsentPolicy = {
			getCurrentConsentPolicy() {
				return window!.consentPolicyManager!.getCurrentConsentPolicy()
			},
			_getConsentPolicyHeader() {
				return window!.consentPolicyManager!._getConsentPolicyHeader()
			},
			setConsentPolicy(policy) {
				return new Promise((resolve, reject) => {
					window!.consentPolicyManager!.setConsentPolicy(policy, resolve, reject)
				})
			},
			resetConsentPolicy() {
				window!.consentPolicyManager!.resetPolicy()
				return Promise.resolve()
			},
			registerToChanges(listener) {
				listeners.add(listener)
				return () => listeners.delete(listener)
			},
		}

		window!.consentPolicyManager!.init({
			baseUrl: viewerModel.site.externalBaseUrl,
			consentPolicy: config.siteConsentPolicy,
		})
		commonConfig.updateCommonConfig({
			consentPolicy: api.getCurrentConsentPolicy().policy,
			consentPolicyHeader: api._getConsentPolicyHeader(),
		})

		const onConsentPolicyChanged = (): void => {
			const policyDetails = window!.consentPolicyManager!.getCurrentConsentPolicy()
			const policyHeaderObject = window!.consentPolicyManager!._getConsentPolicyHeader()
			commonConfig.updateCommonConfig({
				consentPolicy: policyDetails.policy,
				consentPolicyHeader: policyHeaderObject,
			})
			listeners.forEach((listener) => listener(policyDetails, policyHeaderObject))
		}

		// @ts-ignore
		window!.document.addEventListener('consentPolicyChanged', onConsentPolicyChanged)

		return api
	}
)
