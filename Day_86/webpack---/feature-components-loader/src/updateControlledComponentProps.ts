import {
	IPropsStore,
	Props,
	BusinessLogger,
	BusinessLoggerSymbol,
	ReporterSymbol,
	IReporterApi,
	IPlatformPropsSyncManager,
	PlatformPropsSyncManagerSymbol,
	Structure,
	IStructureStore,
	StateRefsValues,
} from '@wix/thunderbolt-symbols'
import { withDependencies, optional } from '@wix/thunderbolt-ioc'
import _ from 'lodash'

export const controlledComponentFactory = withDependencies(
	[Props, Structure, PlatformPropsSyncManagerSymbol, optional(BusinessLoggerSymbol), optional(ReporterSymbol)],
	(
		propsStore: IPropsStore,
		structureStore: IStructureStore,
		platformPropsSyncManager: IPlatformPropsSyncManager,
		businessLogger?: BusinessLogger,
		reporter?: IReporterApi
	) => {
		const createCompControllerArgs: any = (displayedId: string, stateRefs: StateRefsValues = {}) => {
			const stateRefsFunctions = _.pickBy(stateRefs, _.isFunction)
			const updateProps = () => {}

			return {
				...(reporter && { trackEvent: reporter.trackEvent }),
				...stateRefsFunctions,
				// @ts-ignore
				reportBi: (params, ctx) => {
					// @ts-ignore
					return businessLogger?.logger.log(params, ctx) ?? Promise.resolve()
				},
				updateProps,
			}
		}

		return {
			extendRendererProps() {
				return {
					createCompControllerArgs,
				}
			},
		}
	}
)
