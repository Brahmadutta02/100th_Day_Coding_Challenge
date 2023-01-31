import _ from 'lodash'
import { IController } from '../controllers/controllers'
import { DOMAIN_REGEX } from '../services/constants'

export const registerURLValidation = async (
  _controller: IController,
  components: WixCodeField[],
) => {
  const urlFields = _.filter(components, isUrlField)
  urlFields.forEach(setValidationOnBlur)
}

export const fixInputIfNeeded = (input: string): string => {
  const value = input.trim()
  return valueStartsWithProtocol(value) ? value : addProtocol(value)
}

const isUrlField = (field) => _.get(field, 'inputType') === 'url'

const setValidationOnBlur = (url) =>
  url.onBlur && url.onBlur((e) => !url.valid && (url.value = fixInputIfNeeded(e.target.value)))

const valueStartsWithProtocol = (value) => ['http', 'ftp'].find((p) => value.startsWith(p))

const addProtocol = (value) => (domainRegex.test(value) ? `https://${value}` : value)

const domainRegex = new RegExp(DOMAIN_REGEX, 'i')
