import { withDependencies } from '@wix/thunderbolt-ioc'
import {
	DROPDOWN_MENU_COMPONENT_TYPE,
	EXPANDABLE_MENU_COMPONENT_TYPE,
	VERTICAL_MENUS_COMPONENTS_TYPES,
	STYLABLE_HORIZONTAL_MENU_TYPE,
} from './relevantComponentTypes'
import { IUrlHistoryManager, UrlHistoryManagerSymbol } from 'feature-router'
import { ComponentWillMount, ViewerComponent } from 'feature-components'

const currentHrefPropFactory = (
	componentTypes: Array<string>,
	propName: 'currentPageHref' | 'currentPrimaryPageHref'
) => (urlHistoryManager: IUrlHistoryManager): ComponentWillMount<ViewerComponent> => {
	return {
		componentTypes,
		componentWillMount: (component) => {
			const fullUrl = urlHistoryManager.getFullUrlWithoutQueryParams()
			component.updateProps({ [propName]: fullUrl })
		},
	}
}

export const VerticalMenus = withDependencies(
	[UrlHistoryManagerSymbol],
	currentHrefPropFactory([...VERTICAL_MENUS_COMPONENTS_TYPES, STYLABLE_HORIZONTAL_MENU_TYPE], 'currentPageHref')
)

export const ExpandableAndDropdownMenus = withDependencies(
	[UrlHistoryManagerSymbol],
	currentHrefPropFactory([EXPANDABLE_MENU_COMPONENT_TYPE, DROPDOWN_MENU_COMPONENT_TYPE], 'currentPrimaryPageHref')
)
