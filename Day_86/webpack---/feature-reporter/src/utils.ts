import { ReporterState } from '.'
import { IFeatureState } from 'thunderbolt-feature-state'
import { IConsentPolicy } from 'feature-consent-policy'

export const setState = (featureState: IFeatureState<ReporterState>, partialState = {}) =>
	featureState.update((prevState: any) => Object.assign(prevState || {}, partialState))

export const isUserConsentProvided = (consentPolicy: IConsentPolicy) => {
	const currentPolicy = consentPolicy.getCurrentConsentPolicy()?.policy
	return currentPolicy?.analytics || currentPolicy?.advertising
}
