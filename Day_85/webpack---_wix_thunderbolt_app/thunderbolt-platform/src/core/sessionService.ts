import _ from 'lodash'
import { BootstrapData } from '../types'
import { SessionServiceAPI, OnInstanceChangedCallback, METASITE_APP_DEF_ID } from '@wix/thunderbolt-symbols'
import { DATA_BINDING_APP_DEF_ID } from './modules/clientSpecMapApi'

const WIX_CODE_APP_DEF_ID = '675bbcef-18d8-41f5-800e-131ec9e08762'

export default function ({
	platformEnvData,
	handlers,
	onPageWillUnmount,
}: {
	platformEnvData: BootstrapData['platformEnvData']
	handlers: any
	onPageWillUnmount: (cb: Function) => void
}): SessionServiceAPI {
	const isRunningInDifferentSiteContext = platformEnvData.isRunningInDifferentSiteContext
	const _onInstanceChangedCallbacks: { [appDefinitionId: string]: Array<OnInstanceChangedCallback> } = {}
	const fireOnInstanceChanged = (appDefinitionId: string, instance: string): void => {
		_onInstanceChangedCallbacks[appDefinitionId] && _.forEach(_onInstanceChangedCallbacks[appDefinitionId], (callback) => callback({ instance }))
	}

	let { siteMemberId: _siteMemberId, visitorId: _visitorId, svSession: _svSession, smToken: _smToken } = platformEnvData.session
	const _appDefIdToInstance = _.mapValues(platformEnvData.session.applicationsInstances, 'instance')

	// TODO onLoadSession() should be invoked once per site because the ClientSessionManager is bound on the site config
	// so the callbacks passed to onLoadSession() are stored on the site level state.
	handlers
		.addLoadNewSessionCallback(({ results: { instances, visitorId, siteMemberId, svSession, smToken } }: any) => {
			_siteMemberId = siteMemberId
			_visitorId = visitorId
			_svSession = svSession
			_smToken = smToken
			_.forEach(instances, (instance: string, appDefinitionId: string) => {
				_appDefIdToInstance[appDefinitionId] = instance
				fireOnInstanceChanged(appDefinitionId, instance)
			})
		})
		.then(onPageWillUnmount)

	const onInstanceChanged = (callback: OnInstanceChangedCallback, appDefinitionId: string): void => {
		if (!_onInstanceChangedCallbacks[appDefinitionId]) {
			_onInstanceChangedCallbacks[appDefinitionId] = []
		}
		_onInstanceChangedCallbacks[appDefinitionId].push(callback)
	}

	function getWixCodeInstance() {
		return _appDefIdToInstance[WIX_CODE_APP_DEF_ID]
	}

	const getInstance = (appDefinitionId: string): string => {
		let instance: string | undefined = appDefinitionId === DATA_BINDING_APP_DEF_ID ? _appDefIdToInstance[WIX_CODE_APP_DEF_ID] : _appDefIdToInstance[appDefinitionId]

		if (isRunningInDifferentSiteContext) {
			instance = instance || _appDefIdToInstance[METASITE_APP_DEF_ID]
		}

		return instance
	}

	const getSiteMemberId = () => _siteMemberId
	const getVisitorId = () => _visitorId
	const getUserSession = () => _svSession // svSession = site visitor session
	const getSmToken = () => _smToken

	const loadNewSession = () => handlers.loadNewSession()

	return {
		getInstance,
		getSiteMemberId,
		getVisitorId,
		getUserSession,
		getSmToken,
		onInstanceChanged,
		getWixCodeInstance,
		loadNewSession,
	}
}
