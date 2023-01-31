import { ManagerSlave } from '@wix/bsi-manager'
import type { CommonConfig, IConsentPolicyManager, OnPageWillUnmount, ICommonConfigModule } from '@wix/thunderbolt-symbols'
import type { BootstrapData } from '../../types'
import type { IViewerHandlers } from '../types'
import { BOOTSTRAP_DATA, BSI_MANAGER, COMMON_CONFIG, CONSENT_POLICY_MANAGER, ON_PAGE_WILL_UNMOUNT, VIEWER_HANDLERS } from './moduleNames'

const BsiManager = (
	commonConfigModule: ICommonConfigModule,
	consentPolicyManager: IConsentPolicyManager,
	bootstrapData: BootstrapData,
	{ viewerHandlers }: IViewerHandlers,
	onPageWillUnmount: OnPageWillUnmount
): { bsiManager: ManagerSlave } => {
	const readOnlyCommonConfig = {
		get: (key: keyof CommonConfig) => commonConfigModule.get()[key],
		subscribe: commonConfigModule.registerToChange,
	}

	const bsiManager = new ManagerSlave()
		.init(
			{
				getCommonConfig: () => readOnlyCommonConfig,
				getConsentPolicy: () => consentPolicyManager.getDetails(),
			},
			{ enableCookie: false }
		)
		.onActivity(() => {
			viewerHandlers.reportActivity()
		})

	onPageWillUnmount(() => bsiManager.destroy())

	return { bsiManager }
}

export default {
	factory: BsiManager,
	deps: [COMMON_CONFIG, CONSENT_POLICY_MANAGER, BOOTSTRAP_DATA, VIEWER_HANDLERS, ON_PAGE_WILL_UNMOUNT],
	name: BSI_MANAGER,
}
