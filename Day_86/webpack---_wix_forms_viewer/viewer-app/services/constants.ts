// TODO: There is no payment forms in EditorX for now but we need to change it to use editorx.com domain when needed

const FORMS_URL = 'https://editor.wix.com/_api/wix-form-builder-web'

export const PLATFORMIZED_FORMS_URL = `${FORMS_URL}/v1`
export const PREMIUM_RESTRICTIONS_ENDPOINT = `premium/restrictions`

export const PREMIUM_STORE_URL = 'https://editor.wix.com/_api/store/v1'
export const FEATURES_MANAGER_ENDPOINT = '/_api/premium-features-manager/v1'
export const ASCEND_PRODUCT_ID = '73988963-5f5f-4f61-b6a1-fd004df31b00'

export const PAYMENT_RESTRICTION = 'PAYMENT_FORM'
export const PAYMENT_FEATURE = 'accept_payments_on_form'

export const DOMAIN_REGEX =
  '^(?:[a-z0-9](?:(?:[a-z0-9](?:[\\_]*[a-z0-9])*){1,61})?\\.)+[a-z0-9]{1,61}[a-z0-9]'
export const URL_REGEX = '^((https?|ftp)://)?[^\\s/$.?#]*\\.[^\\s]*$'
export const EMAIL_REGEX = new RegExp(
  /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])/,
)

export const MEMBER_ALREADY_EXISTS_KEY = 'registrationForm.error.memberAlreadyExists'
export const INVALID_PASSWORD_KEY = 'registrationForm.error.invalidPassword'
export const GENERAL_REGISTRATION_ERROR_MESSAGE_KEY = 'registrationForm.error.general'

export const LIMIT_REACHED = 'LIMIT_REACHED'
export const LIMIT_VIOLATION_ERROR = 'Violation of form limit rules'
export const CAPTCHA_REQUIRED_ERROR = 'CAPTCHA is required'
