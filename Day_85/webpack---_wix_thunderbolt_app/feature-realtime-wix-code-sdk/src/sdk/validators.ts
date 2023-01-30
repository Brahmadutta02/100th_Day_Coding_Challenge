import { errors } from './errors'
import { Channel, MessageHandler, Error, UnsubscribeOptions } from './domain'
import _ from 'lodash'

export const validateUnsubscribe = function ({ channel, subscriptionId }: UnsubscribeOptions) {
	if (!channel && !subscriptionId) {
		return errors.CHANNEL_OR_SUBSCRIPTIONID_REQUIRED
	}

	if (channel) {
		if (!channel.name) {
			return errors.CHANNEL_NAME_REQUIRED
		}

		if (typeof channel.name !== 'string') {
			return errors.CHANNEL_NAME_STRING
		}

		if (channel.resourceId && typeof channel.resourceId !== 'string') {
			return errors.RESOURCE_ID_STRING
		}
	}

	if (subscriptionId && typeof subscriptionId !== 'string') {
		return errors.SUBSCRIPTION_ID_STRING
	}
}

export const validateSubscribe = (channel: Channel, handler: MessageHandler): Error | void => {
	if (!channel) {
		return errors.CHANNEL_REQUIRED
	}

	if (!channel.name) {
		return errors.CHANNEL_NAME_REQUIRED
	}

	if (typeof channel.name !== 'string') {
		return errors.CHANNEL_NAME_STRING
	}

	if (channel.resourceId && typeof channel.resourceId !== 'string') {
		return errors.RESOURCE_ID_STRING
	}

	if (
		(!channel.resourceId && channel.name.length > 140) ||
		(channel.resourceId && channel.name.length + channel.resourceId.length > 140)
	) {
		return errors.CHANNEL_TOO_LONG
	}

	if (!handler) {
		return errors.HANDLER_REQUIRED
	}

	if (!_.isFunction(handler)) {
		return errors.HANDLER_FUNCTION
	}
}

export const validateCallback = function (cb: any) {
	if (!cb) {
		return errors.CALLBACK_REQUIRED
	}

	if (!_.isFunction(cb)) {
		return errors.CALLBACK_FUNCTION
	}
}
