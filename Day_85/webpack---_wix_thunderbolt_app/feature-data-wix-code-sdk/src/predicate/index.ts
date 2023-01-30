import type { ClientSpecMapAPI, IModelsAPI } from '@wix/thunderbolt-symbols'

export const isWixDataRequired = ({
	modelsApi,
	clientSpecMapApi,
}: {
	modelsApi: IModelsAPI
	clientSpecMapApi: ClientSpecMapAPI
}) => {
	const applications = modelsApi.getApplications()
	const isAppRunning = (appDefId?: string) => Boolean(appDefId && applications[appDefId])

	const isWixCodeRunning = isAppRunning(clientSpecMapApi.getWixCodeAppDefinitionId())
	const isDatabindingRunning = isAppRunning(clientSpecMapApi.getDataBindingAppDefinitionId())
	const isBlocksRunning = clientSpecMapApi.getBlocksAppsAppDefinitionIds().some(isAppRunning)
	const isBlocksEditorRunning = isAppRunning(clientSpecMapApi.getBlocksPreviewAppDefinitionId())

	return isWixCodeRunning || isDatabindingRunning || isBlocksRunning || isBlocksEditorRunning
}
