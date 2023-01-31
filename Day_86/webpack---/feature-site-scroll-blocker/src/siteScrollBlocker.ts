import { isSSR } from '@wix/thunderbolt-commons'
import { named, withDependencies } from '@wix/thunderbolt-ioc'
import { BrowserWindow, BrowserWindowSymbol, FeatureExportsSymbol } from '@wix/thunderbolt-symbols'
import { IFeatureExportsStore } from 'thunderbolt-feature-exports'
import fastdom from 'fastdom'
import { ISiteScrollBlocker, IScrollBlockedListener } from './ISiteScrollBlocker'
import { name } from './index'

const siteScrollBlockerFactory = (
	window: BrowserWindow,
	siteScrollBlockerExports: IFeatureExportsStore<typeof name>
): ISiteScrollBlocker => {
	let lastBlockListenerId = 0
	const blockListeners = new Map<unknown, IScrollBlockedListener>()

	let blockers: Array<string> = []
	let _scrollCorrection = 0

	const restoreScrollPosition = () => {
		window!.scrollTo(0, _scrollCorrection)
	}

	const getSiteElements = () => ({
		bodyElement: window!.document.body as HTMLBodyElement,
	})

	const blockSiteScrolling = (blocker: string) => {
		const { bodyElement } = getSiteElements()
		const blockSiteScrollingClassName = 'blockSiteScrolling'

		fastdom.measure(() => {
			// The site should be blocked only when it's not already blocked
			if (!bodyElement.classList.contains(blockSiteScrollingClassName)) {
				_scrollCorrection = window!.scrollY

				bodyElement.style.setProperty(
					'--blocked-site-scroll-margin-top',
					`${Math.max(0.5, _scrollCorrection)}px`
				)
				bodyElement.classList.add(blockSiteScrollingClassName)
			}
		})

		blockListeners.forEach(({ handleBlockedBy }) => handleBlockedBy && handleBlockedBy(blocker))
	}

	const unblockSiteScrolling = (blocker: string) => {
		const { bodyElement } = getSiteElements()

		bodyElement.classList.remove('blockSiteScrolling')
		bodyElement.style.removeProperty('--blocked-site-scroll-margin-top')

		restoreScrollPosition()

		blockListeners.forEach(({ handleUnblockedBy }) => handleUnblockedBy && handleUnblockedBy(blocker))
	}

	const addBlocker = (blocker: string) => {
		blockers = !blockers.includes(blocker) ? [...blockers, blocker] : blockers

		// The site should be blocked only when there's one blocker,
		// otherwise it's already blocked (more than one) or doesn't need to be blocked (zero)
		const shouldBlock = blockers.length === 1

		if (shouldBlock) {
			blockSiteScrolling(blocker)
		}
	}

	const removeBlocker = (blocker: string) => {
		const [activeBlocker] = blockers
		blockers = blockers.filter((b) => b !== blocker)
		const [newActiveBlocker] = blockers

		// The active blocker changes if we remove the blockers not from the end to start.
		// For example, removing from start to end, the active blocker should be adjusted each time (because the first blocker changes)
		const hasActiveBlockerChanged = activeBlocker !== newActiveBlocker

		if (hasActiveBlockerChanged) {
			if (newActiveBlocker) {
				blockSiteScrolling(blocker)
			} else {
				unblockSiteScrolling(blocker)
			}
		}
	}

	const setSiteScrollingBlocked = (blocked: boolean, compId: string) => {
		if (isSSR(window)) {
			return
		}

		return blocked ? addBlocker(compId) : removeBlocker(compId)
	}

	siteScrollBlockerExports.export({ setSiteScrollingBlocked })

	return {
		setSiteScrollingBlocked,
		registerScrollBlockedListener(listener) {
			const listenerId = ++lastBlockListenerId
			blockListeners.set(listenerId, listener)
			return listenerId
		},
		unRegisterScrollBlockedListener(listenerId) {
			blockListeners.delete(listenerId)
		},
		isScrollingBlocked: () => blockers.length > 0,
	}
}

export const SiteScrollBlocker = withDependencies(
	[BrowserWindowSymbol, named(FeatureExportsSymbol, name)],
	siteScrollBlockerFactory
)
