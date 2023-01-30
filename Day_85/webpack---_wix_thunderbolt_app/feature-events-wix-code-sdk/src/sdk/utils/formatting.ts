import { omit } from 'lodash'
import { FormResponseCorvid } from '../types/types'
import { FormResponse } from '@wix/ambassador-wix-events-web/types'

export const removeNumberPropFromInputs = ({ inputValues = [] }: FormResponse): FormResponseCorvid => ({
	inputValues: inputValues.map((inputObj) => omit(inputObj, ['number'])),
})
