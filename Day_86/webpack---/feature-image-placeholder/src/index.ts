import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { ServerImagePlaceholder } from './serverImagePlaceholder'
import { ComponentPropsExtenderSymbol } from 'feature-components'
import { createClientImagePlaceholder } from './clientImagePlaceholder'
import { LifeCycle } from '@wix/thunderbolt-symbols'

export const page: ContainerModuleLoader = (bind) => {
	if (process.env.browser) {
		const ClientImagePlaceholder = createClientImagePlaceholder(() => window.__imageClientApi__)
		bind(ComponentPropsExtenderSymbol, LifeCycle.PageWillMountHandler).to(ClientImagePlaceholder)
	} else {
		bind(ComponentPropsExtenderSymbol).to(ServerImagePlaceholder)
	}
}
