import _ from 'lodash'
import { logSdkError } from '@wix/thunderbolt-commons'
import { ContactInfo, ContactV1Info } from '../../types'

const TYPES = {
	NUMBER: 'number',
	STRING: 'string',
	ARRAY: 'array',
	STRING_ARRAY: 'string array',
	UUID_ARRAY: 'uuid array',
	BOOLEAN: 'boolean',
	OBJECT: 'object',
	UUID: 'uuid',
}
const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export const validateEmailContactParams = (emailId: any, contactTo: any, options?: any) => {
	const typeRules = [
		{ acceptNil: false, propertyName: 'emailId', value: emailId, expectedType: 'string' },
		{ acceptNil: false, propertyName: 'contactTo', value: contactTo, expectedType: 'uuid' },
		{ acceptNil: true, propertyName: 'options', value: options, expectedType: 'object' },
	]
	const errorSuffix =
		'For more information visit https://www.wix.com/velo/reference/wix-crm/triggeredemails-obj/emailcontact'
	let valid = validate(typeRules, errorSuffix)

	let processedOptions
	if (valid && options) {
		processedOptions = _.cloneDeep(options)
		const { variables } = options
		if (variables.constructor !== Object) {
			valid = false
			logSdkError('"variables" in options parameter must be an object.')
		}

		if (valid && variables) {
			for (const key in variables) {
				if (!Object.prototype.hasOwnProperty.call(variables, key)) {
					continue
				}
				const value = options.variables[key]
				if (typeof value === 'boolean' || typeof value === 'number') {
					processedOptions.variables[key] = value.toString()
				} else if (typeof value !== 'string' && !(value instanceof String)) {
					valid = false
					logSdkError(`variable "${key}" value must be string. ${errorSuffix}`)
				}
			}
		}
	}
	return {
		valid,
		processedOptions: valid && processedOptions,
	}
}

export function validateContactV1Info(contactInfo: ContactV1Info) {
	const { emails, phones, firstName, language, labels, lastName, emaillogin, picture } = contactInfo
	const typeRules = [
		{ acceptNil: true, propertyName: 'email', value: emails, expectedType: 'string array' },
		{ acceptNil: true, propertyName: 'phone', value: phones, expectedType: 'string array' },
		{ acceptNil: true, propertyName: 'label', value: labels, expectedType: 'string array' },
		{ acceptNil: true, propertyName: 'firstName', value: firstName, expectedType: 'string' },
		{ acceptNil: true, propertyName: 'lastName', value: lastName, expectedType: 'string' },
		{ acceptNil: true, propertyName: 'lastName', value: language, expectedType: 'string' },
		{ acceptNil: true, propertyName: 'emaillogin', value: emaillogin, expectedType: 'string' },
		{ acceptNil: true, propertyName: 'picture', value: picture, expectedType: 'string' },
	]
	return validate(typeRules)
}

export function validateContactInfo(contactInfo: ContactInfo) {
	const {
		name,
		company,
		jobTitle,
		locale,
		birthdate,
		picture,
		profilePicture,
		emails,
		phones,
		addresses,
		locations,
		labelKeys,
		extendedFields,
	} = contactInfo
	const typeRules = [
		{ acceptNil: true, propertyName: 'name', value: name, expectedType: 'object' },
		{ acceptNil: true, propertyName: 'name.first', value: name?.first, expectedType: 'string' },
		{ acceptNil: true, propertyName: 'name.last', value: name?.last, expectedType: 'string' },
		{ acceptNil: true, propertyName: 'company', value: company, expectedType: 'string' },
		{ acceptNil: true, propertyName: 'jobTitle', value: jobTitle, expectedType: 'string' },
		{ acceptNil: true, propertyName: 'locale', value: locale, expectedType: 'string' },
		{ acceptNil: true, propertyName: 'birthdate', value: birthdate, expectedType: 'string' },
		{ acceptNil: true, propertyName: 'profilePicture', value: profilePicture, expectedType: 'string' },
		{ acceptNil: true, propertyName: 'picture', value: picture, expectedType: 'object' },
		{ acceptNil: true, propertyName: 'picture.image', value: picture?.image, expectedType: 'string' },
		{
			acceptNil: true,
			propertyName: 'picture.imageProvider',
			value: picture?.imageProvider,
			expectedType: 'string',
		},
		{ acceptNil: true, propertyName: 'labelKeys', value: labelKeys, expectedType: 'string array' },
		{ acceptNil: true, propertyName: 'locations', value: locations, expectedType: 'uuid array' },
		{ acceptNil: true, propertyName: 'extendedFields', value: extendedFields, expectedType: 'object' },
	]
	const arraysValidations = [
		{
			propertyName: 'emails',
			value: emails,
			forEachItemValidation: (email) => {
				const innerTypeRules = [
					{ acceptNil: true, propertyName: 'email tag', value: email?.tag, expectedType: 'string' },
					{ acceptNil: false, propertyName: 'email', value: email?.email, expectedType: 'string' },
					{ acceptNil: true, propertyName: 'email primary', value: email?.primary, expectedType: 'boolean' },
				]
				return validate(innerTypeRules)
			},
		},
		{
			propertyName: 'phones',
			value: phones,
			forEachItemValidation: (phone) => {
				const innerTypeRules = [
					{ acceptNil: true, propertyName: 'phone tag', value: phone?.tag, expectedType: 'string' },
					{
						acceptNil: true,
						propertyName: 'phone countryCode',
						value: phone?.countryCode,
						expectedType: 'string',
					},
					{ acceptNil: true, propertyName: 'phone', value: phone?.phone, expectedType: 'string' },
					{ acceptNil: true, propertyName: 'phone primary', value: phone?.primary, expectedType: 'boolean' },
				]
				return validate(innerTypeRules)
			},
		},
		{
			propertyName: 'addresses',
			value: addresses,
			forEachItemValidation: (address) => {
				const innerTypeRules = [
					{ acceptNil: true, propertyName: 'address tag', value: address?.tag, expectedType: 'string' },
					{ acceptNil: true, propertyName: 'address', value: address?.address, expectedType: 'object' },
				]
				return validate(innerTypeRules)
			},
		},
	]
	const arraysValidationsValid = arraysValidations
		.map((arrayTypeRules) => validateArray(arrayTypeRules))
		.every((valid) => valid)
	return validate(typeRules) && arraysValidationsValid
}

const validate = (typeRules, errorSuffix = '') => {
	let valid = true
	typeRules.forEach(({ propertyName, value, expectedType, acceptNil }) => {
		if (!validateByType({ value, expectedType, acceptNil })) {
			valid = false
			logSdkError(typeError(propertyName, expectedType, errorSuffix))
		}
	})
	return valid
}

const validateArray = ({ propertyName, value, forEachItemValidation }) => {
	if (!value) {
		return true
	}

	let valid = true
	if (validate([{ propertyName, value, expectedType: 'array', acceptNil: true }])) {
		value.forEach((item) => {
			if (
				validate([
					{ propertyName: `${propertyName} item`, value: item, expectedType: 'object', acceptNil: false },
				])
			) {
				if (!forEachItemValidation(item)) {
					valid = false
				}
			} else {
				valid = false
			}
		})
	} else {
		valid = false
	}
	return valid
}

const validateByType = ({ value, expectedType, acceptNil }) => {
	if (_.isNil(value) && acceptNil) {
		return true
	}
	switch (expectedType) {
		case TYPES.NUMBER:
			return _.isNumber(value) && !_.isNaN(value)
		case TYPES.STRING:
			return _.isString(value)
		case TYPES.ARRAY:
			return _.isArray(value)
		case TYPES.STRING_ARRAY:
			return _.isArray(value) && _.every(value, (val) => _.isString(val))
		case TYPES.UUID_ARRAY:
			return _.isArray(value) && _.every(value, (val) => uuidV4Regex.test(val))
		case TYPES.BOOLEAN:
			return _.isBoolean(value)
		case TYPES.OBJECT:
			return _.isObject(value) && !_.isArray(value) && !_.isFunction(value)
		case TYPES.UUID:
			return uuidV4Regex.test(value)

		default:
			return true
	}
}

export const typeError = (propertyName, expectedType, errorSuffix) =>
	`variable "${propertyName}" value must be ${expectedType}. ${errorSuffix}`
