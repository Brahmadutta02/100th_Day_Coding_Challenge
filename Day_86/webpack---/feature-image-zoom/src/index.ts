import { ContainerModuleLoader, named, withDependencies } from '@wix/thunderbolt-ioc'
import { ImageZoom } from './imageZoom'
import { LifeCycle, PageFeatureConfigSymbol, Props, StructureAPI } from '@wix/thunderbolt-symbols'
import { ImageZoomAPISymbol, name } from './symbols'
import { UrlChangeHandlerForPage, UrlHistoryManagerSymbol } from 'feature-router'
import { ImageZoomAPIImpl } from './imageZoomAPI'
import { NativeGalleriesWillMount, WPhotoWillMount } from './imageZoomWillMount'
import type { ImageZoomAPI } from './types'
import { SiteScrollBlockerSymbol } from 'feature-site-scroll-blocker'
import { ComponentWillMountSymbol } from 'feature-components'

export const page: ContainerModuleLoader = (bind) => {
	bind(ComponentWillMountSymbol).to(NativeGalleriesWillMount)
	bind(ComponentWillMountSymbol).to(WPhotoWillMount)
	bind(LifeCycle.PageDidMountHandler, LifeCycle.PageDidUnmountHandler, UrlChangeHandlerForPage).to(ImageZoom)
	bind(ImageZoomAPISymbol).to(
		withDependencies(
			[
				named(PageFeatureConfigSymbol, name),
				Props,
				StructureAPI,
				SiteScrollBlockerSymbol,
				UrlHistoryManagerSymbol,
			],
			ImageZoomAPIImpl
		)
	)
}

// Public Symbols
export { ImageZoomAPISymbol }

// Public Types
export { ImageZoomAPI }
