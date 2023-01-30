import type { ClientSpecMapAPI, IModelsAPI, PlatformEnvData } from '@wix/thunderbolt-symbols'

export const isElementorySupportWixCodeSdkRequired = ({
	modelsApi,
	clientSpecMapApi,
	platformEnvData,
}: {
	modelsApi: IModelsAPI
	clientSpecMapApi: ClientSpecMapAPI
	platformEnvData: PlatformEnvData
}) => {
	const applications = modelsApi.getApplications()
	const isAppRunning = (appDefId?: string) => Boolean(appDefId && applications[appDefId])

	const isWixCodeRunning = isAppRunning(clientSpecMapApi.getWixCodeAppDefinitionId())
	const isDataBindingRunning = isAppRunning(clientSpecMapApi.getDataBindingAppDefinitionId())
	const isBlocksEditorRunning = isAppRunning(clientSpecMapApi.getBlocksPreviewAppDefinitionId())
	const isBlocksRunning = clientSpecMapApi.getBlocksAppsAppDefinitionIds().some(isAppRunning)
	const isExperimentEnabled = Boolean(
		platformEnvData.site.experiments['specs.thunderbolt.WixCodeElementorySupportSdk']
	)

	return (isWixCodeRunning || isDataBindingRunning || isBlocksEditorRunning || isBlocksRunning) && isExperimentEnabled
}
