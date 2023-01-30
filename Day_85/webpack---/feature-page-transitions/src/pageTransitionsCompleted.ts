import { IPageTransitionsCompleted } from './IPageTransitionsCompleted'
import type { pageTransitionsCompletedListener } from './types'
import { withDependencies } from '@wix/thunderbolt-ioc'

const pageTransitionsCompleted = (): IPageTransitionsCompleted => {
	let listeners: Array<pageTransitionsCompletedListener> = []

	return {
		onPageTransitionsCompleted: (listener: pageTransitionsCompletedListener) => {
			listeners.push(listener)
		},

		notifyPageTransitionsCompleted: (pageId: string) => {
			listeners.forEach((listener) => listener(pageId))
			listeners = []
		},
	}
}

export const PageTransitionsCompleted = withDependencies([], pageTransitionsCompleted)
