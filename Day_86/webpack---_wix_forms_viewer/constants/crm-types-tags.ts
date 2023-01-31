export const CRM_TYPES = {
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  EMAIL: 'email',
  PHONE: 'phone',
  ADDRESS: 'address',
  DATE: 'date',
  BIRTHDATE: 'birthdate',
  COMPANY: 'company',
  POSITION: 'position',
  WEBSITE: 'website',
  COMPLEX_ADDRESS_STREET: 'streetAddress',
  COMPLEX_ADDRESS_STREET2: 'streetAddress2',
  COMPLEX_ADDRESS_CITY: 'city',
  COMPLEX_ADDRESS_REGION: 'region',
  COMPLEX_ADDRESS_ZIP_CODE: 'zipCode',
  COMPLEX_ADDRESS_COUNTRY: 'country',
}

export const TEXT_CRM_TYPES = [
  CRM_TYPES.FIRST_NAME,
  CRM_TYPES.LAST_NAME,
  CRM_TYPES.ADDRESS,
  CRM_TYPES.COMPANY,
  CRM_TYPES.POSITION,
]

export const CUSTOM_FIELD = 'customField'

export const CRM_TAGS = {
  OTHER: 'other',
  ANNIVERSARY: 'anniversary',
  MAIN: 'main',
  HOME: 'home',
  WORK: 'work',
  MOBILE: 'mobile',
  FAX: 'fax',
  BILLING: 'billing-address',
  SHIPPING: 'shipping-address',
  COMPANY: 'company',
  PERSONAL: 'personal',
  BIRTHDAY: 'birthday',
}

export const crmTypesTags = {
  email: [CRM_TAGS.MAIN, CRM_TAGS.HOME, CRM_TAGS.WORK, CRM_TAGS.OTHER],
  phone: [
    CRM_TAGS.MAIN,
    CRM_TAGS.HOME,
    CRM_TAGS.MOBILE,
    CRM_TAGS.WORK,
    CRM_TAGS.FAX,
    CRM_TAGS.OTHER,
  ],
  address: [CRM_TAGS.HOME, CRM_TAGS.WORK, CRM_TAGS.BILLING, CRM_TAGS.SHIPPING, CRM_TAGS.OTHER],
  website: [CRM_TAGS.COMPANY, CRM_TAGS.PERSONAL, CRM_TAGS.OTHER],
  date: [CRM_TAGS.BIRTHDAY, CRM_TAGS.ANNIVERSARY, CRM_TAGS.OTHER],
}
