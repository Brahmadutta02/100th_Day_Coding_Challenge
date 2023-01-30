import { api, channelNames, listeners } from '@wix/promote-analytics-adapter'
import { BusinessLogger } from '@wix/thunderbolt-symbols'
import { IConsentPolicy } from 'feature-consent-policy'
import { getDefaultChannels, getLoadedChannels } from './channels'
import { ReporterProps } from './channels/types'
import { LoadedScripts } from './tag-manager/types'

export const initChannels = (reporterProps: ReporterProps, loadedScripts: LoadedScripts) => {
	const channels = getLoadedChannels(reporterProps, loadedScripts)
	if (channels.length) {
		api.init(channels)
		initGoogleReporterEC()
	}
}

export const initListeners = (reporterProps: ReporterProps) => {
	api.addListener([listeners[channelNames.WIX_DEVELOPERS_ANALYTICS]], reporterProps)
}

export const initDefaultChannels = (
	reporterProps: ReporterProps,
	businessLogger: BusinessLogger,
	consentPolicy: IConsentPolicy
) => {
	const defaultChannels = getDefaultChannels(reporterProps, businessLogger, consentPolicy)
	api.init(defaultChannels)
	initListeners(reporterProps)
}

export const trackEvent = (eventName: string, params = {}, options = {}) => {
	api.trackEvent(eventName, params, options)
}

export const trackEventToChannelsOnly = (eventName: string, params = {}, options = {}) => {
	api.trackEventToChannelsOnly(eventName, params, options)
}

export const trackEventToListenersOnly = (eventName: string, params = {}, options = {}) => {
	api.trackEventToListenersOnly(eventName, params, options)
}

function initGoogleReporterEC() {
	window && typeof window.ga === 'function' && window.ga('require', 'ec')
}
