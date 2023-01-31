import { WixCodeApiFactoryArgs } from '@wix/thunderbolt-symbols'
import { CORVID_APP_DEF_ID } from './constants'

export class Environment {
	constructor(private registry: WixCodeApiFactoryArgs['wixCodeNamespacesRegistry']) {}

	isSSR() {
		return this.registry.get('window').rendering.env === 'backend'
	}

	isPreview() {
		return this.registry.get('window').viewMode.toLowerCase() === 'preview'
	}

	getInstance() {
		return this.registry.get('site').getAppToken(CORVID_APP_DEF_ID) as string
	}

	getSiteRevision() {
		return this.registry.get('site').revision
	}

	onLogin(cb: any) {
		return this.registry.get('user').onLogin(cb)
	}
}
