import { withDependencies } from '@wix/thunderbolt-ioc'
import { Experiments, ExperimentsSymbol, IPropsStore, Props } from '@wix/thunderbolt-symbols'
import { IUrlChangeHandler, IUrlHistoryManager, UrlHistoryManagerSymbol } from 'feature-router'
import { SiteMembersApiSymbol, ISiteMembersApi } from 'feature-site-members'
import { NavigationSymbol, INavigation } from 'feature-navigation'
import { ComponentWillMount, ViewerComponent } from 'feature-components'
import { resolveMemberDetails } from './resolveMemberDetails'

type UpdateComponentHandler = () => Promise<void>

type UpdateComponentPropsHandlersMap = { [key: string]: UpdateComponentHandler }

const initUpdateCompPropsHandlerStore = () => {
	const updateComponentPropsHandlers: UpdateComponentPropsHandlersMap = {}

	const registerHandler = (compId: string, handler: UpdateComponentHandler) => {
		updateComponentPropsHandlers[compId] = handler
	}

	const unregisterHandler = (compId: string) => delete updateComponentPropsHandlers[compId]

	const getAllHandlers = () => Object.values(updateComponentPropsHandlers)

	return { registerHandler, unregisterHandler, getAllHandlers }
}

const loginSocialBarFactory = (
	siteMembersApi: ISiteMembersApi,
	propsStore: IPropsStore,
	urlHistoryManager: IUrlHistoryManager,
	{ navigateTo }: INavigation,
	experiments: Experiments
): ComponentWillMount<ViewerComponent> & IUrlChangeHandler => {
	const updateCompPropsHandlerStore = initUpdateCompPropsHandlerStore()

	return {
		componentTypes: ['LoginSocialBar'],
		async componentWillMount(loginBarComp) {
			const updateComponentProps = async () => {
				const currentPrimaryPageHref = urlHistoryManager.getFullUrlWithoutQueryParams()
				const memberDetails = await resolveMemberDetails(siteMembersApi)

				propsStore.update({
					[loginBarComp.id]: {
						currentPrimaryPageHref,
						...memberDetails,
						onLogout() {
							siteMembersApi.logout()
						},
						onLogin() {
							siteMembersApi.promptLogin()
						},
						navigateTo,
					},
				})
			}
			const onLoginCallbackId = siteMembersApi.registerToUserLogin(updateComponentProps)
			const onMemberDetailsRefreshCallbackId = siteMembersApi.registerToMemberDetailsRefresh(updateComponentProps)

			updateCompPropsHandlerStore.registerHandler(loginBarComp.id, updateComponentProps)
			await updateComponentProps()

			return () => {
				siteMembersApi.unRegisterToUserLogin(onLoginCallbackId)
				siteMembersApi.unRegisterToMemberDetailsRefresh(onMemberDetailsRefreshCallbackId)
				updateCompPropsHandlerStore.unregisterHandler(loginBarComp.id)
			}
		},
		async onUrlChange() {
			if (experiments['specs.thunderbolt.loginSocialBarEnableUrlChangeListeners']) {
				const handlers = updateCompPropsHandlerStore.getAllHandlers()
				await Promise.all(handlers.map((handler) => handler()))
			}
		},
	}
}

export const LoginSocialBar = withDependencies(
	[SiteMembersApiSymbol, Props, UrlHistoryManagerSymbol, NavigationSymbol, ExperimentsSymbol],
	loginSocialBarFactory
)
