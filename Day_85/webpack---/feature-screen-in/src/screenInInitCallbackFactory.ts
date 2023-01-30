import {
	FeatureStateSymbol,
	PageFeatureConfigSymbol,
	ReducedMotionSymbol,
	BrowserWindowSymbol,
	CompsLifeCycleSym,
} from '@wix/thunderbolt-symbols'

import { withDependencies, named, optional } from '@wix/thunderbolt-ioc'
import type { IScreenInInitCallbackFactory } from './types'
import { Animations } from 'feature-animations'
import { ScreenInManager } from './ScreenInManager/ScreenInManager'
import { name } from './symbols'
import viewport from './viewport'
import { isSSR } from '@wix/thunderbolt-commons'

const screenInInitCallbackFactory: IScreenInInitCallbackFactory = (
	featureConfig,
	featureState,
	reducedMotion,
	browserWindow,
	compsLifeCycle,
	animationsProvider
) => () => {
	const { compIdToActions: actions, compIdToRotations: rotations } = featureConfig

	const unhideComponents = (compIds: Array<string>) =>
		compIds.forEach(async (compId) => {
			await compsLifeCycle.waitForComponentToRender(compId)
			ScreenInManager.prototype.unhideComponent(compId)
		})

	if (reducedMotion && !isSSR(browserWindow)) {
		unhideComponents(Object.keys(actions))
		return
	}
	if (!animationsProvider) {
		return
	}

	const screenInManagerPromise = animationsProvider.getInstance().then((animationsManager) => {
		const screenInManager = featureState.get()?.screenInManager ?? new ScreenInManager(animationsManager)
		screenInManager.init(actions)
		const animations = viewport({ manager: screenInManager })
		featureState.update((state) => ({ ...state, screenInManager, viewport: animations }))

		return { animations, screenInManager }
	})

	return async (compId: string, displayedId: string, dom: HTMLElement | null) => {
		if (!dom) {
			return
		}

		const { animations, screenInManager } = await screenInManagerPromise
		if (reducedMotion) {
			screenInManager.unhideComponent(compId)
			return
		}

		let compAnimation = actions[compId]

		if (displayedId !== compId) {
			const repeaterTemplateData = JSON.parse(JSON.stringify(compAnimation))
			repeaterTemplateData[0].targetId = displayedId
			compAnimation = repeaterTemplateData
		}

		screenInManager.addDefinition({ [displayedId]: compAnimation }, dom, rotations[compId])
		animations.start(displayedId, dom, compAnimation[0].name)
	}
}

export const ScreenInInitCallbackFactory = withDependencies(
	[
		named(PageFeatureConfigSymbol, name),
		named(FeatureStateSymbol, name),
		ReducedMotionSymbol,
		BrowserWindowSymbol,
		CompsLifeCycleSym,
		optional(Animations),
	],
	screenInInitCallbackFactory
)
