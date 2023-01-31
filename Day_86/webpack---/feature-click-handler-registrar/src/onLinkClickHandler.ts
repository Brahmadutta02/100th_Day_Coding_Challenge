import { multi, withDependencies } from '@wix/thunderbolt-ioc'
import { IOnLinkClickHandler } from './types'
import {
	Experiments,
	ExperimentsSymbol,
	ILinkClickHandler,
	LinkClickHandlerSymbol,
	NavigationClickHandlerSymbol,
	pageIdSym,
	SiteLinkClickHandlerSymbol,
} from '@wix/thunderbolt-symbols'

type HTMLElementTarget = HTMLElement | null
const getAnchorTarget = (event: MouseEvent) => {
	let eTarget = event.target as HTMLElementTarget

	while (eTarget && (!eTarget.tagName || eTarget.tagName.toLowerCase() !== 'a')) {
		eTarget = eTarget.parentNode as HTMLElementTarget
	}
	return eTarget
}

const onLinkClickHandler = (
	pageId: string,
	navigationHandler: ILinkClickHandler,
	siteLinkClickHandlers: Array<ILinkClickHandler>,
	pageLinkClickHandlers: Array<ILinkClickHandler>,
	experiments: Experiments
): IOnLinkClickHandler => {
	return {
		onLinkClick: (e: MouseEvent) => {
			if (e.metaKey || e.ctrlKey) {
				return
			}

			const anchorTarget = getAnchorTarget(e)

			if (anchorTarget && experiments['specs.thunderbolt.fullPageNavigation']) {
				return
			}

			if (!anchorTarget) {
				return
			}
			if (anchorTarget.getAttribute('data-cancel-link')) {
				return
			}

			const handlers =
				pageId === 'masterPage'
					? [...siteLinkClickHandlers, ...pageLinkClickHandlers]
					: [...pageLinkClickHandlers, navigationHandler]

			for (const handler of handlers) {
				const didHandle = handler.handleClick(anchorTarget)
				if (didHandle) {
					e.preventDefault()
					e.stopPropagation()
					return
				}
			}
		},
	}
}

export const OnLinkClickHandler = withDependencies(
	[
		pageIdSym,
		NavigationClickHandlerSymbol,
		multi(SiteLinkClickHandlerSymbol),
		multi(LinkClickHandlerSymbol),
		ExperimentsSymbol,
	],
	onLinkClickHandler
)
