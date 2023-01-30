import { withDependencies, optional } from '@wix/thunderbolt-ioc'
import { TpaHandlerProvider } from '@wix/thunderbolt-symbols'
import { BsiManagerSymbol, IBsiManager } from 'feature-business-logger'

export const ReportVisitorActivityHandler = withDependencies(
	[optional(BsiManagerSymbol)],
	(bsiManager?: IBsiManager): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				reportVisitorActivity: bsiManager ? bsiManager.reportActivity : () => {},
			}
		},
	})
)
