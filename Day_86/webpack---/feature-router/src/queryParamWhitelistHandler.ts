import { queryParamsWhitelist } from './queryParamsWhitelist'
import { withDependencies } from '@wix/thunderbolt-ioc'
import { IQueryParamsWhitelistHandler } from './types'

const queryParamsWhitelistFactory = (): IQueryParamsWhitelistHandler => {
	return {
		getWhitelist: () => queryParamsWhitelist,
	}
}

export const queryParamsWhitelistHandler = withDependencies([], queryParamsWhitelistFactory)
