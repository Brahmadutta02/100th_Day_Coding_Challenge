import { withDependencies } from '@wix/thunderbolt-ioc'
import { BrowserWindow, BrowserWindowSymbol } from '@wix/thunderbolt-symbols'
import { isSSR } from '@wix/thunderbolt-commons'
import { IShouldNavigateHandler } from 'feature-router'

export const ShouldNavigateHandler = withDependencies(
	[BrowserWindowSymbol],
	(window: BrowserWindow): IShouldNavigateHandler => {
		return {
			shouldNavigate: () => {
				return !isSSR(window)
			},
		}
	}
)
