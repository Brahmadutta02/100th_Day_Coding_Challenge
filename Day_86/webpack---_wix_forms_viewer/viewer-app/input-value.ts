import _ from 'lodash'
import { Attachment } from './field-dto/field-dto'
import { getFieldType } from './viewer-utils'

const valueHandlerByType = {
  UploadButton: (field, attachments: Attachment[]): { name: string; url: string } | '' => {
    const name = _.get(field, 'value[0].name')
    const url = _.get(_.find(attachments, { name }), 'url')
    return url
      ? {
          name,
          url: _.get(_.find(attachments, { name }), 'url'),
        }
      : ''
  },
  Checkbox: (field) => (field.checked ? field.value : ''),
  CheckboxGroup: (field) =>
    _.map(field.value, (val: string) => _.replace(val, ',', ' ')).join(', '),
  DatePicker: ({ value }) => {
    if (!value) {
      return value
    }
    const padZero = (num) => _.padStart(num, 2, '0')
    return `${value.getFullYear()}-${padZero(value.getMonth() + 1)}-${padZero(value.getDate())}`
  },
  RatingsInput: (field) => (field.value ? field.value.toString() : ''),
  Captcha: (field) => field.token,
}

export const getInputValue = (field, attachments: Attachment[][] = []) => {
  const valueHandler = valueHandlerByType[getFieldType(field)]
  return valueHandler ? valueHandler(field, attachments) : field.value
}
