/**
 * Similar to the editor, -override is regarded as an internal query param - it should build the links with these params
 */
export const overrideSuffix = '-override'
/*
 * The Viewer doesn't preserve query params on internal navigation.
 * THIS LIST IS FOR INTERNAL QUERY PARAM ONLY!
 * Don't add query params here to support any kind of product.
 * If a product needs query params to persist after navigation - it should build the links with these params,
 * */
export const queryParamsWhitelist = new Set([
	'schemaDevMode',
	'currency',
	'metaSiteId',
	'isqa',
	'enableTestApi',
	'experiments',
	'experimentsoff',
	'suppressbi',
	'sampleratio',
	'hot',
	'viewerPlatformAppSources',
	'wixCodeForceKibanaReport',
	'controllersUrlOverride',
	'debug',
	'petri_ovr',
	'iswixsite',
	'showMobileView',
	'lang',
	'ssrDebug',
	'wixAdsOverlay',
	'ssrIndicator',
	'siteRevision',
	'branchId',
	'widgetsUrlOverride',
	'viewerPlatformOverrides',
	'overridePlatformBaseUrls',
	'thunderboltTag',
	'tpasUrlOverride',
	'tpasWorkerUrlOverride',
	'disableHtmlEmbeds',
	'suricateTunnelId',
	'inBizMgr',
	'viewerSource',
	'dsOrigin',
	'disableSiteAssetsCache',
	'isEditor',
	'isSantaEditor',
	'disableAutoSave',
	'autosaveRestore',
	'isEdited',
	'ds',
	'ooiInEditorOverrides',
	'localIframeWorker',
	'productionWorker',
	'siteAssetsFallback',
	'editorScriptUrlOverride',
	'tpaSettingsUrlOverride',
	'bobViewerScriptOverride', // Override viewer script when developing a BoB app in Blocks
	'appRevisionOverride', // Override the remote widget structure revision of a Blocks app
	'appDefinitionId', // Pass existing appDefinitionId when creating a new Blocks application
	'editorSdkSource',
	'EditorSdkSource',
	'origin', // Passed by the business-manager when the viewer is loaded as a widget
	'dashboardSdkAvailable', // Passed by the business-manager when the viewer is loaded as a widget (temporary)
	'dayful', // Used in Wix Anywhere flow, viewer-server modifies site models based on this param
])
