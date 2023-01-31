import { withDependencies } from '@wix/thunderbolt-ioc'
import { ILogger, IStructureAPI, LoggerSymbol, Structure, ViewerModel, ViewerModelSym } from '@wix/thunderbolt-symbols'

export default withDependencies(
	[LoggerSymbol, ViewerModelSym, Structure],
	(logger: ILogger, viewerModel: ViewerModel, structureApi: IStructureAPI) => {
		const eventData = logger.getEventsData()
		const enrichingCondition =
			viewerModel.fleetConfig.type === 'Canary' || viewerModel.requestUrl.includes('performanceTool=true')
		return {
			enrichWarmupData: async () => {
				return enrichingCondition
					? {
							ssrEvents: eventData,
							components: Object.values(structureApi.getEntireStore()).map((item) => item.componentType),
					  }
					: null
			},
		}
	}
)
