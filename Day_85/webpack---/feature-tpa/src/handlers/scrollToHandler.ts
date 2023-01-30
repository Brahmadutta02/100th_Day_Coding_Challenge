import { withDependencies, optional } from '@wix/thunderbolt-ioc'
import { BrowserWindowSymbol, BrowserWindow, TpaHandlerProvider } from '@wix/thunderbolt-symbols'
import { Animations, IAnimations } from 'feature-animations'

export type MessageData = {
	x: number
	y: number
	scrollAnimation?: boolean
}

export const ScrollToHandler = withDependencies(
	[BrowserWindowSymbol, optional(Animations)],
	(window: BrowserWindow, animations?: IAnimations): TpaHandlerProvider => ({
		getTpaHandlers() {
			return {
				async scrollTo(compId, { x, y, scrollAnimation }: MessageData) {
					if (!animations) {
						return
					}
					if (scrollAnimation) {
						const duration = 1
						const delay = 0
						const animationInstance = await animations.getInstance()
						animationInstance.runAnimationOnElements(
							'BaseScroll',
							[(window! as unknown) as HTMLElement],
							duration,
							delay,
							{
								y,
								x,
								callbacks: {
									onComplete: () => Promise.resolve(),
								},
							}
						)
					} else {
						window!.scrollTo(x, y)
					}
				},
			}
		},
	})
)
