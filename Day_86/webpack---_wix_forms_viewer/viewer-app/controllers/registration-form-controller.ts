import _, { isNumber } from 'lodash'
import {
  RegistrationFieldPreset,
  CUSTOM_FIELD,
  CRM_TYPES,
  FormsFieldPreset,
} from '@wix/forms-common'
import { SubmitFormResponse } from '../../types/domain-types'
import { FIELDS } from '../../constants/roles'
import { siteStore } from '../stores/site-store'
import { getInputValue } from '../input-value'
import { sanitizePII } from '@wix/bi-logger-sanitizer/dist/src/lib/sanitizers'
import { RegistrationError } from '../errors'
import { getFieldType } from '../viewer-utils'
import { BaseController } from './base-controller'
import { getPhoneStringValueByType } from '../field-dto/field-dto'
import { I$W } from '@wix/yoshi-flow-editor'

export class RegistrationFormController extends BaseController {
  private _firstInitialization
  constructor(
    {
      $w,
      formId,
      controllerSettings,
      isPaymentForm,
    }: {
      $w: I$W
      formId: string
      controllerSettings: ControllerSettings
      isPaymentForm: boolean
    },
    { wixLocation, wixSite, wixSeo, wixWindow, wixPay, wixUsers, wixAuthentication },
  ) {
    super(
      { $w, formId, controllerSettings, isPaymentForm },
      { wixLocation, wixSite, wixSeo, wixWindow, wixPay, wixUsers, wixAuthentication },
    )
  }

  protected get isRegistrationForm() {
    return true
  }

  protected _init() {
    super._init()

    this._firstInitialization = {
      [FIELDS.ROLE_FIELD_REGISTRATION_FORM_LOGIN_EMAIL]: true,
      [FIELDS.ROLE_FIELD_REGISTRATION_FORM_PASSWORD]: true,
    }
    this._registerPasswordValidation()
    this._registerLoginLink()
  }

  private _registerPasswordValidation() {
    const password = passwordField(this.$w)

    if (!password) {
      return
    }

    password.onCustomValidation((value, reject) => {
      if (this._firstInitialization[FIELDS.ROLE_FIELD_REGISTRATION_FORM_PASSWORD]) {
        this._firstInitialization[FIELDS.ROLE_FIELD_REGISTRATION_FORM_PASSWORD] = false
        return
      }

      if (value.length < PASSWORD_LENGTH.MIN || value.length > PASSWORD_LENGTH.MAX) {
        reject(
          siteStore.t('registrationForm.passwordLimitError', {
            min: PASSWORD_LENGTH.MIN,
            max: PASSWORD_LENGTH.MAX,
          }),
        )
      }
    }, false)
  }

  private _registerLoginLink() {
    const loginLink = linkLoginField(this.$w)
    if (!loginLink) {
      return
    }
    loginLink.onClick(() => {
      this.helpers.wixUsers.promptLogin({ mode: 'login' })

      if (!(this.helpers.wixUsers as any).supportsPopupAutoClose) {
        ;(this.helpers.wixWindow.lightbox as any).close()
      }
    })
  }

  logFields(message, fields) {
    try {
      const parsedFields = _.map(fields, (field) => JSON.stringify(field))
      siteStore.captureBreadcrumb({
        message,
        category: 'registration',
        data: {
          fields: parsedFields,
          parsedFieldsSize: _.size(parsedFields),
        },
      })
    } catch (err) {}
  }

  public async execute({ attachments, fields }): Promise<SubmitFormResponse> {
    if (this.helpers.wixWindow.viewMode === PREVIEW_MODE) {
      return Promise.resolve({})
    }

    // this.logFields('fields', fields)

    const { email, password, joinTheCommunityCheckbox } = getFields(this.$w)

    const privacyStatus =
      joinTheCommunityCheckbox && joinTheCommunityCheckbox.checked ? 'PUBLIC' : 'PRIVATE'
    const payload = { defaultFlow: true, privacyStatus, contactInfo: { phones: [], emails: [] } }

    const validFields = fields.filter(
      (field) =>
        field.connectionConfig.crmType &&
        !_.isEmpty(getInputValue(field, attachments)) &&
        !IGNORED_FIELDS_WITHOUT_EMAIL[field.connectionConfig.fieldType],
    )

    // this.logFields('filtered fields', validFields)

    const serverResponse = await super.execute({ attachments, fields: submitFields(validFields) })

    const contactInfo = buildContactInfo(validFields, attachments)

    payload.contactInfo = contactInfo

    try {
      siteStore.interactionStarted('registration')
      await this.helpers.wixUsers.register(email.value, password.value, payload)
      siteStore.interactionEnded('registration')
      return serverResponse
    } catch (e) {
      if (typeof e === 'string') {
        const sanitizedErrorMessage = sanitizePII(e)

        if (_.startsWith(e, 'member with email')) {
          siteStore.interactionEnded('registration') // expected exception, shouldn't be counted as error
          throw new RegistrationError('member already exists in collection', sanitizedErrorMessage)
        }

        throw new RegistrationError(sanitizedErrorMessage)
      }

      throw new RegistrationError('SDK Error', e)
    }
  }

  public postSubmission() {
    setTimeout(() => (this.helpers.wixWindow.lightbox as any).close(), 750)
    return Promise.resolve()
  }
}

const PASSWORD_LENGTH = { MIN: 4, MAX: 100 }
const PREVIEW_MODE = 'Preview'

const getFields = ($w) => {
  const email: any = loginEmailField($w)
  const password: any = passwordField($w)
  const joinTheCommunityCheckbox: any = joinTheCommunityCheckboxField($w)
  return { email, password, joinTheCommunityCheckbox }
}

const loginEmailField = ($w): any =>
  _($w(`@${FIELDS.ROLE_FIELD_REGISTRATION_FORM_LOGIN_EMAIL}`)).first()
const passwordField = ($w): any => _($w(`@${FIELDS.ROLE_FIELD_REGISTRATION_FORM_PASSWORD}`)).first()
const linkLoginField = ($w): any =>
  _($w(`@${FIELDS.ROLE_FIELD_REGISTRATION_FORM_LINK_TO_LOGIN_DIALOG}`)).first()
const joinTheCommunityCheckboxField = ($w): any =>
  _($w(`@${FIELDS.ROLE_FIELD_REGISTRATION_FORM_CHECKBOX_JOIN_COMMUNITY}`)).first()

const submitFields = (fields) =>
  fields.filter((field) => _.get(field, 'connectionConfig.fieldType') !== 'password')

const IGNORED_FIELDS_WITHOUT_EMAIL = {
  [RegistrationFieldPreset.REGISTRATION_FORM_PASSWORD]: true,
  [RegistrationFieldPreset.REGISTRATION_FORM_CHECKBOX_AGREE_TERMS]: true,
  [RegistrationFieldPreset.REGISTRATION_FORM_CHECKBOX_JOIN_COMMUNITY]: true,
}

const valueHandlerByType = {
  DatePicker: ({ value }) => value,
}

const getFieldValue = (field, attachments) => {
  const fieldType = getFieldType(field)
  const fieldValue = valueHandlerByType[fieldType]
    ? valueHandlerByType[fieldType](field)
    : getInputValue(field, attachments)
  return isNumber(field) ? +fieldValue : fieldValue
}

const buildContactInfo = (validFields: any[], attachments) => {
  const contactInfo = {
    phones: [],
    emails: [],
  }

  validFields.forEach((field) => {
    const {
      crmType,
      customFieldId,
      customFieldKey,
      customFieldName,
      fieldType,
    } = field.connectionConfig
    const initialValue = getFieldValue(field, attachments)
    let fieldValue = ''
    switch (fieldType) {
      case FormsFieldPreset.COMPLEX_ADDRESS_WIDGET:
        fieldValue = getAddressValue(initialValue)
        break
      case FormsFieldPreset.GENERAL_AUTOCOMPLETE_ADDRESS:
        fieldValue = initialValue.formatted
        break
      default:
        fieldValue = initialValue
    }

    switch (crmType) {
      case CRM_TYPES.EMAIL:
        contactInfo.emails.push(fieldValue)
        break
      case CRM_TYPES.PHONE:
        contactInfo.phones.push(getPhoneStringValueByType(fieldValue, fieldType))
        break
      case CUSTOM_FIELD:
        if (customFieldKey || customFieldId) {
          contactInfo[customFieldName] = fieldValue
        }
        break

      default:
        contactInfo[crmType] = fieldValue
    }
  })
  return contactInfo
}

const getAddressValue = (fieldValue) =>
  _.keys(fieldValue).reduce((acc, key) => {
    return fieldValue[key] ? (acc ? `${acc} ${fieldValue[key]}` : fieldValue[key]) : acc
  }, '')

export const isRegistrationFormEnabled = ($w) => {
  const { email, password } = getFields($w)
  return email && password
}
