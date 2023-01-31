import { SuccessActionTypes } from '@wix/forms-common'
import _ from 'lodash'
import { EVENTS } from '../../constants/bi-viewer'
import {
  LIMIT_SUBMISSIONS_STEP_ROLE,
  ROLE_NEXT_BUTTON,
  ROLE_PREVIOUS_BUTTON,
  STEP_ROLE,
  THANK_YOU_STEP_ROLE,
} from '../../constants/roles'
import { registerBehaviors } from '../behaviors'
import { Attachment } from '../field-dto/field-dto'
import { siteStore } from '../stores/site-store'
import { submitUtils } from '../submit-utils'
import {
  isDatePicker,
  isSignatureField,
  isUploadButton,
  replaceMessageInnerText,
  shouldSendData,
} from '../viewer-utils'
import { BaseController } from './base-controller'

export class MultiStepFormController extends BaseController {
  private statesFields: { [uniqueId: string]: any[] }
  private fieldsValues: { [uniqueId: string]: any }
  private onNavigationEnd: Promise<void>

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
    super(
      { $w, formId, controllerSettings, isPaymentForm },
      { wixLocation, wixSite, wixSeo, wixWindow, wixPay, wixUsers, wixAuthentication },
    )
  }

  protected _init() {
    super._init()
    this.fieldsValues = {}
    this.onNavigationEnd = Promise.resolve()
    this.statesFields = this.orderedStates.reduce((acc, { uniqueId }) => {
      acc[uniqueId] = []
      return acc
    }, {})
    this._saveCurrentStateRenderedFields()

    this.$w(`@${ROLE_NEXT_BUTTON}`).forEach((button) => {
      button.onClick(() => {
        this.onNavigationEnd = this._navigateToNextState(button)
      })
    })
    this.$w(`@${ROLE_PREVIOUS_BUTTON}`).forEach((button) => {
      button.onClick(() => {
        this.onNavigationEnd = this._navigateToPreviousStep(button)
      })
    })
    const allComponents = _.compact([...this.fields, _.first(this.$submitButton)])
    registerBehaviors(this, allComponents)
  }

  private get currentStateId() {
    return this.$form.currentState.uniqueId
  }

  protected get isMultiStepForm() {
    return true
  }

  private get currentFields() {
    return this.statesFields[this.currentStateId]
  }

  private _saveCurrentStateRenderedFields() {
    if (!this.statesFields[this.currentStateId].length) {
      this.statesFields[this.currentStateId] = this.fields.filter((field) => {
        if (siteStore.isEnabled('specs.forms.FixFieldsInMultiStateBox')) {
          return this._isInCurrentState(field)
        }
        return field.rendered
      })
    }
  }

  private _isInCurrentState(field) {
    const uniqueId = field?.parent?.uniqueId
    if (!uniqueId) {
      return false
    }
    if (uniqueId === this.$form.uniqueId) {
      return false
    }
    if (uniqueId === this.currentStateId) {
      return true
    }
    return this._isInCurrentState(field?.parent)
  }

  private async _navigateToNextState($nextButton): Promise<void> {
    siteStore.interactionStarted('next-step')
    $nextButton.disable()
    siteStore.log(this._getStepParamsForBi('next'))
    await this.onNavigationEnd
    const invalidFieldsInStep = this._validateCurrentStateFields()

    if (invalidFieldsInStep.length === 0) {
      if (shouldSendData(this.helpers.wixLocation)) {
        await this._uploadAttachmentsInCurrentState()
      }
      await this._navigateToStepByOffset(1)
    }

    $nextButton.enable()
    siteStore.interactionEnded('next-step')
  }

  private async _navigateToPreviousStep($previousButton) {
    siteStore.interactionStarted('previous-step')
    $previousButton.disable()
    siteStore.log(this._getStepParamsForBi('back'))

    await this.onNavigationEnd
    await this._navigateToStepByOffset(-1)

    $previousButton.enable()
    siteStore.interactionEnded('previous-step')
  }

  private async _uploadAttachmentsInCurrentState() {
    const unsavedFields = this.currentFields.filter(({ uniqueId, value }) => {
      return (
        !this.attachments[uniqueId] ||
        (value[0] && value[0].name !== this.attachments[uniqueId].name)
      )
    })

    if (unsavedFields.length) {
      const attachments = await submitUtils.getAttachments(unsavedFields)

      attachments.forEach((attachment) => {
        this.attachments[attachment.uniqueId] = attachment
      })
    }

    // Upload signature attachments for every step change
    const signatureAttachments = await submitUtils.getSignatureAttachments({
      currentFields: this.currentFields,
      allFields: this.getFields(),
      formId: this.formId,
    })

    signatureAttachments.forEach((attachment) => {
      this.attachments[attachment.uniqueId] = attachment
    })

    // Remove fields cached data for signature fields when current signature field is empty and was signed before
    this.currentFields.forEach((field) => {
      const isSignatureFieldPreviouslySigned =
        this.attachments[field.uniqueId] && isSignatureField(field) && field.value === ''

      if (isSignatureFieldPreviouslySigned) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.attachments[field.uniqueId]
      }
    })
  }

  private _removeSignatureValueOnNavigationBack() {
    this.currentFields.forEach((field) => {
      if (isSignatureField(field)) {
        field.clear()
        if (this.attachments[field.uniqueId]) {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete this.attachments[field.uniqueId]
        }
      }
    })
  }

  private _saveCurrentStateFieldsValues() {
    this.currentFields
      .filter(isDatePicker)
      .forEach(({ value, uniqueId }) => (this.fieldsValues[uniqueId] = value))
  }

  private _populateFieldsValues(fields: any[]) {
    fields.forEach((field) => {
      if (this.fieldsValues[field.uniqueId]) {
        field.value = this.fieldsValues[field.uniqueId]
      }
    })
  }

  private _populateCurrentStateFieldsValues() {
    return this._populateFieldsValues(this.currentFields)
  }

  private async _navigateToStepByOffset(offsetIndex: number): Promise<void> {
    const states = this.orderedStates
    const stepsOrderIds = _.get(this.$form, 'connectionConfig.stepsOrderIds')

    let nextState

    if (stepsOrderIds) {
      const currentStateIndex = _.findIndex(
        stepsOrderIds,
        (stepId) => stepId === this.currentStateId,
      )

      const nextStateId = stepsOrderIds[currentStateIndex + offsetIndex]
      nextState = _.find(states, { uniqueId: nextStateId })
    }

    if (offsetIndex < 0) {
      this._removeSignatureValueOnNavigationBack()
    }

    if (!nextState) {
      const stateIdx = this.currentStateIdx
      nextState = states[stateIdx + offsetIndex]
    }

    if (nextState) {
      this._saveCurrentStateFieldsValues()
      await this.$form.changeState(nextState)
      this._saveCurrentStateRenderedFields()
      this._populateCurrentStateFieldsValues()
      if (nextState.scrollTo) {
        nextState.scrollTo()
      }
    }
  }

  private async _navigateToLimitState() {
    const limitStep = _.get(this.$w(`@${LIMIT_SUBMISSIONS_STEP_ROLE}`), '[0]')
    this.$form.changeState(limitStep)
  }

  private _getStepParamsForBi(action) {
    const states = this.$w(`@${STEP_ROLE}`)
    const currentState = _.find(states, { uniqueId: this.currentStateId })
    const stateIdx = this.currentStateIdx

    return {
      evid: EVENTS.USER_CLICKS_NAVIGATION_BUTTONS,
      form_comp_id: this.formId,
      step_no: stateIdx + 1,
      step_name: _.get(currentState, 'connectionConfig.title'),
      action,
      total_number_of_steps: states.length,
    }
  }

  // ordered states does not contain connectionConfig data
  private get orderedStates() {
    return this.$form.states
  }

  private get currentStateIdx() {
    return _.findIndex(this.orderedStates, {
      uniqueId: this.currentStateId,
    })
  }

  private _validateCurrentStateFields(): any[] {
    const fields = this.currentFields
    fields.forEach((field) => field.updateValidityIndication && field.updateValidityIndication())
    const invalidFields = this.validateFields(fields)

    if (invalidFields.length > 0) {
      if (invalidFields[0].scrollTo) {
        invalidFields[0].scrollTo()
      }
    }

    return invalidFields
  }

  public getFields(): any[] {
    const fields = _.flatten(
      _.values(_.omit(this.statesFields, this.$w(`@${THANK_YOU_STEP_ROLE}`).uniqueId)),
    )
    this._populateFieldsValues(fields)
    return fields
  }

  public getNumOfAttachments() {
    const uploadFields = _.filter(this.getFields(), isUploadButton)
    return uploadFields.reduce((acc, field) => {
      if (this.attachments[field.uniqueId] || field.value.length > 0) {
        return acc + 1
      }
      return acc
    }, 0)
  }

  public async getAttachments(): Promise<Attachment[]> {
    await this._uploadAttachmentsInCurrentState()
    return _.values(this.attachments)
  }

  async formReachLimit() {
    if (_.get(this.limitMessage, 'expand')) {
      await this.limitMessage.expand()
    }

    return this._navigateToLimitState()
  }

  onLimitError() {
    return this.formReachLimit()
  }

  async postSubmission() {
    const { successActionType } = this.$form.connectionConfig
    switch (successActionType) {
      case SuccessActionTypes.LINK:
      case SuccessActionTypes.EXTERNAL_LINK:
        return super.postSubmission()

      case SuccessActionTypes.DOWNLOAD_DOCUMENT:
        await super.postSubmission()
        return this._navigateToStepByOffset(1)

      default:
        const hasMessageContent = _.get(this.$message, 'html', undefined) !== undefined
        if (hasMessageContent) {
          replaceMessageInnerText(
            this.$message,
            (innerText) => `<span role="alert">${innerText}</span>`,
          )
          await this.$message.show()
        }
        return this._navigateToStepByOffset(1)
    }
  }
}
