import { FormPlugin } from '@wix/forms-common'
import {
  I$WWrapper,
  ILocation,
  ISeo,
  ISiteApis,
  IUserApis,
  IWixWindow,
} from '@wix/native-components-infra/dist/src/types/types'
import { ROLE_SUBMIT_BUTTON } from '../../constants/roles'
import { SubmitFormResponse } from '../../types/domain-types'
import { Attachment } from '../field-dto/field-dto'
import { findPlugin } from '../viewer-utils'
import { BaseController } from './base-controller'
import { MultiStepFormController } from './multi-step-form-controller'
import {
  isRegistrationFormEnabled,
  RegistrationFormController,
} from './registration-form-controller'

export interface IController {
  formId: string
  controllerSettings: ControllerSettings
  initialFields: { uniqueId; value }[]
  helpers: {
    wixLocation: ILocation
    wixSite: ISiteApis
    wixSeo: ISeo
    wixWindow: IWixWindow
    wixPay: any
    wixUsers: IUserApis
    wixAuthentication: any
  }
  $w: I$WWrapper
  $form
  $message
  $submitButton
  formTypes: FormPlugin[] // used by analytics to decide what kind of form it might be
  getFields: () => any[]
  getNumOfAttachments: () => number
  getAttachments: () => Promise<Attachment[]>
  validateFields: (fields: any[]) => any[]
  postSubmission: () => Promise<any>
  onLimitError: () => Promise<any>
  formReachLimit: () => Promise<any>
  execute: ({
    attachments,
    fields,
  }: {
    attachments: Attachment[]
    fields: any[]
    formId: string
  }) => Promise<SubmitFormResponse>
  getFieldsByRole: (role: string) => any[]
  getFieldsByRoles: (roles: string[]) => any[]
}

export const getController = (
  plugins: ComponentPlugin[],
  {
    $w,
    formId,
    controllerSettings,
    wixLocation,
    wixSite,
    wixSeo,
    wixWindow,
    wixPay,
    wixUsers,
    wixAuthentication,
    isPaymentForm,
  }: {
    $w: I$WWrapper
    formId: string
    controllerSettings: ControllerSettings
    wixLocation: ILocation
    wixSite: ISiteApis
    wixSeo: ISeo
    wixWindow: IWixWindow
    wixPay: any
    wixUsers: IUserApis
    wixAuthentication: any
    isPaymentForm: boolean
  },
): IController => {
  if (!$w(`@${ROLE_SUBMIT_BUTTON}`)[0]) {
    return null
  }

  if (findPlugin(plugins, FormPlugin.MULTI_STEP_FORM)) {
    return new MultiStepFormController(
      {
        $w,
        formId,
        controllerSettings,
        isPaymentForm,
      },
      { wixLocation, wixSite, wixSeo, wixWindow, wixPay, wixUsers, wixAuthentication },
    )
  }

  // for old users before plugins
  if (findPlugin(plugins, FormPlugin.REGISTRATION_FORM) || isRegistrationFormEnabled($w)) {
    return new RegistrationFormController(
      {
        $w,
        formId,
        controllerSettings,
        isPaymentForm,
      },
      { wixLocation, wixSite, wixSeo, wixWindow, wixPay, wixUsers, wixAuthentication },
    )
  }

  return new BaseController(
    {
      $w,
      formId,
      controllerSettings,
      isPaymentForm,
    },
    { wixLocation, wixSite, wixSeo, wixWindow, wixPay, wixUsers, wixAuthentication },
  )
}
