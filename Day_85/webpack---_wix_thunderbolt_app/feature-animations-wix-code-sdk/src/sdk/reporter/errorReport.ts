import _ from 'lodash'
import { logSdkError } from '@wix/thunderbolt-commons'

export const reportInvalidOptionsValue = (wrongProperty: any, key: string, compNickname: string) =>
	logSdkError(
		`The "animate()" function called on "${compNickname}" was called with the following invalid animationOptions ${wrongProperty}: "{${key}: ${wrongProperty}}".`
	)

export const reportInvalidKeys = (invalidKeys: Array<string>, compNickname: string) => {
	if (!_.isEmpty(invalidKeys)) {
		logSdkError(
			`The "animate()" function called on "${compNickname}" was called with the following invalid animationOptions keys: "${invalidKeys}".`
		)
	}
}

export const reportInvalidAnimationName = (animationName: string, compNickname: string) =>
	logSdkError(
		`The "animate()" function called on "${compNickname}" was called with the following invalid animation: "${animationName}".`
	)
