import _ from 'lodash'
import { ManagerSlave } from '@wix/bsi-manager'
import { createFedopsLogger } from '@wix/thunderbolt-commons'
import type { ViewerPlatformEssentials } from '@wix/fe-essentials-viewer-platform'
import type { PlatformServicesAPI, PlatformEnvData, SessionServiceAPI } from '@wix/thunderbolt-symbols'
import { biFactory } from './bi'
import { monitoringFactory } from './monitoring'
import { platformBiLoggerFactory } from '../../bi/biLoggerFactory'

export const createPlatformAppServicesApi = ({
	platformEnvData: {
		bi: biData,
		document: { referrer },
		location,
		site,
		topology,
	},
	appDefinitionId,
	instanceId,
	csrfToken,
	bsiManager,
	sessionService,
	essentials,
}: {
	platformEnvData: PlatformEnvData
	appDefinitionId: string
	instanceId: string
	csrfToken: string
	bsiManager: ManagerSlave
	sessionService: SessionServiceAPI
	essentials: ViewerPlatformEssentials
}): PlatformServicesAPI => {
	const viewMode = biData.isPreview ? ('preview' as const) : ('site' as const)

	const biLoggerFactoriesCreator = platformBiLoggerFactory({ sessionService, biData, location, site, factory: essentials.biLoggerFactory })
	const biLoggerFactory = () =>
		biLoggerFactoriesCreator
			.createBaseBiLoggerFactory()
			.withNonEssentialContext({
				bsi: () => bsiManager.getBsi(),
			})
			.updateDefaults({
				_appId: appDefinitionId,
				_instanceId: instanceId,
			})

	const fedOpsLoggerFactory = createFedopsLogger({
		biLoggerFactory: biLoggerFactoriesCreator
			.createBiLoggerFactoryForFedops()
			.withNonEssentialContext({
				bsi: () => bsiManager.getBsi({ extend: false }),
			})
			.updateDefaults({
				_appId: appDefinitionId,
				_instanceId: instanceId,
			}),
		customParams: {
			isMobileFriendly: biData.isMobileFriendly,
			viewerName: 'thunderbolt',
			viewMode,
		},
		paramsOverrides: { is_rollout: biData.rolloutData.isTBRollout },
		factory: essentials.createFedopsLogger,
	})

	const bi = biFactory({ biData, metaSiteId: location.metaSiteId, viewMode, sessionService })
	const monitoring = monitoringFactory({ url: biData.pageData.pageUrl, viewMode, viewerVersion: biData.viewerVersion, referrer })
	const appEssentials = essentials.createAppEssentials({
		appDefId: appDefinitionId,
		getLoggerForWidget: fedOpsLoggerFactory.getLoggerForWidget.bind(fedOpsLoggerFactory),
		biLoggerFactory,
	})

	return {
		getCsrfToken: () => csrfToken,
		bi,
		biLoggerFactory,
		fedOpsLoggerFactory,
		reportTrace: _.noop,
		monitoring,
		essentials: appEssentials,
		topology,
	}
}
