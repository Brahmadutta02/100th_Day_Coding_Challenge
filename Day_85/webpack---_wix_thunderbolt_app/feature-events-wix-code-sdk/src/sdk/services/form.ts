import { prepareArray } from '../helpers'
import { RegistrationForm } from '../types/types'
import { FormattedAddress, InputValue } from '@wix/ambassador-wix-events-web/types'

const CUSTOM_INPUT_NAMES = ['comment', 'date', 'address', 'custom', 'phone']

const Resolvers = {
	date: (inputValue: string, inputName = 'date') => {
		const date = new Date(inputValue)
		const year = date.getFullYear()
		const month = date.getMonth() + 1
		const day = date.getDate()
		const formattedDate = [year, month, day]
			.map(String)
			.map((value) => value.padStart(2, '0'))
			.join('-')

		return {
			inputName,
			value: formattedDate,
			values: [] as Array<any>,
		}
	},
	address: (inputValue: Array<string> | FormattedAddress | string, inputName = 'address') => {
		const values = Array.isArray(inputValue)
			? inputValue
			: inputValue && (inputValue as FormattedAddress).formatted
			? [(inputValue as FormattedAddress).formatted]
			: [inputValue]

		return {
			inputName,
			value: '',
			values,
		}
	},
	default: (inputValue: any | Array<any>, inputName: string) => {
		const [value, values] = Array.isArray(inputValue)
			? ['', prepareArray(inputValue)]
			: [inputValue, [] as Array<any>]
		return {
			inputName,
			value,
			values,
		}
	},
}

const correctCustomInputIds = (inputs: RegistrationForm) => {
	return Object.entries(inputs).reduce((acc, [key, value]) => {
		const customInputName = CUSTOM_INPUT_NAMES.find((name) => key.startsWith(name) && key.length > name.length)
		if (customInputName) {
			key = `${customInputName}-${key.slice(customInputName.length)}`
		}
		return {
			...acc,
			[key]: value,
		}
	}, {})
}

export const createForm = (inputs: RegistrationForm): Array<InputValue> => {
	const inputsWithCorrectIds = correctCustomInputIds(inputs)
	return Object.entries(inputsWithCorrectIds)
		.filter(([inputId]) => inputId !== 'rsvpStatus')
		.map(([inputId, inputValue]) => {
			const [, resolver] = Object.entries(Resolvers).find(([key]) => inputId.startsWith(key)) || []
			return resolver ? resolver(inputValue, inputId) : Resolvers.default(inputValue, inputId)
		})
}
