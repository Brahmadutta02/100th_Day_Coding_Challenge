import { withDependencies, optional } from '@wix/thunderbolt-ioc'
import { TpaHandlerProvider } from '@wix/thunderbolt-symbols'
import { ReporterSymbol } from './symbols'
import type { IReporterApi } from './types'
import { withViewModeRestriction } from '@wix/thunderbolt-commons'

export type MessageData = {
	eventName: string
	params: object
	options: object
}

export const TrackEventHandler = withDependencies(
	[optional(ReporterSymbol)],
	(reporterFeature?: IReporterApi): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				trackEvent: withViewModeRestriction(
					['site'],
					(compId, { eventName, params, options }: MessageData): void => {
						const event = { eventName, params, options }
						return reporterFeature?.trackEvent(event)
					}
				),
			}
		},
	})
)
