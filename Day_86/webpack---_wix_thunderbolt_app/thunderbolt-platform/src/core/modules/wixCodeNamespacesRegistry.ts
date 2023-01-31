import { WixCodeApi, IWixCodeNamespacesRegistry } from '@wix/thunderbolt-symbols'
import { WIX_CODE_NAMESPACES_REGISTRY } from './moduleNames'

const WixCodeNamespacesRegistry = (): IWixCodeNamespacesRegistry => {
	const wixCodeNamespaces: { [appDefinitionId: string]: WixCodeApi } = {}

	return {
		get(namespace, appDefinitionId) {
			if (!wixCodeNamespaces[appDefinitionId][namespace]) {
				throw new Error(`get(${namespace}) cannot be used inside the factory function of the namespace`)
			}
			return wixCodeNamespaces[appDefinitionId][namespace]
		},
		registerWixCodeNamespaces(namespaces, appDefinitionId) {
			wixCodeNamespaces[appDefinitionId] = namespaces
		},
	}
}

export default {
	factory: WixCodeNamespacesRegistry,
	deps: [],
	name: WIX_CODE_NAMESPACES_REGISTRY,
}
