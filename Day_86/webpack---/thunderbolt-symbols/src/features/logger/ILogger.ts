import type { IStartInteractionOptions, IEndInteractionOptions } from '@wix/fe-essentials-viewer-platform/fedops'
import { IAppIdentifier } from '@wix/fe-essentials-viewer-platform/fedops'
import { Factory } from '@wix/fe-essentials-viewer-platform/bi'

export type Interaction = string
export type Phase = string

export type InteractionStarted = (
	interaction: Interaction,
	customParam?: Partial<IStartInteractionOptions>,
	shouldAddBreadcrumb?: boolean
) => void
export type InteractionEnded = (
	interaction: Interaction,
	customParam?: Partial<IEndInteractionOptions>,
	shouldAddBreadcrumb?: boolean
) => void
export type meter = (
	meterName: string,
	customParam?: Partial<IEndInteractionOptions>,
	shouldAddBreadcrumb?: boolean
) => void
export type phaseMark = (interaction: Phase, customParam?: object) => void
export type AppLoaded = (options?: Partial<IAppIdentifier>) => void
export type ReportAppLoadStarted = () => void
export type captureError = (
	error: Error,
	{
		tags,
		extra,
		groupErrorsBy,
		level,
	}: {
		tags: { [key: string]: string | boolean }
		extra?: { [key: string]: any }
		groupErrorsBy?: 'tags' | 'values'
		level?: string
	}
) => void
export type setGlobalsForErrors = (enrichment: any) => void
export type breadcrumb = (breadcrumb: any, additionalData?: object) => void

export const LOADING_PHASES = {
	WAIT_FOR_IMPORTS: 'wait-for-imports',
	APPLY_POLYFILLS: 'apply-polyfills',
	GET_COMPONENTS_MAPPERS: 'get-components-mappers',
	GET_CLIENT_WORKER: 'get-client-worker',
	GET_VIEWER_API: 'getViewerApi',
	INIT_DS_CARMI: 'init_ds_carmi',
	INIT_REGULAR_DS_CARMI: 'init_regular_ds_carmi',
	INIT_BY_REF_DS_CARMI: 'init_by_ref_ds_carmi',
	INIT_BY_REFSIS: 'init_by_refsis',
	GET_BECKY_MODEL: 'get_becky_model',
	INIT_DS_CONTAINER: 'init_ds_container',
	LOAD_INITIAL_DS_COMPONENTS: 'load_initial_ds_components',
	DS_LOAD_MASTER_PAGE: 'ds_load_masterPage',
	DS_ROUTER_NAVIGATE: 'ds_router_navigate',
	DS_LOAD_PAGE_ASSETS: 'ds_load_page_assets',
	DS_LOAD_MASTER_PAGE_ASSETS: 'ds_load_masterPage_assets',
	INIT_DS_VIEWER_API: 'init_ds_viewerApi',
	INITIAL_DS_RENDER: 'initial_ds_render',
	APP_WILL_RENDER_FIRST_PAGE: 'app_will_render_first_page',
	DS_WAIT_FOR_DID_MOUNT: 'ds_wait_for_didMount',
	DS_INVOKE_RENDER_DONE_HANDLERS: 'ds_invoke_render_done_handlers',
	DS_INVOKE_LAYOUT_CHANGE_HANDLERS: 'ds_invoke_layout_change_handlers',
	DS_NOTIFY_RENDER_DONE: 'ds_notify_render_done',
	DS_NOTIFY_LAYOUT_CHANGE: 'ds_notify_layout_change',
	DS_WAIT_FOR_LAYOUT_DONE: 'ds_wait_for_layout_done',
	DS_WAIT_FOR_VIEW_MODE: 'ds_wait_for_view_mode',
	DS_WAIT_FOR_DATA_REQUIREMENTS: 'ds_wait_for_data_requirements',
	DS_PENDING_REQUIREMENTS_viewerManagerFontsApi: 'ds_pending_requirements_viewerManagerFontsApi',
	DS_PENDING_REQUIREMENTS_viewerManagerByRefApi: 'ds_pending_requirements_viewerManagerByRefApi',
	DS_PENDING_REQUIREMENTS_componentsUpdatesManager: 'ds_pending_requirements_componentsUpdatesManager',
	DS_PENDING_REQUIREMENTS_viewerManagerUpdateStatusApi: 'ds_pending_requirements_viewerManagerUpdateStatusApi',
	DS_PENDING_REQUIREMENTS_navigationManager: 'ds_pending_requirements_navigationManager',
	DS_PENDING_REQUIREMENTS_translations: 'ds_pending_requirements_translations',
	DS_WAIT_FOR_NAVIGATION: 'ds_wait_for_navigation',
	DS_INITIAL_NAVIGATION: 'ds_initial_navigation',
	PAGE_REFLECTOR: 'page_reflector',
}

export type ServerPerformanceEvent = {
	name: string
	startTime: number
}

export interface ILogger {
	updatePageNumber: (pn: number) => void
	updatePageId: (pageId: string) => void
	updateApplicationsMetaSite: (instance: string) => void
	reportAsyncWithCustomKey<T>(asyncMethod: () => Promise<T>, methodName: string, key: string): Promise<T>
	runAsyncAndReport<T>(asyncMethod: () => Promise<T>, methodName: string): Promise<T>
	runAndReport<T>(method: () => T, methodName: string): T
	captureError: captureError
	setGlobalsForErrors: setGlobalsForErrors
	breadcrumb: breadcrumb
	addBreadcrumbToBatch(message: string, data: any): void
	flushBreadcrumbBatch(): void
	interactionStarted: InteractionStarted
	interactionEnded: InteractionEnded
	phaseStarted: phaseMark
	phaseEnded: phaseMark
	meter: meter
	reportAppLoadStarted: ReportAppLoadStarted
	appLoaded: AppLoaded
	registerPlatformWidgets(widgetAppNames: Array<string>): void
	getEventsData: () => Array<ServerPerformanceEvent>
	addSSRPerformanceEvents: (events: Array<ServerPerformanceEvent>) => void
}

export interface BaseFactory extends Factory {
	updateDefaults(params: {
		[key: string]: any
		msid?: never
		_msid?: never
		visitorId?: never
		_visitorId?: never
		siteMemberId?: never
		_siteMemberId?: never
		vsi?: never
		_av?: never
	}): this
}
