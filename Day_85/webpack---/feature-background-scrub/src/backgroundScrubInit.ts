import { withDependencies } from '@wix/thunderbolt-ioc'
import { IAppDidLoadPageHandler, ReducedMotionSymbol } from '@wix/thunderbolt-symbols'
import type { IBackgroundScrub } from './types'
import { BackgroundScrubSymbol } from './symbols'

const backgroundScrubInitFactory = (
	backgroundScrub: IBackgroundScrub,
	reducedMotion: boolean
): IAppDidLoadPageHandler => {
	return {
		async appDidLoadPage() {
			if (!reducedMotion) {
				await backgroundScrub.init()
			}
		},
	}
}

export const BackgroundScrubInit = withDependencies(
	[BackgroundScrubSymbol, ReducedMotionSymbol],
	backgroundScrubInitFactory
)
