import { MetaSiteModel, SitePagesModel } from '@wix/site-assets-client'
import { DataFixersParams, Experiments, SiteRevisionConfig, SiteScopeParams } from '@wix/thunderbolt-symbols'

const experimentsAsRecord = (experiments: Experiments) =>
	Object.assign(
		{},
		...Object.entries(experiments).map(([key, value]) => {
			return {
				[key]: `${value}`,
			}
		})
	)

export function toMetaSiteModel(dataFixersParams: DataFixersParams, siteScopeParam: SiteScopeParams): MetaSiteModel {
	const { isHttps, isUrlMigrated, metaSiteId, siteId } = dataFixersParams
	return {
		clientSpecMap: siteScopeParam.anonymousClientSpecMap,
		isHttps,
		isUrlMigrated,
		metaSiteId,
		siteId,
		csmCacheKey: siteScopeParam.csmCacheKey,
	}
}

const isSiteRevisionConfig = (config: SiteRevisionConfig | {}): config is SiteRevisionConfig =>
	Object.keys(config).length > 0

export function toSitePagesModel(dataFixersParams: DataFixersParams, siteScopeParam: SiteScopeParams): SitePagesModel {
	const { dfVersion, experiments, quickActionsMenuEnabled, v, siteRevision, cacheVersions } = dataFixersParams
	const { pageJsonFileNames, protectedPageIds, routersInfo, urlFormatModel, siteRevisionConfig } = siteScopeParam

	return {
		dataFixerVersion: dfVersion,
		experiments: experimentsAsRecord(experiments),
		pageJsonFileNames,
		protectedPageIds,
		quickActionsMenuEnabled,
		routersInfo,
		siteRevision,
		urlFormatModel,
		v,
		...(isSiteRevisionConfig(siteRevisionConfig) && { siteRevisionConfig }), // Pass it only if siteRevisionConfig exists
		cacheVersions,
	}
}
