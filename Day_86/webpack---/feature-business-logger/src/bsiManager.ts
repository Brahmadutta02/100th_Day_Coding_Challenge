import { withDependencies } from '@wix/thunderbolt-ioc'
import { ConsentPolicySymbol, IConsentPolicy } from 'feature-consent-policy'
import { CommonConfigSymbol, ICommonConfig } from 'feature-common-config'
import { ManagerMaster } from '@wix/bsi-manager'
import type { IBsiManager, Manager } from './types'
import { IPageNumber, PageNumberSymbol } from 'feature-router'

const generateGuid = () =>
	'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (e) {
		const i = (16 * Math.random()) | 0
		return ('x' === e ? i : (3 & i) | 8).toString(16)
	})

const bsiManagerFactory = (
	consentPolicy: IConsentPolicy,
	commonConfig: ICommonConfig,
	pageNumberHandler: IPageNumber
): IBsiManager => {
	const isSSR = !process.env.browser
	let bsiManager: Manager
	if (!isSSR) {
		bsiManager = new ManagerMaster().init({
			genGuid: generateGuid,
			getCommonConfig: () => ({
				get: (key: 'bsi') => commonConfig.getCommonConfig()[key],
				set: (property, value) => commonConfig.updateCommonConfig({ [property]: value }),
			}),
		})
	} else {
		// Mock for SSR
		bsiManager = { getBsi: () => '' }
	}

	const getBsi = () => {
		const pageNumber = pageNumberHandler.getPageNumber()
		return bsiManager.getBsi(pageNumber)
	}

	return {
		getBsi,
		reportActivity: getBsi,
		onUrlChange: () => {
			getBsi()
		},
	}
}

export const BsiManager = withDependencies(
	[ConsentPolicySymbol, CommonConfigSymbol, PageNumberSymbol],
	bsiManagerFactory
)
