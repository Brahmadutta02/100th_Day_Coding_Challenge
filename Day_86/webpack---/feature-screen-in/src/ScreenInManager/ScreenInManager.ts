/**
 * @typedef {Object} AnimationDefsMap
 * @property {CompAnimationDefs} <compId>
 *
 * @typedef {Object} CompAnimationDefs
 * @property {AnimationDef[]} <action>
 *
 * @typedef {Object} AnimationDef
 * @property {string} targetId
 * @property {string} action
 * @property {string} name
 * @property {number} duration
 * @property {number} delay
 * @property {Object} params
 *
 * @typedef {Object} TriggerDescriptor
 * @property {string} compId
 * @property {string} action
 */
import { Actions, AnimationDef, SessionState, TriggerType, Rotation } from '../types'
import { AnimatorManager } from 'feature-animations'

const CLEAR_PROPS = 'clip,clipPath,webkitClipPath,willChange,opacity,transform,transformOrigin'
const getStateId = (id: string) => `${id}-screenIn`

/**
 * @class AnimationManager
 */
export class ScreenInManager {
	private animator: AnimatorManager
	private definitions: Actions
	private sessionState: SessionState

	constructor(animationsManager: AnimatorManager) {
		this.animator = animationsManager
		/** @type AnimationDefsMap */
		this.definitions = {}
		/**
		 * State persistent across pages
		 * @type {{running: Map<TimelineMax, {id: string, action: string}>, played: Map<string, {playOnce: boolean, persistOnNav: boolean}>}}
		 */
		this.sessionState = {
			played: new Map(),
			running: new Map(),
		}
	}

	_shouldSkipPlayedAnimation(stateId: string) {
		const wasPlayedInSession = this.sessionState.played.has(stateId)
		const { playOnce, persistOnNav } = this.sessionState.played.get(stateId) || {}
		return wasPlayedInSession && (playOnce || persistOnNav)
	}

	_hideComponent(compId: string) {
		const element: any = document.querySelector(`#${compId}`)
		if (element) {
			element.style.opacity = 0
		}
	}

	unhideComponent(compId: string) {
		const element: any = document.querySelector(`#${compId}`)
		if (element) {
			element.dataset.screenInHide = 'done'
			element.style.opacity = ''
			element.style.visibility = 'inherit'
		}
	}

	_addAnimatingClass(targetId: string) {
		const el = document.getElementById(targetId)
		if (el) {
			el.classList.add('is-animating')
			el.dataset.screenInHide = 'done'
		}
	}

	_removeAnimatingClass(targetId: string) {
		const el = document.getElementById(targetId)
		if (el) {
			el.classList.remove('is-animating')
			el.dataset.screenInHide = 'done'
		}
	}

	/**
	 * Save a copy of all animation definitions
	 * @param {AnimationDefsMap} animationDefsMap
	 * {
	 *     [compId]: [{
	 *             targetId: compId,
	 *             name: 'FadeIn',
	 *             action: 'screenIn',
	 *             duration: 1,
	 *             delay: 0,
	 *             params: {...}
	 *         }, ...],
	 *     ...
	 *     ...
	 * }
	 */

	updateDefinitions(animationDefsMap: Actions) {
		this.definitions = { ...this.definitions, ...animationDefsMap }
	}

	_hideCompBeforeAnimation(compId: string) {
		const stateId = getStateId(compId)

		if (this._shouldSkipPlayedAnimation(stateId)) {
			this.unhideComponent(compId)
		} else {
			this._hideComponent(compId)
		}
	}

	/**
	 * Hide components that should be animated
	 */
	hideBeforeAnimation(animationDefs: Actions) {
		// Handle screen in hide on start
		const compsToHide = this.getCompsToHide(animationDefs)
		compsToHide.forEach(({ compId }) => {
			this._hideCompBeforeAnimation(compId)
		})
	}

	/**
	 * Add data-angle attr to component before animating to handle comp rotation
	 */
	handleRotation(el: HTMLElement, rotation: Rotation) {
		el.setAttribute('data-angle', String(rotation))
		el.setAttribute('data-angle-style-location', 'style')
	}

	/**
	 * Trigger screenIn on all trigger descriptors passed.
	 * @param {TriggerDescriptor[]} triggers
	 */
	trigger(triggers: Array<TriggerType> = []) {
		const animationDefs = triggers.reduce((acc: Array<any>, { compId }) => {
			const actionDefs: Array<AnimationDef> = this.definitions[compId] || []
			return acc.concat(actionDefs)
		}, [])
		animationDefs.forEach(({ action, ...animation }) => this.executeAnimation(action, animation))
	}

	init(animationDefs: Actions) {
		this.updateDefinitions(animationDefs)
		this.stopAnimations()

		this.hideBeforeAnimation(animationDefs)
	}

	addDefinition(animationDef: Actions, compElement: HTMLElement, compRotation: Rotation) {
		this.handleRotation(compElement, compRotation)
		this.updateDefinitions(animationDef)
	}
	/**
	 * Run an animation by action defs, each action has different pre-requisites and post-requisites
	 * trying only screenIn now
	 * @param action
	 * @param name
	 * @param targetId
	 * @param pageId
	 * @param duration
	 * @param playOnce
	 * @param persistOnNav
	 * @param delay
	 * @param params
	 */
	executeAnimation(
		action: string,
		{ name, targetId, duration = 0, delay = 0, playOnce = false, persistOnNav = false, params = {} }: AnimationDef
	) {
		const stateId = getStateId(targetId)
		// Skip if played in current page or played in current session and marked as play once
		if (this._shouldSkipPlayedAnimation(stateId)) {
			this.unhideComponent(targetId)
			return
		}

		const clearParams = { props: CLEAR_PROPS, immediateRender: false }
		const animationData = { name, targetId, duration, delay, params }
		const baseClearData = {
			name: 'BaseClear',
			targetId,
			duration: 0,
			delay: 0,
			params: clearParams,
		}

		this.animator.runSequence(
			[
				{ type: 'Animation', data: animationData },
				{ type: 'Animation', data: baseClearData },
			],
			{
				callbacks: {
					onStart: (instance: any) => {
						this._addAnimatingClass(targetId)
						this.sessionState.running.set(instance, { targetId, action })
					},
					onComplete: (instance: any) => {
						this._removeAnimatingClass(targetId)
						this.sessionState.running.delete(instance)
					},
					onInterrupt: (instance: any) => {
						this._removeAnimatingClass(targetId)
						this.sessionState.running.delete(instance)
					},
				},
			}
		)

		this.sessionState.played.set(stateId, { playOnce, persistOnNav })
	}

	/**
	 * kill all running screenIn animations
	 * @param {boolean} [skipPersistent=true] skip screenIn marked as persistent (like masterPage screenIn)
	 */
	stopAnimations({ skipPersistent = true }: { skipPersistent?: boolean } = {}) {
		this.sessionState.running.forEach(({ targetId }, animation) => {
			const stateId = getStateId(targetId)
			// If animation is marked as persistent (ie. master page)
			const isPersistentToSkip = skipPersistent && this.sessionState.played.get(stateId).persistOnNav
			if (!isPersistentToSkip) {
				this.animator.kill(animation, 1)
			}
		})
	}

	getAnimationProperties(animationName: string) {
		return this.animator.getAnimationProperties(animationName)
	}

	getCompsToHide(animationDefs: Actions): Array<{ compId: string }> {
		return Object.entries(animationDefs).reduce((acc: any, [compId, behaviors]) => {
			const hide = behaviors.some(({ name }) => {
				const animationProperties = this.animator.getAnimationProperties(name)
				return animationProperties && animationProperties.hideOnStart
			})
			if (hide) {
				acc.push({ compId })
			}

			return acc
		}, [])
	}

	clearState() {
		this.sessionState.played.clear()
		this.sessionState.running.clear()
	}
}
