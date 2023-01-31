import _ from 'lodash'
import { withDependencies, named } from '@wix/thunderbolt-ioc'
import { FeatureStateSymbol, IPageDidMountHandler, PageFeatureConfigSymbol } from '@wix/thunderbolt-symbols'
import { IFeatureState } from 'thunderbolt-feature-state'
import type {
	ITPAEventsListenerManager,
	TpaEventListener,
	TPAEventRegistryPredicate,
	TPAEventsRegistry,
	TPAEventArgs,
	TpaPageConfig,
} from './types'
import { name } from './symbols'
import { SessionManagerSymbol, ISessionManager } from 'feature-session-manager'

const EventNames = {
	STATE_CHANGED: 'STATE_CHANGED',
	INSTANCE_CHANGED: 'INSTANCE_CHANGED',
	PAGE_NAVIGATION: 'PAGE_NAVIGATION',
	MEMBER_DETAILS_UPDATED: 'MEMBER_DETAILS_UPDATED',
	CONSENT_POLICY_UPDATE: 'CONSENT_POLICY_UPDATE',
	SCROLL: 'SCROLL',
	QUICK_ACTION_TRIGGERED: 'QUICK_ACTION_TRIGGERED',
	COMMON_CONFIG_UPDATE: 'COMMON_CONFIG_UPDATE',
}

const isEventSupported = (eventName: string) => eventName in EventNames

const buildPredicate = (predicateObj: TPAEventRegistryPredicate) => {
	return _.isFunction(predicateObj)
		? predicateObj
		: (args: any) => {
				const [key] = Object.keys(predicateObj)
				return args[key] === (predicateObj as any)[key]
		  }
}

const initFeatureState = (featureState: IFeatureState<TPAEventsRegistry>) => {
	featureState.update((currentState) =>
		_.merge({}, currentState, {
			registry: {},
		})
	)
}

export type EventName = keyof typeof EventNames

export const TpaEventsListenerManager = withDependencies(
	[named(FeatureStateSymbol, name), named(PageFeatureConfigSymbol, name), SessionManagerSymbol],
	(
		featureState: IFeatureState<TPAEventsRegistry>,
		pageConfig: TpaPageConfig,
		sessionManager: ISessionManager
	): IPageDidMountHandler & ITPAEventsListenerManager => {
		const dispatch = (
			event: EventName,
			getData: (args: TPAEventArgs) => any,
			predicate: TPAEventRegistryPredicate = () => true
		) => {
			_.forEach(featureState.get().registry[event], (item, compId) => {
				if (!item) {
					return
				}
				const { listener, ...metadata } = item
				const shouldDispatch = buildPredicate(predicate)
				const args = { compId, ...metadata }
				if (shouldDispatch(args)) {
					listener(event, getData(args))
				}
			})
		}

		initFeatureState(featureState)

		return {
			pageDidMount() {
				return sessionManager.addLoadNewSessionCallback(({ results: { instances }, reason }) => {
					if (reason === 'expiry') {
						dispatch('INSTANCE_CHANGED', ({ appDefinitionId }) => ({
							instance: instances[appDefinitionId],
						}))
					}
				})
			},
			register(
				eventName: string,
				compId: string,
				listener: TpaEventListener,
				metadata: { widgetId: string; appDefinitionId: string }
			) {
				if (!isEventSupported(eventName)) {
					return
				}
				featureState.update((currentState) =>
					_.merge({}, currentState, {
						registry: {
							[eventName]: {
								[compId]: {
									...metadata,
									pageId: pageConfig.pageId,
									listener,
								},
							},
						},
					})
				)
			},
			unregister(eventName: string, compId: string) {
				featureState.update((currentState) =>
					_.set<TPAEventsRegistry>(currentState, ['registry', eventName, compId], null)
				)
			},
			dispatch,
		}
	}
)
