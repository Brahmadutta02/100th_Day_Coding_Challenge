import _ from 'lodash'
import { CRM_TYPES } from '../constants/crm-types-tags'
import { AUTOFILL_MEMBER_EMAIL_ROLE, ROLE_SUBMIT_BUTTON } from '../constants/roles'
import { UploadSignatureResponse } from '../types/domain-types'
import { IController } from './controllers/controllers'
import { TrackEventError, UploadFileError, UploadSignatureError } from './errors'
import { Attachment } from './field-dto/field-dto'
import { post } from './services/fetch-utils'
import { siteStore } from './stores/site-store'
import {
  getBaseUrl,
  getFieldValueByCrmType,
  isCaptchaField,
  isCheckbox,
  isComplexAddress,
  isComplexPhone,
  isDatePicker,
  isSignatureField,
  isTimePicker,
  isUploadButton,
} from './viewer-utils'

class SubmitUtils {
  private onFieldsReset: (() => any)[]

  constructor() {
    this.onFieldsReset = []
  }

  public getSubmitButton($w) {
    return $w(`@${ROLE_SUBMIT_BUTTON}`)[0]
  }

  public validateFields({ fields, controller }: { fields: any[]; controller: IController }): any[] {
    fields.forEach((field) => {
      if (field.collapsed) {
        return
      }

      if (field.updateValidityIndication) {
        field.updateValidityIndication()
      }
    })

    const invalidFields = controller.validateFields(fields)

    if (invalidFields.length > 0) {
      if (invalidFields[0].scrollTo) {
        invalidFields[0].scrollTo()
      }
    }

    return invalidFields
  }

  public async getAttachments(fields): Promise<Attachment[]> {
    const uploadButtons = fields.filter((field) => isUploadButton(field) && field.value.length > 0)

    if (!uploadButtons.length) {
      return Promise.resolve([])
    }

    siteStore.interactionStarted('upload-files')

    try {
      const attachments: Attachment[] = await Promise.all(
        uploadButtons.map(
          async (uploadButtonField): Promise<Attachment> => {
            const { url, width, height, mediaId, title } = await uploadButtonField.startUpload()
            return {
              url,
              name: uploadButtonField.value[0].name,
              value: '',
              uniqueId: uploadButtonField.uniqueId,
              width,
              height,
              mediaId,
              title,
            }
          },
        ),
      )

      siteStore.interactionEnded('upload-files')

      return attachments
    } catch (err) {
      throw new UploadFileError(err)
    }
  }

  private async _startSignatureUpload({ formId, signatureField, name }): Promise<Attachment> {
    const { value, uniqueId } = signatureField
    const baseUrl = getBaseUrl()

    const data = await post<UploadSignatureResponse>(baseUrl, '_api/wix-forms/v1/media/signature', {
      formId,
      signature: value,
      namePrefix: name,
    })

    return {
      url: data.url,
      name: data.name,
      value,
      uniqueId,
    }
  }

  private async _getSignatureName(fields) {
    return (
      getFieldValueByCrmType(fields, CRM_TYPES.LAST_NAME) ||
      getFieldValueByCrmType(fields, CRM_TYPES.EMAIL) ||
      getFieldValueByCrmType(fields, CRM_TYPES.FIRST_NAME) ||
      ''
    )
  }

  public async getSignatureAttachments({
    currentFields,
    formId,
    allFields,
  }: {
    currentFields: any[]
    formId: string
    allFields?: any[]
  }): Promise<Attachment[]> {
    const signatureFields = currentFields.filter(
      (field) => isSignatureField(field) && field.value.length > 0,
    )

    if (!signatureFields.length) {
      return Promise.resolve([])
    }

    siteStore.interactionStarted('upload-signatures')

    const signatureName = await this._getSignatureName(allFields || currentFields)

    try {
      const data: Attachment[] = await Promise.all(
        signatureFields.map((signatureField) =>
          this._startSignatureUpload({
            formId,
            signatureField,
            name: signatureName,
          }),
        ),
      )

      siteStore.interactionEnded('upload-signatures')

      return data
    } catch (e) {
      throw new UploadSignatureError(e)
    }
  }

  public sendWixAnalytics({ wixWindow, wixSeo, controller }) {
    const currentPageName = _.trim(_.get(_.split(wixSeo.title, '|'), '[0]'))

    if (currentPageName === '') {
      return
    }

    let extraParams = {}
    let label = `Page Name: ${currentPageName}`

    try {
      const formTypes = controller.formTypes
      extraParams = {
        origin: 'Wix Forms',
        formId: controller.formId,
        category: formTypes.length > 0 ? formTypes.join(',') : 'normal',
      }

      const formName = _.get(controller, '$form.connectionConfig.formName')
      label = formName ? `${label}; Form Name: ${formName}` : label
    } catch (err) {
      const customError = new TrackEventError(err)
      siteStore.captureException(customError)
    }

    wixWindow.trackEvent('Lead', {
      label,
      ...extraParams,
    })
  }

  public resetFields(fields, initialFields, controller: IController) {
    const membersAutofillField = _.get(
      controller.getFieldsByRole(AUTOFILL_MEMBER_EMAIL_ROLE),
      '[0]',
      {},
    )

    fields.forEach((field) => {
      if (isUploadButton(field) || isCaptchaField(field)) {
        if ('reset' in field) {
          field.reset()
        }
        return
      }

      if (isSignatureField(field)) {
        field.clear()
        return
      }

      if (isTimePicker(field)) {
        const initialTimeField = _.find(initialFields, { uniqueId: field.uniqueId })
        field.value = initialTimeField.value || ''
        field.resetValidityIndication()
        return
      }

      if (isDatePicker(field) || isComplexPhone(field)) {
        const initialDateField = _.find(initialFields, { uniqueId: field.uniqueId })
        field.value = initialDateField.value || null
        field.resetValidityIndication()
        return
      }

      if (isComplexAddress(field)) {
        const initialAddressField = _.find(initialFields, { uniqueId: field.uniqueId })

        field.value = initialAddressField.value || null
        field.resetValidityIndication()

        return
      }

      if (isCheckbox(field)) {
        field.checked = false
      } else {
        field.value = null
      }

      if (field.uniqueId === membersAutofillField.uniqueId) {
        const initialFieldValue = _.find(initialFields, { uniqueId: field.uniqueId })
        field.value = initialFieldValue.value
      }

      if ('resetValidityIndication' in field) {
        field.resetValidityIndication()
      }
    })

    this._runOnFieldsReset()
  }

  public registerOnFieldsReset(cb) {
    if (_.isFunction(cb)) {
      this.onFieldsReset.push(cb)
    }
  }

  private _runOnFieldsReset() {
    _.forEach(this.onFieldsReset, (cb) => {
      cb()
    })
  }
}

export const submitUtils = new SubmitUtils()
