import { named, withDependencies } from '@wix/thunderbolt-ioc'
import {
	TpaHandlerProvider,
	ViewerModelSym,
	ViewerModel,
	BrowserWindowSymbol,
	BrowserWindow,
	IFetchApi,
	Fetch,
	SiteFeatureConfigSymbol,
} from '@wix/thunderbolt-symbols'
import { SessionManagerSymbol, ISessionManager } from 'feature-session-manager'
import { TpaCommonsSiteConfig, name as tpaCommonsName } from 'feature-tpa-commons'
import { withViewModeRestriction } from '@wix/thunderbolt-commons'

export type MessageData = {
	type: string
	contactUpdate: Record<string, any>
	details: Record<string, any>
	info: Record<string, any>
}

export type HandlerResponse = Promise<
	| {
			status: boolean
			response: {
				status: number
				statusText: string
				responseText: any
			}
	  }
	| {
			status: boolean
			response: {
				activityId: any
				contactId: any
			}
	  }
>

type Activity = { params: Record<string, string | undefined>; payload: Record<string, any> }

const createReporter = (fetchApi: IFetchApi, baseUrl: string) => (activity: Activity) => {
	const url = new URL(baseUrl)
	Object.entries(activity.params).forEach(([k, v]) => {
		if (v) {
			url.searchParams.append(k, v)
		}
	})
	return fetchApi.envFetch(url.href, {
		method: 'POST',
		body: JSON.stringify(activity.payload),
		headers: {
			'Content-Type': 'application/json',
		},
	})
}

export const PostActivityHandler = withDependencies(
	[ViewerModelSym, named(SiteFeatureConfigSymbol, tpaCommonsName), SessionManagerSymbol, BrowserWindowSymbol, Fetch],
	(
		viewerModel: ViewerModel,
		{ externalBaseUrl }: TpaCommonsSiteConfig,
		sessionManager: ISessionManager,
		browserWindow: BrowserWindow,
		fetchApi: IFetchApi
	): TpaHandlerProvider => {
		const getActivityParams = (extras: Record<string, any>) => ({
			hs: sessionManager.getHubSecurityToken(),
			'activity-id': 'xxxxxxxx'.replace(/x/g, () => ((Math.random() * 16) | 0).toString(16)),
			'metasite-id': viewerModel.site.metaSiteId,
			svSession: sessionManager.getUserSession(),
			version: '1.0.0',
			...extras,
		})
		const getActivityPayload = (extras: Record<string, any>) => ({
			activityDetails: {
				additionalInfoUrl: null,
				summary: '',
			},
			activityInfo: 'activityInfo',
			activityType: 'activityType',
			contactUpdate: {},
			activityLocationUrl: browserWindow!.location.href,
			createdAt: new Date().toISOString(),
			...extras,
		})
		const report = createReporter(fetchApi, `${externalBaseUrl}/_api/app-integration-bus-web/v1/activities`)
		const reportActivity = async (activity: Activity) => {
			const response = await report(activity)
			if (!response.ok) {
				return {
					status: false,
					response: {
						status: response.status,
						statusText: response.statusText,
						responseText: await response.text(),
					},
				}
			}
			const { userSessionToken, activityId, contactId } = await response.json()
			if (userSessionToken) {
				sessionManager.setUserSession(userSessionToken)
			}
			return {
				status: true,
				response: {
					activityId,
					contactId,
				},
			}
		}
		return {
			getTpaHandlers() {
				return {
					postActivity: withViewModeRestriction(
						['site'],
						(
							compId,
							{ activity: activityInput }: { activity: MessageData },
							{ appDefinitionId }
						): HandlerResponse => {
							const activity = {
								params: getActivityParams({
									'application-id': appDefinitionId || 'TPA',
									instance: sessionManager.getAppInstanceByAppDefId(appDefinitionId),
								}),
								payload: getActivityPayload({
									contactUpdate: activityInput.contactUpdate || {},
									activityInfo: activityInput.info || {},
									activityType: activityInput.type || 'TPA',
									activityDetails: activityInput.details || {},
								}),
							}
							return reportActivity(activity)
						}
					),
				}
			},
		}
	}
)
