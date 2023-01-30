import type { IModelsAPI } from '@wix/thunderbolt-symbols'
import type { IViewerHandlers } from '../types'
import type { IEffectsTriggerApi } from '../../types'
import { EFFECTS_TRIGGER_API, MODELS_API, VIEWER_HANDLERS } from './moduleNames'
import { getFullId, getTemplateFromInflatedId } from '@wix/thunderbolt-commons'

const blankApi = {
	getEffects: () => [],
	getActiveEffects: () => [],
	applyEffects: () => {},
	toggleEffects: () => {},
	removeEffects: () => {},
	removeAllEffects: () => {},
}

export const EffectsTriggerApiFactory = (modelsApi: IModelsAPI, { viewerHandlers: currentPageViewerHandlers, createViewerHandlers }: IViewerHandlers): IEffectsTriggerApi => {
	const activeEffectsMap = {} as { [compId: string]: Array<string> }

	const invalidateComponentEffects = (compId: string, effectNames: Array<string>) => {
		const _compId = getFullId(getTemplateFromInflatedId(compId)!)
		const availableEffects = new Set(modelsApi.getEffectsByCompId(_compId))
		return Array.from(new Set(effectNames)).filter((effect) => availableEffects.has(effect))
	}

	return {
		init() {
			if (modelsApi.isFeatureEnabledOnMasterPage('triggersAndReactions')) {
				const masterPageHandlers = createViewerHandlers('masterPage')
				masterPageHandlers.triggersAndReactions.registerToActiveEffectsChange((compId: string, list: Array<string>) => (activeEffectsMap[compId] = list))
			}
			if (modelsApi.isFeatureEnabledOnPage('triggersAndReactions')) {
				currentPageViewerHandlers.triggersAndReactions.registerToActiveEffectsChange((compId: string, list: Array<string>) => (activeEffectsMap[compId] = list))
			}
		},

		createCompTriggerAndReactionsApi: (compId: string) => {
			const pageId = modelsApi.getPageIdByCompId(compId)
			if (
				(pageId === 'masterPage' && !modelsApi.isFeatureEnabledOnMasterPage('triggersAndReactions')) ||
				(pageId !== 'masterPage' && !modelsApi.isFeatureEnabledOnPage('triggersAndReactions'))
			) {
				return blankApi
			}
			const handlers = createViewerHandlers(pageId)

			return {
				getEffects: () => modelsApi.getEffectsByCompId(compId),

				getActiveEffects: () => activeEffectsMap[compId] || [],

				applyEffects: (...effectNames: Array<string>) => {
					const effects = invalidateComponentEffects(compId, effectNames)
					activeEffectsMap[compId] = [...(activeEffectsMap[compId] || []), ...effects]
					handlers.triggersAndReactions.applyEffects(compId, effects)
				},

				removeEffects: (...effectNames: Array<string>) => {
					const effects = invalidateComponentEffects(compId, effectNames)
					activeEffectsMap[compId] = (activeEffectsMap[compId] || []).filter((effect) => !effects.includes(effect))
					handlers.triggersAndReactions.removeEffects(compId, effects)
				},

				toggleEffects: (...effectNames: Array<string>) => {
					const effects = invalidateComponentEffects(compId, effectNames)
					const currentEffects = activeEffectsMap[compId] || []
					activeEffectsMap[compId] = [...currentEffects.filter((effect) => !effects.includes(effect)), ...effects.filter((effect) => !currentEffects.includes(effect))]
					handlers.triggersAndReactions.toggleEffects(compId, effects)
				},

				removeAllEffects: () => {
					activeEffectsMap[compId] = []
					handlers.triggersAndReactions.removeAllEffects(compId)
				},
			}
		},
	}
}

export default {
	factory: EffectsTriggerApiFactory,
	deps: [MODELS_API, VIEWER_HANDLERS],
	name: EFFECTS_TRIGGER_API,
}
