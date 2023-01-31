import _ from 'lodash'

// TODO: Make this file more clearer to use (group stuff and export only the groups)

export const ROLE_FORM = 'form_Role'
export const ROLE_SUBMIT_BUTTON = 'button_Role'
export const ROLE_PREVIOUS_BUTTON = 'button_previous_Role'
export const ROLE_NEXT_BUTTON = 'button_next_Role'
export const ROLE_MESSAGE = 'message_Role'
export const ROLE_DOWNLOAD_MESSAGE = 'download_message_Role'
export const ROLE_LIMIT_MESSAGE = 'limit_message_Role'
export const ROLE_TITLE = 'title_Role'
export const ROLE_SUBTITLE = 'subtitle_Role'
export const INPUT_FIELDS_PREFIX = 'field_role_'
export const STEP_ROLE = 'step_Role'
export const THANK_YOU_STEP_ROLE = 'thank_you_step_Role'
export const LIMIT_SUBMISSIONS_STEP_ROLE = 'limit_submissions_step_Role'
export const AUTOFILL_MEMBER_EMAIL_ROLE = 'autofill-form-info-role'

export const NON_INPUT_FIELDS_ROLES = [
  ROLE_SUBMIT_BUTTON,
  ROLE_PREVIOUS_BUTTON,
  ROLE_NEXT_BUTTON,
  ROLE_MESSAGE,
  ROLE_LIMIT_MESSAGE,
  ROLE_DOWNLOAD_MESSAGE,
  ROLE_TITLE,
]

export const REGISTRATION_FIELDS = {
  // TODO: we  can take it from field definition
  ROLE_FIELD_REGISTRATION_FORM_LOGIN_EMAIL: `${INPUT_FIELDS_PREFIX}regForm_loginEmail`,
  ROLE_FIELD_REGISTRATION_FORM_PASSWORD: `${INPUT_FIELDS_PREFIX}regForm_password`,
  ROLE_FIELD_REGISTRATION_FORM_CHECKBOX_AGREE_TERMS: `${INPUT_FIELDS_PREFIX}regForm_checkboxAgreeTerms`,
  ROLE_FIELD_REGISTRATION_FORM_CHECKBOX_JOIN_COMMUNITY: `${INPUT_FIELDS_PREFIX}regForm_checkboxJoinCommunity`,
  ROLE_FIELD_REGISTRATION_FORM_LINK_TO_LOGIN_DIALOG: `${INPUT_FIELDS_PREFIX}regForm_linkToLoginDialog`,
  ROLE_FIELD_REGISTRATION_FORM_CODE_OF_CONDUCT: `${INPUT_FIELDS_PREFIX}regForm_codeOfConduct`,
  ROLE_FIELD_REGISTRATION_FORM_PRIVACY_POLICY: `${INPUT_FIELDS_PREFIX}regForm_privacyPolicy`,
}

export const REGISTRATION_FIELDS_ROLES = _.values(REGISTRATION_FIELDS)

export const FIELDS = {
  // TODO: We can take it from field definition
  ROLE_FIELD_TEXT: `${INPUT_FIELDS_PREFIX}text`,
  ROLE_FIELD_RATING: `${INPUT_FIELDS_PREFIX}rating`,
  ROLE_FIELD_RECAPTCHA: `${INPUT_FIELDS_PREFIX}recaptcha`,
  ROLE_FIELD_SIGNATURE: `${INPUT_FIELDS_PREFIX}signature`,
  ROLE_FIELD_TIME_PICKER: `${INPUT_FIELDS_PREFIX}time_picker`,
  ROLE_FIELD_TEXT_AREA: `${INPUT_FIELDS_PREFIX}text_area`,
  ROLE_FIELD_DATE: `${INPUT_FIELDS_PREFIX}date`,
  ROLE_FIELD_SELECT: `${INPUT_FIELDS_PREFIX}select`,
  ROLE_FIELD_RADIO_LIST: `${INPUT_FIELDS_PREFIX}radio_list`,
  ROLE_FIELD_ITEMS_LIST: `${INPUT_FIELDS_PREFIX}items_list`,
  ROLE_FIELD_CUSTOM_AMOUNT: `${INPUT_FIELDS_PREFIX}custom_amount`,
  ROLE_FIELD_FILE_UPLOAD: `${INPUT_FIELDS_PREFIX}file_upload`,
  ROLE_FIELD_CHECKBOX: `${INPUT_FIELDS_PREFIX}checkbox`,
  ROLE_FIELD_SUBSCRIBE: `${INPUT_FIELDS_PREFIX}subscribe`,
  ROLE_FIELD_AGREE_TERMS: `${INPUT_FIELDS_PREFIX}agree_terms`,
  ROLE_FIELD_CHECKBOX_GROUP: `${INPUT_FIELDS_PREFIX}checkbox_group`,
  ROLE_FIELD_AUTOCOMPLETE_ADDRESS: `${INPUT_FIELDS_PREFIX}autocomplete_address`,
  ROLE_FIELD_COMPLEX_PHONE_WIDGET: `${INPUT_FIELDS_PREFIX}complex_phone_widget`,
  ROLE_FIELD_COMPLEX_ADDRESS_WIDGET: `${INPUT_FIELDS_PREFIX}complex_address_widget`,
  ...REGISTRATION_FIELDS,
}

export const FIELDS_ROLES = Object.keys(FIELDS).map((fieldKey) => FIELDS[fieldKey])

export const FIELDS_ROLES_TO_APPEAR_BEFORE_USER_NEW_FIELD = [
  ..._.difference(FIELDS_ROLES, [FIELDS.ROLE_FIELD_REGISTRATION_FORM_LINK_TO_LOGIN_DIALOG]),
  ROLE_TITLE,
]

const hasDuplicates = (arr) => new Set(arr).size !== arr.length
if (hasDuplicates(FIELDS_ROLES)) {
  console.warn('FIELDS_ROLES cannot have duplicates!')
}

export const MESSAGES_STEPS_ROLES = [THANK_YOU_STEP_ROLE, LIMIT_SUBMISSIONS_STEP_ROLE]

export const ROLE_COMPLEX_PHONE_DROPDOWN = 'complex_phone_dropdown'
export const ROLE_COMPLEX_PHONE_TEXT = 'complex_phone_text'

export const ROLE_COMPLEX_ADDRESS_ADDRESS = 'complex_address_street'
export const ROLE_COMPLEX_ADDRESS_ADDRESS2 = 'complex_address_street_2'
export const ROLE_COMPLEX_ADDRESS_REGION = 'complex_address_state'
export const ROLE_COMPLEX_ADDRESS_ZIP_CODE = 'complex_address_zipcode'
export const ROLE_COMPLEX_ADDRESS_CITY = 'complex_address_city'
export const ROLE_COMPLEX_ADDRESS_COUNTRY = 'complex_address_country'
