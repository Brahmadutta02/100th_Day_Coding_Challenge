import { WixBiSession } from '@wix/thunderbolt-symbols'
import { ReporterProps, BiProps, AppMarketProps } from '../channels/types'
import { IFeatureState } from 'thunderbolt-feature-state'
import { ReporterState } from '..'

export const setState = (featureState: IFeatureState<ReporterState>, partialState = {}) =>
	featureState.update((prevState: any) => Object.assign(prevState || {}, partialState))

export function getReporterProps(siteData: any, wixBiSession: WixBiSession): ReporterProps {
	const biProps: BiProps = {
		...siteData,
		wixBiSession,
	}

	const appMarketProps: AppMarketProps = {
		isPremium: () => siteData.isPremium,
		getUserId: () => siteData.userId,
		getMetaSiteId: () => siteData.metaSiteId,
	}

	return {
		...biProps,
		...appMarketProps,
	}
}
