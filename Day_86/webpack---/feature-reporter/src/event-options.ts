import type { ReporterSiteConfig } from './types'

export const enrichEventOptions = (options: object, siteConfig: ReporterSiteConfig) => ({
	...options,
	isFBServerEventsEnabled: siteConfig.isFBServerEventsAppProvisioned,
})
