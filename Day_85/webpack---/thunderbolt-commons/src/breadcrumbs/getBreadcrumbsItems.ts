import {
	BreadcrumbsProps,
	BreadcrumbsTrail,
	BreadcrumbsItemProps,
	BreadcrumbsClientTrail,
	BreadcrumbsClientItemProps,
} from '@wix/thunderbolt-components-native'
import type { MenuItemProps } from '@wix/thunderbolt-becky-types'

export interface IPagesInfo {
	pagesMenuItems: Array<MenuItemProps>
	isMobile: boolean
}

interface IRouteInfo {
	currentUrl: string
	currentPage: Record<string, any>
	homePageHref: string
}

const createShallowCopy = <T extends Record<string, any> | Array<any>>(target: T): T =>
	JSON.parse(JSON.stringify(target))

const startsWithHomepage = (trail: BreadcrumbsTrail, homePageHref: string): boolean =>
	Boolean(trail.length) && trail[0].link?.href === homePageHref

const endsWithCurrent = (trail: BreadcrumbsTrail, currentUrl: string): boolean =>
	Boolean(trail.length && (trail[trail.length - 1].link?.href === currentUrl || trail[trail.length - 1].isCurrent))

const getCurrentPageBreadcrumb = (pagesMenuItems: IPagesInfo['pagesMenuItems'], routeInfo: IRouteInfo) => {
	const { currentUrl, currentPage } = routeInfo

	const currentBreadcrumbItem = getMenuItemByHref(pagesMenuItems, currentUrl)

	const label = currentBreadcrumbItem?.label || currentPage?.title || currentPage?.name

	return label && { label, isCurrent: true }
}

const getMenuItemByHref = (pagesMenuItems: IPagesInfo['pagesMenuItems'], href: string): MenuItemProps | undefined => {
	for (const item of pagesMenuItems) {
		if (!item) {
			continue
		}

		if (item.link?.href === href) {
			return { ...item }
		}

		if (item.items?.length) {
			const result = getMenuItemByHref(item.items, href)

			if (result) {
				return result
			}
		}
	}
}

const getFullBreadcrumbsTrail = (
	trail: BreadcrumbsTrail,
	{ pagesMenuItems }: IPagesInfo,
	routeInfo: IRouteInfo,
	homePageHref: string,
	breadcrumbsCompProps: BreadcrumbsProps
) => {
	const { currentUrl } = routeInfo
	const { showHomePage, showCurrentPage } = breadcrumbsCompProps
	const homeBreadcrumb = getHomeBreadcrumb(pagesMenuItems, currentUrl, homePageHref, breadcrumbsCompProps)
	const currentPageBreadcrumb = getCurrentPageBreadcrumb(pagesMenuItems, routeInfo)

	if (showHomePage && homeBreadcrumb) {
		trail.unshift(homeBreadcrumb)
	}

	const shouldAddCurrentPage = showCurrentPage && !endsWithCurrent(trail, currentUrl)

	if (shouldAddCurrentPage && currentPageBreadcrumb) {
		trail.push(currentPageBreadcrumb)
	}

	return trail
}

const getHomeBreadcrumb = (
	pagesMenuItems: IPagesInfo['pagesMenuItems'],
	currentUrl: string,
	homePageHref: string,
	breadcrumbsCompProps: BreadcrumbsProps
): BreadcrumbsItemProps | undefined => {
	const { showHomePageAsIcon, svgString } = breadcrumbsCompProps
	const homeBreadcrumb: BreadcrumbsItemProps | undefined = getMenuItemByHref(pagesMenuItems, homePageHref)
	if (homeBreadcrumb) {
		if (currentUrl === homePageHref) {
			homeBreadcrumb.isCurrent = true
			delete homeBreadcrumb.link
		}
		if (showHomePageAsIcon) {
			homeBreadcrumb.icon = svgString
			// @ts-ignore
			delete homeBreadcrumb.label
		}
	}
	return homeBreadcrumb
}

const getPreviousPageOnlyTrail = (
	trail: BreadcrumbsTrail,
	{ pagesMenuItems }: IPagesInfo,
	{ currentUrl }: IRouteInfo,
	homePageHref: string,
	breadcrumbsCompProps: BreadcrumbsProps
) => {
	const findPreviousPage = (items: BreadcrumbsTrail): BreadcrumbsItemProps | undefined => {
		for (let i = items.length - 1; i >= 0; i--) {
			if (items[i].link?.href) {
				return items[i]
			}
		}
		// We need this one, because if there is no previous page in trail,
		// we will return home page from `pagesMenuItems`
		return getHomeBreadcrumb(pagesMenuItems, currentUrl, homePageHref, breadcrumbsCompProps)
	}

	const previousPageItem = trail.length
		? findPreviousPage(trail)
		: getHomeBreadcrumb(pagesMenuItems, currentUrl, homePageHref, breadcrumbsCompProps)

	return previousPageItem ? [previousPageItem] : []
}

const getBreadcrumbsTrail = (
	menuItems: BreadcrumbsTrail,
	routeInfo: IRouteInfo,
	res: BreadcrumbsTrail = []
): BreadcrumbsTrail => {
	for (const item of menuItems) {
		if (item.link?.href === routeInfo.currentUrl) {
			return [...res, item]
		} else if (item.items?.length) {
			const possibleTrail = getBreadcrumbsTrail(item.items, routeInfo, [...res, item])
			if (possibleTrail.length) {
				return possibleTrail
			}
		}
	}
	return []
}

const flattenBreadcrumbsLink = (trail: BreadcrumbsTrail): BreadcrumbsClientTrail =>
	trail.map(
		(item): BreadcrumbsClientItemProps => {
			const { link, ...itemWithoutLink } = item
			const flatLink = link?.href ? { link: link?.href } : {}
			return { ...itemWithoutLink, ...flatLink }
		}
	)

export const getBreadcrumbsItems = (
	routeInfo: IRouteInfo,
	breadcrumbsPageConfig: IPagesInfo,
	breadcrumbsProps: BreadcrumbsProps
) => {
	const { currentUrl, homePageHref } = routeInfo
	/**
	 * Further, we will mutate data in order to build breadcrumbs,
	 * so we make shallow copies just not to break shared stuff
	 */
	const clonedPageConfig = createShallowCopy(breadcrumbsPageConfig)

	const { pagesMenuItems } = clonedPageConfig

	const { showOnlyPreviousPageOnMobile } = breadcrumbsProps

	const trail = getBreadcrumbsTrail(pagesMenuItems, routeInfo)
	// home will be taken from the pages menu if necessary
	if (startsWithHomepage(trail, homePageHref)) {
		trail.shift()
	}
	// current page will be taken from the pages menu if necessary
	if (endsWithCurrent(trail, currentUrl)) {
		trail.pop()
	}
	const getBreadcrumbs = showOnlyPreviousPageOnMobile ? getPreviousPageOnlyTrail : getFullBreadcrumbsTrail
	const breadcrumbs = getBreadcrumbs(trail, clonedPageConfig, routeInfo, homePageHref, breadcrumbsProps)

	return flattenBreadcrumbsLink(breadcrumbs)
}
