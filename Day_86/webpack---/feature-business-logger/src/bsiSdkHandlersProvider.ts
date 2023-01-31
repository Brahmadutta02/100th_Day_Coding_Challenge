import { withDependencies } from '@wix/thunderbolt-ioc'
import { BsiManagerSymbol } from './symbols'
import type { IBsiManager } from './types'

// This handler is for report that activity (bi report) was made in the worker in order to extend bsi
export const bsiSdkHandlersProvider = withDependencies([BsiManagerSymbol], (bsiManager: IBsiManager) => {
	return {
		getSdkHandlers: () => ({
			reportActivity: bsiManager.reportActivity,
		}),
	}
})
