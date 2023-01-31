// @ts-nocheck
import { FormPlugin } from '@wix/forms-common'
import _ from 'lodash'
import { RavenStatic } from 'raven-js'
import { EVENTS, VIEWER_ORIGIN } from './constants/bi-viewer'
import { CRM_TYPES } from './constants/crm-types-tags'
import { FIELDS, ROLE_FORM } from './constants/roles'
import { getController, IController } from './viewer-app/controllers/controllers'
import { CorvidAPI } from './viewer-app/corvid-api'
import { ErrorName, FieldValidity, getRelevantError } from './viewer-app/errors'
import { getPhoneStringValueByType } from './viewer-app/field-dto/field-dto'
import { LIMIT_VIOLATION_ERROR } from './viewer-app/services/constants'
import { isLimitReached } from './viewer-app/services/form-limit-services'
import { isPaymentAllowed } from './viewer-app/services/payment-services'
import translations from './viewer-app/services/translations'
import { siteStore } from './viewer-app/stores/site-store'
import { submitUtils } from './viewer-app/submit-utils'
import { getAppVersion, getViewerSentryDSN } from './viewer-app/utils/utils'
import {
  componentStringify,
  escapeRegExp,
  findPlugin,
  innerText,
  isPreviewMode,
  isTemplate,
  shouldSendData,
} from './viewer-app/viewer-utils'
import { InitAppForPageFn, CreateControllerFn } from '@wix/yoshi-flow-editor'
import {
  I$WWrapper,
  IWidgetController,
  IWidgetControllerConfig,
  IWixAPI,
} from '@wix/native-components-infra/dist/src/types/types'

const ERROR_COLOR = '#FF4040'

let initialized = false

interface SubmitArgs {
  $w
  controller: IController
  corvidAPI: CorvidAPI
  isPaymentForm: boolean
}

const initRavenInstance = ({ platformServicesAPI, scopedGlobalSdkApis, dsn }): RavenStatic => {
  return platformServicesAPI.monitoring.createMonitor(dsn, (event) => {
    const errors = _.chain(_.get(event, 'exception.values'))
      .map((exception) => (exception.message ? exception.message : exception.value))
      .compact()
      .value()

    event.fingerprint = errors.length > 0 ? [...errors] : ['{{ default }}']

    const appVersion = getAppVersion()
    const localEnvironment = appVersion === 'local-development'
    const isStaging =
      !!_.get(scopedGlobalSdkApis, 'location.query.viewerPlatformOverrides') ||
      !!_.get(scopedGlobalSdkApis, 'location.query.thunderboltStage') ||
      !!_.get(scopedGlobalSdkApis, 'location.query.thunderboltTag')
    const isQAEnvironment =
      _.get(scopedGlobalSdkApis, 'location.query.isqa') === 'true' || isStaging
    const environment = localEnvironment ? 'Dev' : isQAEnvironment ? 'QA' : 'Prod'

    event.environment = environment

    return event
  })
}

export const initAppForPage: InitAppForPageFn = async (
  initAppParams,
  platformApi,
  scopedGlobalSdkApis,
  platformServicesAPI,
) => {
  if (initialized) {
    return Promise.resolve()
  }

  initialized = true

  const ravenInstance = initRavenInstance({
    platformServicesAPI,
    scopedGlobalSdkApis,
    dsn: getViewerSentryDSN(),
  })

  try {
    await siteStore.init({
      ravenInstance,
      initAppParams,
      platformApi,
      scopedGlobalSdkApis,
      platformServicesAPI,
      translationsFactory: translations,
    })
  } catch (error) {
    ravenInstance.captureException(error)
    ravenInstance.setTagsContext()
    ravenInstance.setExtraContext()

    throw error
  }

  return Promise.resolve()
}

const getFormName = ($w, formId) => {
  const form = $w(`@${ROLE_FORM}`)

  return {
    form_comp_id: formId,
    form_name: _.get(form, 'connectionConfig.formName'),
    template: _.get(form, 'connectionConfig.preset', 'unknown'),
  }
}

const paymentStatusIsValid = (status) => ['Successful', 'Offline', 'Pending'].includes(status)

const getFormParamsForBi = ($w, numOfAttachments: number, wixLocation, formId: string) => ({
  num_of_attachments: numOfAttachments.toString(),
  form_url: wixLocation.url || '',
  ...getFormName($w, formId),
})

const logPublishSitePopupOpened = ($w, formId) =>
  siteStore.log({
    evid: EVENTS.PUBLISH_SITE_PANEL_OPENED,
    form_comp_id: getFormName($w, formId).form_comp_id,
    builderOrigin: VIEWER_ORIGIN,
  })

const getSubmitErrorParamsForBi = ({
  $w,
  numOfAttachments,
  wixLocation,
  reason,
  reason_body,
  formId,
}: {
  $w
  numOfAttachments: number
  wixLocation
  reason: string
  reason_body: string
  formId: string
}) => ({
  reason,
  reason_body,
  ...getFormParamsForBi($w, numOfAttachments, wixLocation, formId),
})

const showFormError = ({ message, defaultErrorMessage, error }) => {
  if (!_.get(message, 'html')) {
    return
  }

  const colorRegExp = /color: ?[^;"]+/

  let htmlErrorMessage = getRelevantError({ error, defaultErrorMessage })

  if (message.html.indexOf(colorRegExp) === -1) {
    htmlErrorMessage = `<span style="color: ${ERROR_COLOR}">${htmlErrorMessage}</span>`
  }
  message.html = message.html
    .replace(colorRegExp, `color: ${ERROR_COLOR}`)
    .replace(new RegExp(`>${escapeRegExp(innerText(message.html))}`), `>${htmlErrorMessage}`)
  message.show()
}

const resetCrucialFields = ($w) => {
  const captchaField = $w(`@${FIELDS.ROLE_FIELD_RECAPTCHA}`)

  if (captchaField.length > 0) {
    captchaField.reset()
  }
}

const onSubmit = async ({ $w, controller, corvidAPI, isPaymentForm }: SubmitArgs) => {
  let fields = []
  let $submitButton
  const { wixLocation, wixSeo, wixWindow, wixPay } = controller.helpers

  const postSubmitActions = (shouldShowSubmissionSuccess = true, attachments = []) => {
    if (shouldShowSubmissionSuccess) {
      corvidAPI.fireFormSubmitted({ fields, attachments })
      submitUtils.resetFields(fields, controller.initialFields, controller)
      controller.postSubmission()
    }

    if (!isTemplate(wixLocation)) {
      submitUtils.sendWixAnalytics({ wixSeo, wixWindow, controller })
    }
  }

  const numOfAttachments = controller.getNumOfAttachments()

  try {
    siteStore.log({
      evid: EVENTS.USER_CLICKS_SUBMIT,
      ...getFormParamsForBi($w, numOfAttachments, wixLocation, controller.formId),
    })

    $submitButton = submitUtils.getSubmitButton($w)
    $submitButton.disable()

    fields = controller.getFields()
    // if (!controller.controllerSettings.ok) {
    //   throw new SubmitFailedError(controller.controllerSettings.err)
    // }

    const invalidFields = submitUtils.validateFields({ fields, controller })

    if (invalidFields.length !== 0) {
      throw new FieldValidity({ fields })
    }

    const shouldShowPublishSitePopupWhenInPreviewMode = async () => {
      if (isPreviewMode(wixWindow) && isPaymentForm && siteStore.initAppParams.url) {
        return isPaymentAllowed()
      }
      return false
    }

    if (await shouldShowPublishSitePopupWhenInPreviewMode()) {
      logPublishSitePopupOpened($w, controller.formId)
      const publishSitePopupUrl = () =>
        siteStore.initAppParams.url
          .split('/')
          .slice(0, -3)
          .concat([
            'wix-form-builder',
            '1.4776.0',
            'assets',
            'statics',
            `viewer-publish-site-panel.html`,
          ])
          .join('/')

      await wixWindow.openModal(
        `${publishSitePopupUrl()}?msid=${siteStore.platformServices.bi.metaSiteId}&isNewModal=true`,
        {
          width: 600,
          height: 247,
          theme: 'BARE',
        },
      )
      $submitButton.enable()
      return false
    }

    const attachments = await controller.getAttachments()

    if (!corvidAPI.fireFormSubmit({ fields, attachments, controller })) {
      $submitButton.enable()

      siteStore.log({
        evid: EVENTS.SUBMISSION_FAILURE,
        ...getSubmitErrorParamsForBi({
          $w,
          numOfAttachments,
          wixLocation,
          reason: 'onWixFormSubmit Hook',
          reason_body: 'aborted submission due to hook request',
          formId: controller.formId,
        }),
      })
      return false
    }

    if (shouldSendData(wixLocation)) {
      const serverResponse = await controller.execute({
        attachments,
        fields,
        formId: controller.formId,
      })

      let shouldShowSuccessMessage = true

      const orderId = _.get(serverResponse, 'orderId')

      if (orderId) {
        const userInfo = getUserInfo(fields)
        const paymentResponse = await wixPay.startPayment(orderId, {
          userInfo,
          allowManualPayment: true,
        })
        if (!paymentStatusIsValid(paymentResponse.status)) {
          shouldShowSuccessMessage = false
        }
      }

      const extraBiFields: any = {
        isfp: !!controller.$form.isfp,
        // timeToSubmit: siteStore.timeSinceLoad(controller.formId),
      }

      const submissionId = _.get(serverResponse, 'submissionId')

      if (submissionId) {
        extraBiFields.submissionId = submissionId
      }

      if (siteStore.platformServices.bi.isjp !== undefined) {
        extraBiFields.isjp = siteStore.platformServices.bi.isjp
      }

      if (siteStore.platformServices.bi.btype !== undefined) {
        extraBiFields.btype = siteStore.platformServices.bi.btype
      }

      // this event should be after all server requests (wix forms + wix data)
      siteStore.log({
        evid: EVENTS.SUBMISSION_SUCCESS,
        ...getFormParamsForBi($w, numOfAttachments, wixLocation, controller.formId),
        ...extraBiFields,
      })

      postSubmitActions(shouldShowSuccessMessage, attachments)
      $submitButton.enable()
    } else {
      postSubmitActions()
      $submitButton.enable()
      return true
    }
  } catch (error) {
    const errorName = _.get(error, 'name', 'unknown reason')
    const errorMessage = _.get(error, 'message', 'unknown message')
    const errorData = _.get(error, 'data', 'unknown data')

    const formMetadata = _.pick(_.get(controller.$form, 'connectionConfig'), [
      'formName',
      'plugins',
      'preset',
    ])
    const preset = _.get(formMetadata, 'preset')

    const isLimitReachedError =
      errorName === ErrorName.FetchError && errorData === LIMIT_VIOLATION_ERROR

    const isFieldValidityError = errorName === ErrorName.FieldValidity

    const isCaptchaRequiredError =
      errorName === ErrorName.CaptchaRequiredError ||
      errorName === ErrorName.ClientCaptchaRequiredError

    if (isLimitReachedError) {
      controller.onLimitError()
    }

    if (!isFieldValidityError && !isLimitReachedError) {
      siteStore.captureException(error, {
        extra: {
          formMetadata,
        },
        ...(preset
          ? {
              tags: {
                preset,
              },
            }
          : {}),
      })
    }

    if ($submitButton) {
      $submitButton.enable()
    }

    corvidAPI.fireSubmitError({ error })
    if (!isFieldValidityError && !isLimitReachedError && !isCaptchaRequiredError) {
      resetCrucialFields($w)
      showFormError({
        message: controller.$message,
        defaultErrorMessage: siteStore.t('submitFailed'),
        error,
      })
    }

    siteStore.log({
      evid: EVENTS.SUBMISSION_FAILURE,
      ...getSubmitErrorParamsForBi({
        $w,
        numOfAttachments,
        wixLocation,
        reason: errorName,
        reason_body: errorMessage,
        formId: controller.formId,
      }),
    })
  }
}

const getUserInfo = (fields) => {
  const wantedCrmTypes = [
    CRM_TYPES.FIRST_NAME,
    CRM_TYPES.LAST_NAME,
    CRM_TYPES.PHONE,
    CRM_TYPES.EMAIL,
  ]

  const valueHandler = (crmType, value, fieldType) => {
    switch (crmType) {
      case CRM_TYPES.PHONE:
        return getPhoneStringValueByType(value, fieldType)
      default:
        return value
    }
  }

  const userInfo = fields.reduce((acc, field) => {
    const {
      connectionConfig: { crmType, fieldType },
      value,
    } = field
    if (!_.isEmpty(value) && wantedCrmTypes.includes(crmType)) {
      acc[crmType] = valueHandler(crmType, value, fieldType)
    }
    return acc
  }, {})

  return userInfo
}

const registerSubmitButtonIfExists = (submitArgs: SubmitArgs) => {
  const $submitButton = submitUtils.getSubmitButton(submitArgs.$w)

  if (!$submitButton) {
    return
  }

  if ($submitButton.onClick) {
    $submitButton.onClick(async () => {
      if (siteStore.isEnabled('specs.crm.FormsViewerSubmitButtonLoadingState')) {
        submitArgs.controller.startSubmitButtonLoadingState()
      }

      siteStore.captureBreadcrumb({
        message: 'submit form',
        category: 'onClick',
        data: {
          formId: submitArgs.controller.formId,
        },
      })

      await onSubmit(submitArgs)

      if (siteStore.isEnabled('specs.crm.FormsViewerSubmitButtonLoadingState')) {
        submitArgs.controller.stopSubmitButtonLoadingState()
      }
    })
  } else {
    const submitButtonSelector = submitArgs.controller.$submitButton
    siteStore.captureException(new Error('Missing click event on submit button'), {
      extra: {
        componentDataFromEvent: componentStringify($submitButton),
        componentDataFromController: componentStringify(_.get(submitButtonSelector, '[0]', {})),
        parentComponentDataFromController: componentStringify(submitButtonSelector),
        buttonFoundFromController: _.size(submitArgs.controller.$submitButton),
      },
    })
  }
}

const logConnections = (controllerConfig) => {
  try {
    const connections = _.get(controllerConfig, 'connections')
    const components = _.map(connections, (con) => ({ role: con.role, compId: con.compId }))
    siteStore.captureBreadcrumb({
      message: `connections:${_.get(controllerConfig, 'compId')}`,
      category: 'pageReady',
      data: { components, count: _.size(components) },
    })
  } catch (err) {
    siteStore.captureException(new Error('Failed to log connections'), {
      extra: { err },
    })
  }
}

const pageReadyImpl = async ({
  $w,
  payload,
  corvidAPI,
  controllerConfig,
}: {
  $w: I$WWrapper
  payload: IWixAPI
  corvidAPI: CorvidAPI
  controllerConfig: IWidgetControllerConfig
}) => {
  try {
    if (!$w(`@${ROLE_FORM}`).length) {
      return
    }

    logConnections(controllerConfig)

    siteStore.appLoadStarted()

    const {
      appParams: { instanceId },
      externalId,
    } = controllerConfig
    const controllerSettings = await siteStore.loadSettings({ externalId, instanceId })

    const {
      window: wixWindow,
      location: wixLocation,
      user: wixUsers,
      site: wixSite,
      seo: wixSeo,
      // @ts-expect-error
      pay: wixPay,
      // @ts-expect-error
      authentication: wixAuthentication,
    } = payload

    const form = _.get($w(`@${ROLE_FORM}`), '[0]')

    try {
      const connectionConfig = _.get(form, 'connectionConfig')
      if (!connectionConfig) {
        const $formFromController = _.get(controllerConfig.$w(`@${ROLE_FORM}`), '[0]')
        siteStore.captureException(new Error('Missing connectionConfig on form container'), {
          extra: {
            componentDataFromEvent: componentStringify(form),
            componentDataFromController: componentStringify($formFromController),
          },
        })
      }
    } catch (err) {
      siteStore.captureException(
        new Error('Failed to log missing connectionConfig on form container'),
        {
          extra: { err },
        },
      )
    }

    const useControllerId = _.get(form, 'connectionConfig.useControllerId', false)

    const plugins = _.get(form, 'connectionConfig.plugins')
    const paymentPlugin = findPlugin(plugins, FormPlugin.PAYMENT_FORM)
    const limitSubmissionsPlugin = findPlugin(plugins, FormPlugin.LIMIT_FORM_SUBMISSONS)
    const isPaymentForm = !!paymentPlugin && !!paymentPlugin.payload

    const formId = useControllerId ? controllerConfig.compId : form.uniqueId
    const formController = getController(plugins, {
      $w,
      formId,
      controllerSettings,
      wixLocation,
      wixPay,
      wixWindow,
      wixSite,
      wixSeo,
      wixUsers,
      wixAuthentication,
      isPaymentForm,
    })

    if (!formController) {
      return
    }

    if (limitSubmissionsPlugin) {
      const isReached = await isLimitReached(formId, siteStore)
      if (isReached) {
        await formController.formReachLimit()
      }
    }

    const submitArgs: SubmitArgs = {
      $w,
      isPaymentForm,
      corvidAPI,
      controller: formController,
    }

    registerSubmitButtonIfExists(submitArgs)

    siteStore.appLoaded(formId)
  } catch (err) {
    siteStore.captureException(err)
  }
}

export const createController: CreateControllerFn = ({ controllerConfig }) => {
  const { $w, type, wixCodeApi } = controllerConfig
  const corvidAPI = new CorvidAPI($w, type as ControllerType)
  const initialController: IWidgetController = {
    pageReady: () => pageReadyImpl({ $w, payload: wixCodeApi, corvidAPI, controllerConfig }),
  }
  return Promise.resolve(corvidAPI.createController(initialController))
}
