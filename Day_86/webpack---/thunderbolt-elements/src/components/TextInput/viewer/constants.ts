export const TranslationKeys = {
  NAMESPACE: 'Text_Input',
  PHONE_FORMAT_LENGTH_VALIDATION_ERROR:
    'text_input_phone_format_length_validation_error',
  PHONE_FORMAT_LENGTH_VALIDATION_ERROR_DEFAULT:
    'Please enter a phone number with {digits} digits',
  PHONE_FORMAT_DEFAULT_VALIDATION_ERROR:
    'text_input_phone_format_default_validation_error',
  PHONE_FORMAT_DEFAULT_VALIDATION_ERROR_DEFAULT:
    'Please enter between 4 to 17 digits. You can include hyphens (-) or start with a (+), e.g., 555-123-4567 or +(222)987654321',
  PHONE_FORMAT_COMPLEX_PHONE_DEFAULT_VALIDATION_ERROR:
    'text_input_phone_format_complex_phone_default_validation_error',
  PHONE_FORMAT_COMPLEX_PHONE_DEFAULT_VALIDATION_ERROR_DEFAULT:
    'Please enter between 4 to 17 digits. You can include dividers (-), e.g., 555-123-4567.',
} as const;

export const textTypeToName = {
  email: 'email',
  url: 'url',
  tel: 'phone',
  text: undefined,
  password: undefined,
  number: undefined,
  search: undefined,
} as const;
