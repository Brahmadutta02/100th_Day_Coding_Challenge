import _ from 'lodash'
import { siteStore } from '../stores/site-store'
import { RegisterBehaviorError } from '../errors'
import { addContactsValidation } from './contacts-validation'
import { addRegistrationFormValidation } from './registration-form-validation'
import { registerCaptchaFieldIfExists } from './captcha-field'
import { registerRulesIfExists } from './rules'
import { registerPaymentFieldsIfExists } from './payment-fields'
import { registerURLValidation } from './url-validation'
import { IController } from '../controllers/controllers'

const behaviors = [
  { name: 'Contacts Fields', func: addContactsValidation },
  { name: 'Registration Form', func: addRegistrationFormValidation },
  { name: 'Captcha', func: registerCaptchaFieldIfExists },
  { name: 'Rules', func: registerRulesIfExists },
  { name: 'Payment Fields', func: registerPaymentFieldsIfExists },
  { name: 'URL', func: registerURLValidation },
]

export const registerBehaviors = (controller: IController, components: WixCodeField[]) =>
  _.forEach(behaviors, (behaviorData) => {
    try {
      behaviorData.func(controller, components)
    } catch (err) {
      siteStore.captureException(new RegisterBehaviorError(err, behaviorData.name))
    }
  })
