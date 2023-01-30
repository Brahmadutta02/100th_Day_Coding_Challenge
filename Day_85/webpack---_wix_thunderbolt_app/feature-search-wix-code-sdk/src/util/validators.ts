import { WixSearchValidation } from '../types'

const assertFailures = (validations: Array<WixSearchValidation>): void => {
	const failedMessages = validations.filter((entry) => !entry.check).map((entry) => entry.message)

	if (failedMessages.length > 0) {
		throw new Error(`Validation failures: ${failedMessages.join(', ')}.`)
	}
}

export const validateCollectionName = (documentType: string): void => {
	const validations = [
		{
			check: typeof documentType === 'string',
			message: 'documentType must be in string format',
		},
		{
			check: typeof documentType === 'string' && documentType.includes('/'),
			message: 'documentType must include /',
		},
	]

	assertFailures(validations)
}

export const validateLanguage = (language: string): void => {
	const validations = [
		{
			check: typeof language === 'string',
			message: 'language must be in string format',
		},
		{
			check: language.length === 2,
			message: 'language must adhere to ISO639-1 format',
		},
	]

	assertFailures(validations)
}

export const validateSkip = (skip: number): void => {
	const validations = [
		{
			check: typeof skip === 'number',
			message: 'skip must be in number format',
		},
		{
			check: skip >= 0,
			message: 'skip must be a positive number',
		},
		{
			check: skip <= 100000,
			message: 'skip must be below or equal to 100000',
		},
	]

	assertFailures(validations)
}

export const validateFuzzy = (fuzzy: boolean): void => {
	const validations = [
		{
			check: typeof fuzzy === 'boolean',
			message: 'fuzzy must be in boolean format',
		},
	]

	assertFailures(validations)
}

export const validateLimit = (limit: number): void => {
	const validations = [
		{
			check: typeof limit === 'number',
			message: 'limit must be in number format',
		},
		{
			check: limit >= 0,
			message: 'limit must be a positive number',
		},
		{
			check: limit <= 1000,
			message: 'limit must be below or equal to 1000',
		},
	]

	assertFailures(validations)
}

export const validateFacets = (clauses: Array<string>): void => {
	const validations = [
		{
			check: clauses.filter((clause) => typeof clause !== 'string').length === 0,
			message: 'clauses for facets must be string values',
		},
		{
			check: clauses.filter((clause) => clause.length === 0).length === 0,
			message: 'clauses for facets must not be empty',
		},
	]

	assertFailures(validations)
}

export const validateAscending = (fields: Array<string>): void => {
	const validations = [
		{
			check: fields.filter((field) => typeof field !== 'string').length === 0,
			message: 'field parameters for ascending must be string values',
		},
	]

	assertFailures(validations)
}

export const validateDescending = (fields: Array<string>): void => {
	const validations = [
		{
			check: fields.filter((field) => typeof field !== 'string').length === 0,
			message: 'field parameters for descending must be string values',
		},
	]

	assertFailures(validations)
}

export const validateFilterField = (filter: string, field: string): void => {
	const validations = [
		{
			check: typeof field === 'string',
			message: `field parameter for filter ${filter} must be a string value`,
		},
	]

	assertFailures(validations)
}
