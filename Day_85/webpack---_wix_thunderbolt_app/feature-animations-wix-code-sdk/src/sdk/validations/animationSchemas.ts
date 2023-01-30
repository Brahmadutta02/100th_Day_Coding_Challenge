import _ from 'lodash'

const relativeNumberPattern = /^[+-]=\d+$/

export const EASING_MAP: Record<string, string> = {
	easeInSine: 'Sine.easeIn',
	easeInQuad: 'Quad.easeIn',
	easeInCubic: 'Cubic.easeIn',
	easeInQuart: 'Quart.easeIn',
	easeInQuint: 'Quint.easeIn',
	easeInExpo: 'Expo.easeIn',
	easeInCirc: 'Circ.easeIn',
	easeInBack: 'Back.easeIn',
	easeInElastic: 'Elastic.easeIn',
	easeInBounce: 'Bounce.easeIn',

	easeOutSine: 'Sine.easeOut',
	easeOutQuad: 'Quad.easeOut',
	easeOutCubic: 'Cubic.easeOut',
	easeOutQuart: 'Quart.easeOut',
	easeOutQuint: 'Quint.easeOut',
	easeOutExpo: 'Expo.easeOut',
	easeOutCirc: 'Circ.easeOut',
	easeOutBack: 'Back.easeOut',
	easeOutElastic: 'Elastic.easeOut',
	easeOutBounce: 'Bounce.easeOut',

	easeInOutSine: 'Sine.easeInOut',
	easeInOutQuad: 'Quad.easeInOut',
	easeInOutCubic: 'Cubic.easeInOut',
	easeInOutQuart: 'Quart.easeInOut',
	easeInOutQuint: 'Quint.easeInOut',
	easeInOutExpo: 'Expo.easeInOut',
	easeInOutCirc: 'Circ.easeInOut',
	easeInOutBack: 'Back.easeInOut',
	easeInOutElastic: 'Elastic.easeInOut',
	easeInOutBounce: 'Bounce.easeInOut',

	easeLinear: 'Linear.easeNone',
}

const EASING_NAMES = _.keys(EASING_MAP)

export const animationOptionsMappings = {
	keys: {
		easing: 'ease',
		opacity: 'to.autoAlpha',
		x: 'to.x',
		y: 'to.y',
		degree: 'to.rotation',
		rotate: 'to.rotation',
		scaleX: 'to.scaleX',
		scaleY: 'to.scaleY',
		scale: 'to.scale',
		direction: 'to.direction',
		rotateDirection: 'to.direction',
	},
	values: {
		duration: {
			convertMsToSecs: true,
		},
		delay: {
			convertMsToSecs: true,
		},
		offset: {
			convertMsToSecs: true,
		},
		repeatDelay: {
			convertMsToSecs: true,
		},
	},
}

const animationDataSchemas = {
	timeline: {
		default: {
			repeat: 0,
			repeatDelay: 0,
			yoyo: false,
		},
		validations: {
			repeat: {
				type: 'integer',
				range: {
					minValue: -1,
				},
			},
			repeatDelay: {
				type: 'number',
				range: {
					minValue: 0,
				},
			},
			yoyo: {
				type: 'boolean',
			},
		},
	},

	timelineAnimation: {
		validations: {
			duration: {
				type: 'number',
				range: {
					minValue: 0,
				},
			},
			delay: {
				type: 'number',
				range: {
					minValue: 0,
				},
			},
			offset: {
				oneOf: [
					{
						type: 'number',
						range: {
							minValue: 0,
						},
					},
					{
						type: 'string',
						pattern: relativeNumberPattern,
					},
				],
			},
			opacity: {
				type: 'number',
				range: {
					minValue: 0,
					maxValue: 1,
				},
			},
			x: {
				oneOf: [
					{
						type: 'number',
					},
					{
						type: 'string',
						pattern: relativeNumberPattern,
					},
				],
			},
			y: {
				oneOf: [
					{
						type: 'number',
					},
					{
						type: 'string',
						pattern: relativeNumberPattern,
					},
				],
			},
			rotate: {
				oneOf: [
					{
						type: 'number',
					},
					{
						type: 'string',
						pattern: relativeNumberPattern,
					},
				],
			},
			rotateDirection: {
				type: 'string',
				enum: ['cw', 'ccw'],
			},
			scaleX: {
				type: 'number',
				range: {
					minValue: 0,
				},
			},
			scaleY: {
				type: 'number',
				range: {
					minValue: 0,
				},
			},
			scale: {
				type: 'number',
				range: {
					minValue: 0,
				},
			},
			easing: {
				type: 'string',
				enum: EASING_NAMES,
			},
		},
	},
}

export function getSchemaOfAnimation(animationType: string) {
	return _.get(animationDataSchemas, animationType)
}
