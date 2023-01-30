import { presetsTypes } from '@wix/fedops-presets'
import type { ViewerPlatformEssentials } from '@wix/fe-essentials-viewer-platform'
import { FedopsConfig } from '@wix/thunderbolt-symbols'
import { AppsMutingWhiteList, ThunderboltMutingBlackList, ThunderboltMutingWhiteList } from './constants'
import type { FedopsLogger, IAppIdentifier } from '@wix/fedops-logger'

export type FedopsFactory = ViewerPlatformEssentials['createFedopsLogger']

export const createFedopsLogger = ({
	biLoggerFactory,
	customParams = {},
	phasesConfig = 'SEND_ON_FINISH',
	appName = 'thunderbolt',
	presetType = process.env.PACKAGE_NAME === 'thunderbolt-ds' ? presetsTypes.DS : presetsTypes.BOLT,
	reportBlackbox = false,
	paramsOverrides = {},
	factory,
	muteThunderboltEvents = false,
}: FedopsConfig & { factory: FedopsFactory }): FedopsLogger => {
	const fedopsLogger = factory(appName, {
		presetType,
		phasesConfig,
		isPersistent: true,
		isServerSide: !process.env.browser,
		reportBlackbox,
		customParams,
		biLoggerFactory,
		// @ts-ignore FEDINF-3725
		paramsOverrides,
	})
	const { interactionStarted, interactionEnded, appLoadingPhaseStart, appLoadingPhaseFinish } = fedopsLogger

	const shouldReportEvent = (event: string, appIdentifier?: IAppIdentifier) => {
		// ONLY THUNDERBOLT (APP_ID===UNDEFINED) AND APPS THAT WERE WHITELISTED SHOULD BE SAMPLED
		const appShouldReportAll = appIdentifier?.appId ? !AppsMutingWhiteList.has(appIdentifier.appId) : false

		// muteThunderboltEvents = false => event shouldn't muted => event should be reported
		const shouldAlwaysReportEvent = ThunderboltMutingBlackList.has(event)
		const shouldAlwaysMuteEvent = ThunderboltMutingWhiteList.has(event)

		return shouldAlwaysReportEvent || appShouldReportAll || (!shouldAlwaysMuteEvent && !muteThunderboltEvents)
	}

	// This is done this way because FedopsLogger is a class and not an Object,
	// Therefor if we return an object it will crash because it operates on 'this' which does not exist in an object
	// so we can't make it immutable.

	fedopsLogger.interactionStarted = (interaction: string, ...args) => {
		if (shouldReportEvent(interaction)) {
			return interactionStarted.call(fedopsLogger, interaction, ...args)
		} else {
			try {
				performance.mark(`${interaction} started`)
			} catch {}
		}
		return { timeoutId: 0 }
	}

	fedopsLogger.interactionEnded = (interaction: string, ...args) => {
		if (shouldReportEvent(interaction)) {
			interactionEnded.call(fedopsLogger, interaction, ...args)
		} else {
			try {
				performance.mark(`${interaction} ended`)
			} catch {}
		}
	}
	fedopsLogger.appLoadingPhaseStart = (phase: string, appIdentifier?: IAppIdentifier, ...args) => {
		if (shouldReportEvent(phase, appIdentifier)) {
			appLoadingPhaseStart.call(fedopsLogger, phase, appIdentifier, ...args)
		} else {
			try {
				performance.mark(`${phase} started`)
			} catch {}
		}
	}
	fedopsLogger.appLoadingPhaseFinish = (phase: string, appIdentifier?: IAppIdentifier, ...args) => {
		if (shouldReportEvent(phase, appIdentifier)) {
			appLoadingPhaseFinish.call(fedopsLogger, phase, appIdentifier, ...args)
		} else {
			try {
				performance.mark(`${phase} finished`)
			} catch {}
		}
	}
	return fedopsLogger
}
