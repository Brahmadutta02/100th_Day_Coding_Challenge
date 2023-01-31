import { IConsentPolicy } from 'feature-consent-policy'
import { IUrlHistoryManager } from 'feature-router'
import { UTM_PARAMS_LOCAL_STORAGE_KEY, BI_FIELD_CHAR_LIMIT } from './constants'
import { UtmKeys, UtmParams, UtmLocalStorageItem, BiUtmParams } from './types'
import { isUserConsentProvided } from './utils'

export function storeUtmParams(urlHistoryManager: IUrlHistoryManager, consentPolicy: IConsentPolicy): void {
	const { searchParams } = urlHistoryManager.getParsedUrl()
	if (!isUserConsentProvided(consentPolicy)) {
		localStorage.removeItem(UTM_PARAMS_LOCAL_STORAGE_KEY)
		return
	}
	if (!searchParams.get(UtmKeys.utmSource)) {
		return
	}
	const utmParams: UtmParams = Object.values(UtmKeys).reduce((result: UtmParams, key: UtmKeys) => {
		const param = searchParams.get(key)
		param && (result[key] = param)
		return result
	}, {})
	const itemToStore: UtmLocalStorageItem = {
		date: new Date().toISOString(),
		...utmParams,
	}
	try {
		const storedParams = localStorage.getItem(UTM_PARAMS_LOCAL_STORAGE_KEY)
		const parsedParams = JSON.parse(storedParams || '[]')
		const recentParams: Array<UtmLocalStorageItem> = (parsedParams || []).filter(isInLast30Days)
		recentParams.unshift(itemToStore)
		localStorage.setItem(UTM_PARAMS_LOCAL_STORAGE_KEY, JSON.stringify(recentParams))
	} catch (e) {
		console.warn('failed to store utm params', e)
	}
}

export function getUtmParams(): BiUtmParams | void {
	let storedParams: string, parsedParams: Array<UtmLocalStorageItem>
	try {
		storedParams = localStorage.getItem(UTM_PARAMS_LOCAL_STORAGE_KEY) || '[]'
		parsedParams = JSON.parse(storedParams)
	} catch (e) {
		console.warn('failed to get utm params', e)
		return
	}
	if (!parsedParams?.length) {
		return
	}
	while (JSON.stringify(parsedParams).length > BI_FIELD_CHAR_LIMIT) {
		parsedParams.pop()
	}
	return {
		utmParams: parsedParams,
		isTrimmed: storedParams.length > BI_FIELD_CHAR_LIMIT,
	}
}

function isInLast30Days(item: UtmLocalStorageItem): boolean {
	const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000
	const thirtyDaysAgo = new Date().getTime() - THIRTY_DAYS_IN_MS
	return new Date(item.date).getTime() > thirtyDaysAgo
}
