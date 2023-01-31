import { createDeepProxy } from '../deepProxyUtils'
import type { BootstrapData } from '../types'
import type { InvokeViewerHandler, IViewerHandlers } from './types'

export const ViewerHandlers = (invokeViewerHandler: InvokeViewerHandler, bootstrapData: BootstrapData): IViewerHandlers => {
	const createViewerHandlers = (pageId: string) => createDeepProxy((path: Array<string>) => (...args: Array<never>) => invokeViewerHandler(pageId, path, ...args))
	const currentPageViewerHandlers = createViewerHandlers(bootstrapData.currentPageId) as any

	return {
		createViewerHandlers,
		viewerHandlers: currentPageViewerHandlers,
	}
}
