export interface IAppWillMountHandler {
	appWillMount: () => Promise<void> | void
}

export interface IAppWillLoadPageHandler {
	name: string
	appWillLoadPage: (pageInfo: { pageId: string; contextId: string }) => Promise<void> | void
}

export interface IAppWillRenderFirstPageHandler {
	appWillRenderFirstPage: (pageInfo: { pageId: string; contextId: string }) => Promise<void> | void
}

export interface IAppDidLoadPageHandler {
	appDidLoadPage: (pageInfo: { pageId: string; contextId: string }) => Promise<void> | void
}

export interface IPageWillMountHandler {
	name: string
	pageWillMount: (pageId: string) => Promise<void> | void
}

export interface IPageWillUnmountHandler {
	pageWillUnmount: (pageInfo: { pageId: string; contextId: string }) => Promise<void> | void
}

type IPageDidMountHandlerResult = IPageDidUnmountHandler['pageDidUnmount']
export interface IPageDidMountHandler {
	pageDidMount: (
		pageId: string
	) => IPageDidMountHandlerResult | Promise<IPageDidMountHandlerResult> | void | Promise<void>
}

export interface IPageDidUnmountHandler {
	pageDidUnmount: () => void
}

export interface IAppDidMountHandler {
	appDidMount: () => void
}

export interface IAppWillUnmountHandler {
	/**
	 * cleanup lifecycle - invoked before deleting thunderbolt container
	 * use for clearing side effects (e.g. event listeners)
	 * prevents memory leaks when creating and disposing multiple thunderbolt containers
	 * */
	appWillUnmount: () => Promise<void> | void
}

export const LifeCycle = {
	AppWillMountHandler: Symbol('AppWillMountHandler'),
	AppWillLoadPageHandler: Symbol('AppWillLoadPageHandler'),
	AppWillRenderFirstPageHandler: Symbol('AppWillRenderFirstPageHandler'),
	AppDidLoadPageHandler: Symbol('AppDidLoadPageHandler'),
	PageWillMountHandler: Symbol('PageWillMountHandler'),
	PageDidMountHandler: Symbol('PageDidMountHandler'),
	PageWillUnmountHandler: Symbol('PageWillUnmountHandler'),
	PageDidUnmountHandler: Symbol('PageDidUnmountHandler'),
	AppDidMountHandler: Symbol('AppDidMountHandler'),
	AppWillUnmountHandler: Symbol('AppWillUnmountHandler'),
}
