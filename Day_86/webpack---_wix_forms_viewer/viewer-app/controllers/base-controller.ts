import { sanitizePII } from '@wix/bi-logger-sanitizer/dist/src/lib/sanitizers'
import {
  FormPlugin,
  FormsFieldPreset,
  SecondsToResetDefaults,
  SuccessActionTypes,
} from '@wix/forms-common'
import _ from 'lodash'
import {
  AUTOFILL_MEMBER_EMAIL_ROLE,
  FIELDS,
  FIELDS_ROLES,
  ROLE_DOWNLOAD_MESSAGE,
  ROLE_FORM,
  ROLE_LIMIT_MESSAGE,
  ROLE_MESSAGE,
  ROLE_SUBMIT_BUTTON,
} from '../../constants/roles'
import { EmailConfig, Field, SubmitFormRequest, SubmitFormResponse } from '../../types/domain-types'
import { registerBehaviors } from '../behaviors'
import { ClientCaptchaRequiredError, ErrorName, MembersAutofillError } from '../errors'
import { Attachment, createFieldDto, getFieldValue } from '../field-dto/field-dto'
import { post } from '../services/fetch-utils'
import { siteStore } from '../stores/site-store'
import { submitUtils } from '../submit-utils'
import { isNotEmptyEmailId } from '../utils/utils'
import {
  getBaseUrl,
  isCaptchaField,
  isComplexAddress,
  isRadioGroup,
  isUploadButton,
  replaceMessageInnerText,
  setFieldValue,
  toMiliseconds,
  isCurrentPageDynamic,
  findPlugin,
} from '../viewer-utils'
import { IController } from './controllers'

export class BaseController implements IController {
  protected attachments: { [uniqueId: string]: Attachment }
  protected fields: any[]

  public $w
  public helpers: { wixLocation; wixSite; wixSeo; wixWindow; wixPay; wixUsers; wixAuthentication }
  public formId: string
  public isPaymentForm: boolean
  public controllerSettings: ControllerSettings
  public initialFields: { uniqueId; value }[]
  public $form: any
  public $message: any
  public $submitButton: any

  constructor(
    {
      $w,
      formId,
      controllerSettings,
      isPaymentForm,
    }: {
      $w
      formId: string
      controllerSettings: ControllerSettings
      isPaymentForm: boolean
    },
    { wixLocation, wixSite, wixSeo, wixWindow, wixPay, wixUsers, wixAuthentication },
  ) {
    this.$w = $w
    this.formId = formId
    this.controllerSettings = controllerSettings
    this.isPaymentForm = isPaymentForm
    this.helpers = { wixLocation, wixSite, wixSeo, wixWindow, wixPay, wixUsers, wixAuthentication }

    this._init()
  }

  protected _init() {
    this.$form = _.get(this.$w(`@${ROLE_FORM}`), '[0]')
    const successMessage = this.$w(`@${ROLE_MESSAGE}`)
    const downloadMessage = this.$w(`@${ROLE_DOWNLOAD_MESSAGE}`)
    const limitMessage = this.$w(`@${ROLE_LIMIT_MESSAGE}`)

    if (_.get(successMessage, 'hide')) {
      successMessage.hide()
      this.$message = successMessage
    }

    if (_.get(downloadMessage, 'hide')) {
      downloadMessage.hide()
      this.$message = downloadMessage
    }

    if (_.get(limitMessage, 'collapse')) {
      limitMessage.collapse()
    }

    this.$submitButton = this.$w(`@${ROLE_SUBMIT_BUTTON}`)
    this.fields = this.getFieldsByRoles(FIELDS_ROLES)
    this.attachments = {}
    this.initialFields = this.fields.map(({ uniqueId, value }) => ({ uniqueId, value }))

    this._registerNumberInputValidation()
    this._registerMembersAutofill()

    if (!this.isMultiStepForm) {
      const allComponents = _.compact([...this.fields, _.first(this.$submitButton)])
      registerBehaviors(this, allComponents)
    }
  }

  get limitMessage() {
    return this.$w(`@${ROLE_LIMIT_MESSAGE}`)
  }

  async formReachLimit() {
    const shouldCollapse = _.filter(
      this.$form.children,
      (element) => element.id !== this.limitMessage.id,
    )
    await Promise.all([
      ...shouldCollapse.map((ele) => ele.collapse()),
      _.get(this.limitMessage, 'expand') ? this.limitMessage.expand() : Promise.resolve(),
    ])
  }

  onLimitError() {
    if (_.get(this.limitMessage, 'expand')) {
      return this.limitMessage.expand()
    }
  }

  protected get isRegistrationForm() {
    return false
  }

  protected get isMultiStepForm() {
    return false
  }

  public get formTypes(): FormPlugin[] {
    const types = []

    // Payment Form
    if (this.isPaymentForm) {
      types.push(FormPlugin.PAYMENT_FORM)
    }

    // Get Subscribers Form
    const plugins = _.get(this.$form, 'connectionConfig.plugins', [])
    const getSubscribersPlugin = findPlugin(plugins, FormPlugin.GET_SUBSCRIBERS)
    const hasOptInField = !!_.find(
      this.fields,
      (f) => _.get(f, 'connectionConfig.fieldType') === FIELDS.ROLE_FIELD_SUBSCRIBE,
    )

    if (getSubscribersPlugin || hasOptInField) {
      types.push(FormPlugin.GET_SUBSCRIBERS)
    }

    // Registration Form
    if (this.isRegistrationForm) {
      types.push(FormPlugin.REGISTRATION_FORM)
    }

    return types
  }

  public getFields() {
    if (this.isRegistrationForm) {
      return this.getFieldsByRoles(FIELDS_ROLES)
    }

    return this.fields
  }

  public getFieldsByRoles(roles) {
    const fields = _.compact(
      roles.reduce((res, roleField) => res.concat(this.$w(`@${roleField}`)), []),
    )
    return _.uniqBy(fields, (field: { uniqueId: string }) => field.uniqueId)
  }

  public getNumOfAttachments() {
    return _.flatMap(
      _.filter(this.fields, (field) => isUploadButton(field) && field.value.length > 0).map(
        (field) => field.value,
      ),
    ).length
  }

  public async getAttachments() {
    const fieldsWithoutAttachments = this.getFields()
    return [
      ...(await submitUtils.getAttachments(fieldsWithoutAttachments)),
      ...(await submitUtils.getSignatureAttachments({
        currentFields: fieldsWithoutAttachments,
        formId: this.formId,
      })),
    ]
  }

  private _registerNumberInputValidation() {
    const fields = this.fields.filter((field) => field.role === FIELDS.ROLE_FIELD_TEXT)
    const numbers = _.filter(fields, (field) => _.get(field, 'inputType') === 'number')

    _.forEach(numbers, (number) => {
      if (number.onBlur) {
        number.onBlur((e) => {
          number.value = e.target.value
        })
      }
    })
  }

  _logFields(message, fields) {
    try {
      const parsedFields = _.map(fields, (field) => JSON.stringify(field))
      siteStore.captureBreadcrumb({
        message,
        category: 'validateFields',
        data: {
          fields: parsedFields,
          parsedFieldsSize: _.size(parsedFields),
        },
      })
    } catch (err) {
      siteStore.captureException(new Error('Failed to log fields data'), {
        extra: { err },
      })
    }
  }

  _logField(field) {
    try {
      siteStore.captureBreadcrumb({
        message: 'field data',
        category: 'validateFields',
        data: {
          id: field.id,
          required: _.toString(field.required),
          value: sanitizePII(field.value),
          valid: _.toString(field.valid),
          collapsed: _.toString(field.collapsed),
        },
      })
    } catch (err) {
      siteStore.captureException(new Error('Failed to log field data'), {
        extra: { err },
      })
    }
  }

  public validateFields(fields: any[]): any[] {
    // this._logFields('fields', fields)

    const fieldsToTestValidity = _.filter(fields, (field) => !field.collapsed)

    const rejected = _.reject(fieldsToTestValidity, (field) => {
      // this._logField(field)

      if (isRadioGroup(field)) {
        // TODO - waiting for full fix for radioGroup
        return !field.required || field.value.length > 0
      }

      if (isCaptchaField(field)) {
        return !_.isEmpty(field.token)
      }

      if (isUploadButton(field)) {
        if (!field.validity.fileNotUploaded || (field.required && field.value.length === 0)) {
          return field.valid
        }
        return true
      }

      if ('valid' in field) {
        return field.valid
      }

      return true
    })

    this._logFields('rejected', rejected)

    return rejected
  }

  private async _logSubmission(fields: WixCodeField[]) {
    if (!this.isRegistrationForm) {
      return
    }

    if (_.size(fields) > 0) {
      return
    }

    try {
      siteStore.captureException(new Error('Missing registration form fields data'), {
        extra: {
          currentPage: this.helpers.wixSite.currentPage,
          formId: this.formId,
          connectionConfig: _.get(this.$form, 'connectionConfig'),
        },
        tags: { preset: _.get(this.$form, 'connectionConfig.preset') },
      })
    } catch (err) {
      siteStore.captureException(new Error('Failed to log submission'), {
        extra: { err },
      })
    }
  }

  private _logFieldValidationMismatch(fields) {
    try {
      const mismatchField = _.find(
        fields,
        (field) => field.required && field.value === '' && field.valid,
      )
      if (mismatchField) {
        siteStore.captureException(new Error('Found field validation mismatch'), {
          extra: {
            currentPage: this.helpers.wixSite.currentPage,
            formId: this.formId,
            connectionConfig: _.get(this.$form, 'connectionConfig'),
          },
          tags: {
            preset: _.get(this.$form, 'connectionConfig.preset'),
            pageType: this.helpers.wixSite.currentPage.type,
          },
        })
      }
    } catch (err) {
      siteStore.captureException(new Error('Failed to log field validation mismatch'), {
        extra: { err },
      })
    }
  }

  private async _submit({
    attachments,
    fields,
    captchaToken = undefined,
    isDynamicPage,
  }: {
    attachments: Attachment[]
    fields
    captchaToken: string | undefined
    isDynamicPage: boolean
  }) {
    try {
      siteStore.interactionStarted('submission')

      const response = await sendActivity(this.$w, {
        attachments,
        fields,
        wixWindow: this.helpers.wixWindow,
        formId: this.formId,
        captchaToken,
        isDynamicPage,
      })

      siteStore.interactionEnded('submission')

      return response
    } catch (err) {
      const errorName = _.get(err, 'name')

      if (errorName === ErrorName.CaptchaRequiredError) {
        siteStore.interactionEnded('submission') // treat as submission success if captcha required from server (business error)

        const token = await this.openCaptchaChallenge('server')

        if (token) {
          return this._submit({ attachments, fields, captchaToken: token, isDynamicPage })
        }
      }

      throw err
    }
  }

  public async openCaptchaChallenge(reason, btype = undefined) {
    const biData: any = {
      origin: 'web',
      form_comp_id: this.formId,
    }

    if (btype) {
      biData.btype = btype
    }

    siteStore.log({ evid: 1453, reason, ...biData })
    const token = await this.helpers.wixAuthentication.openCaptchaChallenge().catch(() => null)
    siteStore.log({ evid: 1454, reason: token ? 'resolved' : 'manually closed', ...biData })
    return token
  }

  private async _beforeSubmitValidation(fields: WixCodeField[]): Promise<string | undefined> {
    const hasCaptchaField = !!_.find(fields, isCaptchaField)

    let captchaToken: string

    if (!hasCaptchaField) {
      if (!siteStore.isTestRun || siteStore.forceCaptcha) {
        const bot = siteStore.isBot
        if (bot) {
          captchaToken = await this.openCaptchaChallenge('client', siteStore.botType)

          if (!captchaToken) {
            throw new ClientCaptchaRequiredError()
          }
        }
      }
    }

    return captchaToken
  }

  public async execute({
    attachments,
    fields,
  }: {
    attachments: Attachment[]
    fields
  }): Promise<SubmitFormResponse> {
    // Debug Data:
    this._logFieldValidationMismatch(fields)
    this._logSubmission(fields)

    const captchaToken = await this._beforeSubmitValidation(fields)
    const isDynamicPage = isCurrentPageDynamic()
    const response = await this._submit({ attachments, fields, captchaToken, isDynamicPage })

    // this._logSystemAlert(fields, _.get(response, 'submissionId'))

    return response
  }

  async postSubmission() {
    const { secondsToResetForm, successActionType, successLinkValue } = this.$form.connectionConfig

    switch (successActionType) {
      case SuccessActionTypes.LINK:
      case SuccessActionTypes.EXTERNAL_LINK:
        setTimeout(
          () => this.helpers.wixLocation.to(siteStore.platformApi.links.toUrl(successLinkValue)),
          100,
        )
        return Promise.resolve()

      case SuccessActionTypes.DOWNLOAD_DOCUMENT:
        if (_.get(this.$message, 'html', undefined) === undefined) {
          return Promise.resolve()
        }
        replaceMessageInnerText(
          this.$message,
          (innerText) =>
            `<a href="${siteStore.platformApi.links.toUrl(
              successLinkValue,
            )}" target="_blank" role="alert">${innerText}</a>`,
        )
        this.$message.show()
        return Promise.resolve()

      default:
        const hasMessageContent = _.get(this.$message, 'html', undefined) !== undefined
        const timedMessage =
          hasMessageContent &&
          secondsToResetForm >= 3 && // this is a constant by design due to this ticket https://jira.wixpress.com/browse/FSM-5448
          secondsToResetForm <= SecondsToResetDefaults.MAX
        const previousMessage: string = timedMessage && this.$message.html

        if (hasMessageContent) {
          replaceMessageInnerText(
            this.$message,
            (innerText) => `<span role="alert">${innerText}</span>`,
          )
          this.$message.show()
        }

        return timedMessage
          ? new Promise((resolve) =>
              setTimeout(() => {
                this.$message.html = previousMessage
                resolve(this.$message.hide())
              }, toMiliseconds(secondsToResetForm)),
            )
          : Promise.resolve()
    }
  }

  private _registerMembersAutofill = (): void => {
    const { wixUsers } = this.helpers
    const autofillField = _.get(this.$w(`@${AUTOFILL_MEMBER_EMAIL_ROLE}`), '[0]')

    if (autofillField) {
      wixUsers.onLogin((_user) => {
        this._setupMembersAutofill(autofillField)
      })

      this._setupMembersAutofill(autofillField)
    }
  }

  private _setupMembersAutofill = async (autofillField): Promise<void> => {
    const { wixUsers } = this.helpers

    if (wixUsers.currentUser.loggedIn) {
      try {
        const userEmail = await wixUsers.currentUser.getEmail()

        if (!userEmail) {
          throw new Error(`User email is invalid: ${userEmail}`)
        }

        const isEditable = _.get(autofillField, 'connectionConfig.isEditable')

        setFieldValue({ field: autofillField, value: userEmail })
        this._setInitialFieldAt({
          uniqueId: autofillField.uniqueId,
          value: userEmail,
        })

        if (!isEditable) {
          autofillField.readOnly = true
        }
      } catch (err) {
        siteStore.captureException(new MembersAutofillError(err, 'Fetch of user email failed'))
        return
      }
    }
  }

  private _setInitialFieldAt({ uniqueId, value }: { uniqueId: number; value: any }): void {
    this.initialFields = this.initialFields.map((field) => {
      if (uniqueId === field.uniqueId) {
        return { ...field, value }
      } else {
        return field
      }
    })
  }

  public getFieldsByRole(role: string) {
    return this.$w(`@${role}`) || []
  }
}

const getRecipients = (emailIds: string[]) => {
  const sendToOwner: boolean = _.isEmpty(emailIds[0])
  const actualEmailIds: string[] = emailIds.filter(isNotEmptyEmailId)

  return { sendToOwner, emailIds: actualEmailIds }
}

const createEmailConfig = ({
  emailIds,
  selectedSiteUsersIds,
  inboxOptOut,
}: {
  emailIds: string[]
  selectedSiteUsersIds?: string[]
  inboxOptOut?: boolean
}): EmailConfig => {
  const recipients = getRecipients(emailIds)

  if (!_.isBoolean(inboxOptOut) || inboxOptOut) {
    if (recipients.sendToOwner) {
      return {
        sendToOwnerAndEmails: {
          emailIds: [...recipients.emailIds],
        },
      }
    }

    return {
      sendToEmails: {
        emailIds: [...recipients.emailIds],
      },
    }
  } else {
    if (!selectedSiteUsersIds) {
      if (recipients.sendToOwner) {
        return {
          sendToOwner: {},
        }
      }
    }

    return {
      sendToContributors: {
        userIds: selectedSiteUsersIds || [],
      },
    }
  }
}

const FILTERED_FIELDS = [FormsFieldPreset.GENERAL_RECAPTCHA]

const createFieldsDto = ({
  fields,
  attachments,
  options,
  isPaymentForm,
}: {
  fields
  attachments: Attachment[]
  options
  isPaymentForm: boolean
}) => {
  const fieldsDto = []

  const validFields = _.filter(
    fields,
    (field) => !_.includes(FILTERED_FIELDS, _.get(field, 'connectionConfig.fieldType')),
  )

  _.forEach(validFields, (field: WixCodeField) => {
    let fieldDto: Field
    if (isComplexAddress(field)) {
      const { innerFields } = field

      innerFields.forEach((innerField: WixCodeField) => {
        fieldDto = createFieldDto({ field: innerField, attachments, options })
        fieldsDto.push(fieldDto)
      })
    } else {
      fieldDto = createFieldDto({
        field,
        attachments,
        options,
        isPaymentForm,
      })
      fieldsDto.push(fieldDto)
    }
  })

  return fieldsDto
}

const enrichPayloadWithSecurityToken = ({ token, payload }) => {
  payload.security = { captcha: token }
}

const enrichPayloadWithSubmissionMetadata = ({ payload }) => {
  const dbCollectionItemId = _.get(siteStore, [
    'initAppParams',
    'routerReturnedData',
    'items',
    '0',
    '_id',
  ])
  const dynamicUrl = _.get(siteStore, ['initAppParams', 'routerReturnedData', 'dynamicUrl'])
  const isAllItemsPage = dynamicUrl.startsWith('/') && dynamicUrl.endsWith('/')
  payload.submissionMetadata = {
    ...payload.submissionMetadata,
    dynamicPageId: isAllItemsPage ? siteStore.t('dynamicPage.all') : dbCollectionItemId,
  }
}

const enrichPayloadWithCaptchaField = ({ $w, payload }) => {
  const captchaField = $w(`@${FIELDS.ROLE_FIELD_RECAPTCHA}`)

  if (captchaField.length > 0) {
    const token = getFieldValue(captchaField)
    enrichPayloadWithSecurityToken({ token, payload })
  }
}

const enrichPayloadWithPaymentData = ({ $w, selectedPaymentOption, payload }) => {
  // TODO: move PAYMENT_OPTIONS to forms-common and use it here
  let selectedItems = []

  switch (selectedPaymentOption) {
    case 'list':
      const itemsListPaymentFields = $w(`@${FIELDS.ROLE_FIELD_ITEMS_LIST}`)
      if (itemsListPaymentFields.length > 0) {
        selectedItems = _.compact(
          _.map(itemsListPaymentFields, (field) =>
            !_.isEmpty(field.value) ? { itemId: field.value } : null,
          ),
        )
      }
      break
    case 'custom':
      const customAmountPaymentFields = $w(`@${FIELDS.ROLE_FIELD_CUSTOM_AMOUNT}`)
      if (customAmountPaymentFields.length > 0) {
        selectedItems = _.compact(
          _.map(customAmountPaymentFields, (field) =>
            !_.isEmpty(field.value)
              ? {
                  itemId: field.connectionConfig.productId,
                  price: field.value.trim(),
                }
              : null,
          ),
        )
      }
      break
  }

  if (_.size(selectedItems) > 0) {
    payload.paymentFormDetails = {
      selectedItems,
    }
  }
}

const sendActivity = async (
  $w,
  {
    attachments,
    fields,
    wixWindow,
    formId,
    captchaToken = undefined,
    isDynamicPage,
  }: {
    attachments: Attachment[]
    fields
    wixWindow
    formId: string
    captchaToken: string | undefined
    isDynamicPage: boolean
  },
) => {
  const form = $w(`@${ROLE_FORM}`)
  const {
    emailId,
    secondEmailId,
    emailIds,
    labels,
    labelKeys,
    formName = '',
    selectedSiteUsersIds,
    inboxOptOut,
    doubleOptIn,
    selectedPaymentOption = 'single',
    hasDynamicPageData = false,
    plugins,
  } = form.connectionConfig

  const isPaymentForm = Boolean(_.find(plugins, (plugin) => plugin.id === FormPlugin.PAYMENT_FORM))

  const fieldsDto: Field[] = createFieldsDto({
    fields,
    attachments,
    options: { doubleOptIn },
    isPaymentForm,
  })
  const emailConfig: EmailConfig = createEmailConfig({
    emailIds: emailIds || [emailId, secondEmailId],
    selectedSiteUsersIds,
    inboxOptOut,
  })

  const labelIdentifiers = labelKeys
    ? {
        labelKeys: _.compact(labelKeys as string[]),
      }
    : {
        labelIds: _.compact(labels as string[]),
      }

  const payload: SubmitFormRequest = {
    formProperties: {
      formName,
      formId,
    },
    emailConfig,
    viewMode: wixWindow.viewMode,
    fields: fieldsDto,
    ...labelIdentifiers,
  }

  if (isDynamicPage && hasDynamicPageData) {
    enrichPayloadWithSubmissionMetadata({ payload })
  }

  enrichPayloadWithCaptchaField({ $w, payload })

  if (captchaToken) {
    enrichPayloadWithSecurityToken({ token: captchaToken, payload })
  }

  enrichPayloadWithPaymentData({ $w, selectedPaymentOption, payload })

  const shouldDisableRetry = _.has(payload, 'security')
  const baseUrl = getBaseUrl()

  return post<SubmitFormResponse>(
    baseUrl,
    '_api/wix-forms/v1/submit-form',
    payload,
    shouldDisableRetry,
  )
}
