import { hashString } from '@wix/bi-logger-sanitizer'
import { ISessionManager } from 'feature-session-manager'
import { PiiParams } from './types'

export function resolveEventParams(params: Record<string, string> = {}, sessionManager: ISessionManager) {
	const paramKeys = Object.keys(params)

	const hashedParams = paramKeys.reduce((result: object, paramKey: string) => {
		const hashedParam = {
			[paramKey]: PiiParams[paramKey as PiiParams] ? hashString(params[paramKey]) : params[paramKey],
		}
		return { ...result, ...hashedParam }
	}, {})
	return {
		...hashedParams,
		visitorId: sessionManager.getVisitorId(),
	}
}
