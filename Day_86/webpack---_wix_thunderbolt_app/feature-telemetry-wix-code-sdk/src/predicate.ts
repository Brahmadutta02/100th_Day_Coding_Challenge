import type { ClientSpecMapAPI, IModelsAPI } from '@wix/thunderbolt-symbols'

export const isTelemetryWixCodeSdkRequired = ({
	modelsApi,
	clientSpecMapApi,
}: {
	modelsApi: IModelsAPI
	clientSpecMapApi: ClientSpecMapAPI
}) => {
	const applications = modelsApi.getApplications()

	const isAppRunning = (appDefId?: string) => Boolean(appDefId && applications[appDefId])

	const isWixCodeRunning = isAppRunning(clientSpecMapApi.getWixCodeAppDefinitionId())
	const isDataBindingRunning = isAppRunning(clientSpecMapApi.getDataBindingAppDefinitionId())
	const isBlocksEditorRunning = isAppRunning(clientSpecMapApi.getBlocksPreviewAppDefinitionId())
	const isBlocksRunning = clientSpecMapApi.getBlocksAppsAppDefinitionIds().some(isAppRunning)

	return isWixCodeRunning || isDataBindingRunning || isBlocksEditorRunning || isBlocksRunning
}
