import { convertRateFromNumberToString, convertRateFromStringToNumber } from './utils'
import { CURRENCY_CONVERTER, CURRENCY_CONVERTER_SETTINGS } from './config'
import { baseUrl } from './locationUtils'
import { validateConvertAmounts, validateGetConversionRate } from '../validations/currencies/currenciesValidatation'

const CURRENCY_CONVERTER_APP_DEF_ID = '5e762334-899c-4e32-a7ad-b80f03471dfb'
export const consoleErrorPrefix = (prefix: string) => `WixPay.currencies.${prefix}:invalid arguments`
export const createCurrencies = function ({ getInstance }: { getInstance: (appId: string) => string }) {
	const getHeaders = () => ({ Authorization: getInstance(CURRENCY_CONVERTER_APP_DEF_ID) })

	const getCurrencies = () => {
		return fetch(`${baseUrl()}${CURRENCY_CONVERTER_SETTINGS}`, {
			method: 'get',
			headers: getHeaders(),
		})
			.then((res) => {
				return res.json()
			})
			.then((res) => {
				return res.currencies
			})
	}

	const getConversionRate = (from: string, to: string) => {
		if (!validateGetConversionRate(from, to)) {
			return Promise.reject(consoleErrorPrefix('currencyConverter.getConversionRate'))
		}

		return fetch(`${baseUrl()}${CURRENCY_CONVERTER}/rate/${from}/convert/${to}`, {
			method: 'get',
			headers: getHeaders(),
		})
			.then((res) => {
				return res.json()
			})
			.then((res) => {
				return {
					rate: convertRateFromStringToNumber(res.rate),
					timestamp: new Date(res.rateTimestamp),
				}
			})
	}

	const convertAmounts = (data: { amounts: Array<number>; from: string; to: string }) => {
		const { amounts, from, to } = data

		if (!validateConvertAmounts(amounts, from, to)) {
			return Promise.reject(consoleErrorPrefix('currencyConverter.convertAmounts'))
		}

		const amountsAsString = amounts.map(convertRateFromNumberToString)
		const body = {
			amounts: amountsAsString,
			from,
			to,
		}
		return fetch(`${baseUrl()}${CURRENCY_CONVERTER}/amounts/${from}/convert/${to}`, {
			method: 'post',
			headers: getHeaders(),
			body: JSON.stringify(body),
		})
			.then((res) => {
				return res.json()
			})
			.then((res) => {
				const { amounts: convertedAmounts, rateTimestamp } = res
				return {
					amounts: convertedAmounts.map(convertRateFromStringToNumber),
					timestamp: new Date(rateTimestamp),
				}
			})
	}

	const getAllCurrencies = () => {
		return fetch(`${baseUrl()}${CURRENCY_CONVERTER}`, {
			method: 'get',
			headers: getHeaders(),
		})
			.then((res) => {
				return res.json()
			})
			.then((res) => {
				return res.currencies
			})
	}

	return {
		getAllCurrencies,
		siteSettings: {
			getCurrencies,
		},
		currencyConverter: {
			getConversionRate,
			convertAmounts,
		},
	}
}
