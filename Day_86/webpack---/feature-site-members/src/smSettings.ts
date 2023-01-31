import { ILogger, IReporterApi } from '@wix/thunderbolt-symbols'
import { getTrackEventParams, TRACK_EVENTS } from './constants'
import { ICaptchaSettings, ISiteMembersSettings } from './types'
import { getCaptchaSettings, getPerformFetch } from './utils'

export const SiteMembersSettingsService = (
	performFetch: ReturnType<typeof getPerformFetch>,
	logger: ILogger,
	reporter: IReporterApi,
	metasiteInstance?: string
) => {
	let siteMembersSettings: ISiteMembersSettings | undefined
	const siteMembersSettingsUrl = '/_api/wix-sm-webapp/v1/collection/settings'

	const getSiteMembersSettings = async (): Promise<ISiteMembersSettings> => {
		if (siteMembersSettings) {
			return siteMembersSettings
		}
		return performFetch(siteMembersSettingsUrl, {
			headers: {
				'Content-Type': 'application/json',
				authorization: metasiteInstance || '',
			},
		})
			.then((res: { settings: ISiteMembersSettings }) => res.settings)
			.then((settings: ISiteMembersSettings) => {
				siteMembersSettings = settings
				return settings
			})
	}
	return {
		getSiteMembersSettings,
		getCaptchaSettings: (): Promise<ICaptchaSettings> => {
			return getSiteMembersSettings()
				.then(getCaptchaSettings)
				.catch((error) => {
					logger.captureError(error as Error, { tags: { feature: 'site-members' } })
					reporter.trackEvent(getTrackEventParams(TRACK_EVENTS.ACTIONS.SETTINGS.FAIL))
					return {
						invisible: { login: false, signup: false },
						visible: { login: false, signup: true },
					}
				})
		},
	}
}
