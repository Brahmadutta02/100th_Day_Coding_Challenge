import { withDependencies } from '@wix/thunderbolt-ioc'
import { IPageDidUnmountHandler } from '@wix/thunderbolt-symbols'
import type { IBackgroundScrub } from './types'
import { BackgroundScrubSymbol } from './symbols'

const backgroundScrubDestroyFactory = (backgroundScrub: IBackgroundScrub): IPageDidUnmountHandler => {
	return {
		async pageDidUnmount() {
			await backgroundScrub.destroy()
		},
	}
}

export const BackgroundScrubDestroy = withDependencies([BackgroundScrubSymbol], backgroundScrubDestroyFactory)
