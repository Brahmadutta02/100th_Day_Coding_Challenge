const TYPES = {
	CONNECTION: 1,
	SUBSCRIBE: 2,
	BAD_INPUT: 3,
}

export const errors = {
	CONNECTION_ERROR: {
		errorCode: TYPES.CONNECTION,
		message: 'connection error',
	},
	SUBSCRIBE_FAIL: { errorCode: TYPES.SUBSCRIBE, message: 'subscribe failed' },
	RESUBSCRIBE_ERROR: {
		errorCode: TYPES.SUBSCRIBE,
		message: 'resubscribe error',
	},
	CHANNEL_TOO_LONG: {
		errorCode: TYPES.BAD_INPUT,
		message: 'The combined values of the channel name and resourceId cannot exceed 140 characters.',
	},
	CHANNEL_NAME_STRING: {
		errorCode: TYPES.BAD_INPUT,
		message: 'channel.name must be a string',
	},
	RESOURCE_ID_STRING: {
		errorCode: TYPES.BAD_INPUT,
		message: 'channel.resourceId must be a string',
	},
	HANDLER_FUNCTION: {
		errorCode: TYPES.BAD_INPUT,
		message: 'handler must be a function',
	},
	CHANNEL_NAME_REQUIRED: {
		errorCode: TYPES.BAD_INPUT,
		message: 'channel.name is required',
	},
	HANDLER_REQUIRED: {
		errorCode: TYPES.BAD_INPUT,
		message: 'handler is required',
	},
	CHANNEL_REQUIRED: {
		errorCode: TYPES.BAD_INPUT,
		message: 'channel object is required',
	},
	CALLBACK_REQUIRED: {
		errorCode: TYPES.BAD_INPUT,
		message: 'callback function is required',
	},
	CALLBACK_FUNCTION: {
		errorCode: TYPES.BAD_INPUT,
		message: 'callback must be a function',
	},
	CHANNEL_DOES_NOT_MATCH: {
		errorCode: TYPES.BAD_INPUT,
		message: 'channel does not match subscriptionId',
	},
	CHANNEL_OR_SUBSCRIPTIONID_REQUIRED: {
		errorCode: TYPES.BAD_INPUT,
		message: 'channel or subscriptionId is required',
	},
	SUBSCRIPTION_ID_STRING: {
		errorCode: TYPES.BAD_INPUT,
		message: 'subscriptionId must be a string',
	},
}
