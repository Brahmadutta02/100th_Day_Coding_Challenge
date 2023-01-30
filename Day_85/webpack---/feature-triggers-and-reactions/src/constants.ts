import { StateReactionData } from '@wix/thunderbolt-becky-types'

export const TriggerTypeEventNameMapper: { [index: string]: string } = {
	click: 'onClick',
	tap: 'onClick',
	'mouse-in': 'onMouseEnter',
	'mouse-out': 'onMouseLeave',
}

export const ReverseStateReactionTypeMapper: { [index: string]: StateReactionData['type'] } = {
	AddState: 'RemoveState',
	RemoveState: 'AddState',
}
