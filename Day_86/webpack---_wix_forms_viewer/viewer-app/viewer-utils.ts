import { ILocation, IWixWindow } from '@wix/yoshi-flow-editor'
import _ from 'lodash'
import { Attachment, getAttachment } from './field-dto/field-dto'
import { siteStore } from './stores/site-store'

export interface WixFormField {
  readonly id: string
  readonly fieldName: string
  fieldValue: any
}

export const escapeRegExp = (str) => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') // eslint-disable-line no-useless-escape

export const innerText = (str) => _.trim(str.replace(/\s*<[^>]*>\s*/gm, ''))

export const FIELD_TYPE = {
  RATING: 'RatingsInput',
  CHECKBOX: 'Checkbox',
  CHECKBOX_GROUP: 'CheckboxGroup',
  DATE: 'DatePicker',
  TIME: 'TimePicker',
  CAPTCHA: 'Captcha',
  FILE_UPLOAD: 'UploadButton',
  SIGNATURE: 'SignatureInput',
  RADIO_GROUP: 'RadioButtonGroup',
  TEXT_INPUT: 'TextInput',
  TEXT_BOX: 'TextBox',
  DROPDOWN: 'Dropdown',
  AUTOCOMPLETE_ADDRESS: 'AddressInput',
  COMPLEX_PHONE: 'ComplexPhone',
  COMPLEX_ADDRESS: 'ComplexAddress',
}

const FIELD_TYPE_PREFIXES_OF_COMPLEX_INNER_FIELDS = ['complexAddress']

export const findPlugin = (plugins, pluginId) => _.find(plugins, (plugin) => plugin.id === pluginId)

export const getFieldType = (field: WixCodeField) => {
  return field.type.split('.')[1]
}

export const replaceMessageInnerText = ($message, replaceFunc: (string) => string): void => {
  const messageText = _.get($message, 'html')
  $message.html = replaceFunc(messageText)
}

export const isFieldType = (fieldType: string) => (field) => field.type === `$w.${fieldType}`

export const isSignatureField = isFieldType(FIELD_TYPE.SIGNATURE)
export const isUploadButton = isFieldType(FIELD_TYPE.FILE_UPLOAD)
export const isCaptchaField = isFieldType(FIELD_TYPE.CAPTCHA)
export const isRadioGroup = isFieldType(FIELD_TYPE.RADIO_GROUP)
export const isCheckbox = isFieldType(FIELD_TYPE.CHECKBOX)
export const isNumber = (field) =>
  isFieldType(FIELD_TYPE.TEXT_INPUT)(field) && field.inputType === 'number'
export const isDatePicker = isFieldType(FIELD_TYPE.DATE)
export const isTimePicker = isFieldType(FIELD_TYPE.TIME)
export const isComplexPhone = isFieldType(FIELD_TYPE.COMPLEX_PHONE)
export const isComplexAddress = isFieldType(FIELD_TYPE.COMPLEX_ADDRESS)

export const isComplexInnerField = (field: WixCodeField) => {
  const { fieldType }: { fieldType: string } = field.connectionConfig

  return !!FIELD_TYPE_PREFIXES_OF_COMPLEX_INNER_FIELDS.find((prefix) =>
    _.includes(fieldType, prefix),
  )
}

export const toMiliseconds = (sec) => sec * 1000

const PREVIEW_MODE = 'Preview'
export const TEMPLATE = 'template'

export const isTemplate = (wixLocation) => !wixLocation.baseUrl
export const isPreviewMode = (wixWindow) => wixWindow.viewMode === PREVIEW_MODE
export const isCurrentPageDynamic = () => siteStore.wixApi.site.currentPage?.type === TEMPLATE
export const shouldSendData = (wixLocation) => !isTemplate(wixLocation)

export const getBaseUrl = () => {
  if (siteStore.isEnabled('specs.forms.FixBaseUrl')) {
    return siteStore.wixApi.location.baseUrl
  }

  const urlDirs = siteStore.wixApi.location.baseUrl.split('/')
  let baseUrl = urlDirs.slice(0, urlDirs.length - 1).join('/')

  if (baseUrl === 'https:/' || baseUrl === 'http:/') {
    baseUrl = siteStore.wixApi.location.baseUrl
  }

  return baseUrl
}

export const getFieldValueByCrmType = (fields, crmType) =>
  _.get(findFieldByCrmType(fields, crmType), 'value')

export const findFieldByCrmType = (fields: any[], crmType): any =>
  _.find(fields, (field) => _.get(field, 'connectionConfig.crmType') === crmType)

export const findFieldByPresetType = (fields: any[], role: FieldPreset): any =>
  _.find(fields, (field) => _.get(field, 'connectionConfig.fieldType') === role)

export const componentStringify = (component) => {
  if (!component) {
    return {}
  }

  try {
    const proto = Object.getPrototypeOf(component)
    const componentProps = {}

    const existingKeys = _.keys(component)

    const propKeys =
      _.size(existingKeys) > 0
        ? existingKeys
        : [
            ...Object.getOwnPropertyNames(proto),
            'connectionConfig',
            'id',
            'uniqueId',
            'global',
            'rendered',
            'type',
          ]

    _.forEach(propKeys, (key) => {
      if (_.includes(['link', 'children', 'parent', 'toJSON'], key)) {
        return
      }

      try {
        componentProps[key] = _.isFunction(component[key])
          ? _.toString(component[key])
          : component[key]
      } catch (err) {}
    })

    return componentProps
  } catch (err) {
    return component.toJSON ? component.toJSON() : {}
  }
}

export const getFieldValidity = (fields) => {
  const valueMissing = 'valueMissing'
  const errorOrder = [
    valueMissing,
    'exceededFilesLimit',
    'fileNotUploaded',
    'fileTypeNotAllowed',
    'fileSizeExceedsLimit',
    'typeMismatch',
    'patternMismatch',
    'rangeOverflow',
    'rangeUnderflow',
    'stepMismatch',
    'tooLong',
    'tooShort',
    'badInput',
    'customError',
  ]
  let errorType = _.find(errorOrder, (error) => _.some(fields, `validity.${error}`))
  const field = _.find(fields, (_field) => {
    if (isCaptchaField(_field)) {
      const missingToken = _.isEmpty(_field.token)

      if (missingToken) {
        errorType = valueMissing
      }

      return missingToken
    }

    return _.get(_field, `validity.${errorType}`)
  })

  return errorType ? `${errorType} : ${_.get(field, 'connectionConfig.crmLabel')}` : ''
}

export const getFieldRawValue = (field: WixCodeField): any => {
  const fieldType = getFieldType(field)

  switch (fieldType) {
    case FIELD_TYPE.CHECKBOX:
      return field.checked
    case FIELD_TYPE.CAPTCHA:
      return field.token
    default:
      return field.value
  }
}

export const isWixFromFieldArray = (val: any): val is WixFormField[] =>
  _.isArray(val) && _.filter(val, (valItem) => !isWixFromField(valItem)).length === 0

export const isWixFromField = (val: any): val is WixFormField =>
  _.isString(_.get(val, 'id')) && _.isString(_.get(val, 'fieldName'))

export const toWixFormFieldType = ({
  fields,
  attachments,
}: {
  fields: any[]
  attachments: Attachment[]
}): WixFormField[] =>
  fields.map((field) => ({
    id: field.id,
    fieldValue: getFieldValue({ field, attachments }),
    fieldName: field.connectionConfig.crmLabel,
  }))

export const getFieldValue = ({
  field,
  attachments,
}: {
  field: any
  attachments: Attachment[]
}) => {
  const fieldType = getFieldType(field)

  switch (fieldType) {
    case FIELD_TYPE.CHECKBOX:
      return field.checked
    case FIELD_TYPE.CAPTCHA:
      return field.token
    case FIELD_TYPE.FILE_UPLOAD: // we need this for multi-step form
      const attachment = getAttachment(field, attachments)
      return attachment
        ? [
            {
              url: attachment.url,
              mediaId: attachment.mediaId,
              title: attachment.title,
              width: attachment.width,
              height: attachment.height,
            },
          ]
        : []
    case FIELD_TYPE.SIGNATURE: // we need this for multi-step form
      const signatureAttachment = getAttachment(field, attachments)
      return signatureAttachment.value
    default:
      return field.value
  }
}

export const setFieldValue = ({ field, value }: { field: any; value: any }): void => {
  const fieldType = getFieldType(field)

  switch (fieldType) {
    case FIELD_TYPE.CHECKBOX:
      field.checked = value
      break

    case FIELD_TYPE.CAPTCHA:
      field.token = value
      break

    case FIELD_TYPE.FILE_UPLOAD:
      throw new Error(`${FIELD_TYPE.FILE_UPLOAD} cannot be changed`)

    case FIELD_TYPE.SIGNATURE:
      throw new Error(`${FIELD_TYPE.SIGNATURE} cannot be changed`)

    default:
      field.value = value
  }
}

export const isFieldValueEqual = ({
  field,
  attachments,
  val,
}: {
  field: any
  attachments: Attachment[]
  val: any
}): boolean => {
  const fieldType = getFieldType(field)
  const fieldValue = getFieldValue({ field, attachments })

  switch (fieldType) {
    case FIELD_TYPE.CHECKBOX_GROUP:
      return _.isArray(val)
        ? _.isEqual(_.sortBy(fieldValue), _.sortBy(val))
        : _.isEqual(fieldValue, val)
    default:
      return _.isEqual(fieldValue, val)
  }
}

const toStreetAddress = (streetAddress?: { name?: string; number?: string }) => {
  if (!streetAddress) {
    return null
  }
  const { name, number } = streetAddress

  return name ? (number ? `${name}, ${number}` : name) : undefined
}

export const toAddressV2 = (rawValue: {
  formatted?: string
  country?: string
  streetAddress?: {
    name?: string
    number?: string
  }
  postalCode?: string
  subdivision?: string
  city?: string
}) => ({
  formatted: rawValue.formatted,
  street: toStreetAddress(rawValue.streetAddress),
  city: rawValue.city,
  region: rawValue.subdivision,
  country: rawValue.country,
  zip: rawValue.postalCode,
})
