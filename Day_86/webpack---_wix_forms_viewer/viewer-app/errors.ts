import _ from 'lodash'
import { siteStore } from './stores/site-store'
import { getFieldValidity, WixFormField } from './viewer-utils'

export const ErrorName = {
  FetchError: 'FetchError',
  FetchLimitStatusError: 'FetchLimitStatusError',
  InvalidCaptchaError: 'InvalidCaptchaError',
  CaptchaRequiredError: 'CaptchaRequiredError',
  ClientCaptchaRequiredError: 'ClientCaptchaRequiredError',
  NetworkError: 'NetworkError',
  RegistrationError: 'RegistrationError',
  UploadFileError: 'UploadFileError',
  UploadSignatureError: 'UploadSignatureError',
  FieldValidity: 'FieldValidityError',
  SystemAlert: 'SystemAlertError',
  SubmitFailedError: 'SubmitFailedError',
  FetchAppSettingsError: 'FetchAppSettingsError',
  BiLoggerError: 'BiLoggerError',
  RegisterBehaviorError: 'RegisterBehaviorError',
  RulesExecutionFailedError: 'RulesExecutionFailedError',
  OnWixFormSubmitHookError: 'OnWixFormSubmitHookError',
  MembersAutofillError: 'MembersAutofillError',
  TrackEventError: 'TrackEventError',
}

export type FormError =
  | FieldValidity
  | FetchError
  | UploadFileError
  | UploadSignatureError
  | NetworkError
  | RegistrationError
  | SubmitFailedError
  | RegisterBehaviorError
  | RulesExecutionFailedError
  | InvalidCaptchaError
  | CaptchaRequiredError

export class FieldValidity extends Error {
  constructor({ fields }) {
    super(getFieldValidity(fields))

    this.name = ErrorName.FieldValidity
  }
}

export class SystemAlertError extends Error {
  public readonly data

  constructor(errorType: string, data = {}) {
    super(`System alert: ${errorType}`)

    this.name = ErrorName.SystemAlert
    this.data = data
  }
}

export class TrackEventError extends Error {
  public readonly data

  constructor(error) {
    super('Failed to send enahnced trackEvent data')
    this.data = error
  }
}

export class RegisterBehaviorError extends Error {
  public readonly data

  constructor(error, behaviorName) {
    super(`Failed to register ${behaviorName} behavior`)
    this.name = ErrorName.RegisterBehaviorError
    this.data = error
  }
}

export class RulesExecutionFailedError extends Error {
  public readonly data

  constructor(error) {
    super('Failed to execute rules')
    this.name = ErrorName.RulesExecutionFailedError
    this.data = error
  }
}

export class FetchError extends Error {
  public readonly status
  public readonly data

  constructor({ endpoint, status, message }) {
    super(`Failed to fetch ${endpoint} with status code ${status}`)

    this.name = ErrorName.FetchError
    this.status = status
    this.data = message
  }
}

export class FetchLimitStatusError extends Error {
  public readonly status
  public readonly data

  constructor({ status, message }) {
    super(`Failed to fetch limit-status with status code ${status}`)

    this.name = ErrorName.FetchLimitStatusError
    this.status = status
    this.data = message
  }
}

export class InvalidCaptchaError extends Error {
  public readonly data

  constructor(error) {
    super('Submit failed due to invalid reCaptcha')

    this.name = ErrorName.InvalidCaptchaError
    this.data = error
  }
}

export class CaptchaRequiredError extends Error {
  public readonly data

  constructor(error) {
    super('Server requested captcha token')

    this.name = ErrorName.CaptchaRequiredError
    this.data = error
  }
}

export class ClientCaptchaRequiredError extends Error {
  public readonly data

  constructor() {
    super('Client closed captcha dialog')

    this.name = ErrorName.ClientCaptchaRequiredError
  }
}

export class SubmitFailedError extends Error {
  public readonly data

  constructor(error) {
    super(`Submit failed due to missing app settings data`)

    this.name = ErrorName.SubmitFailedError
    this.data = error
  }
}

export class FetchAppSettingsError extends Error {
  public readonly data

  constructor(error) {
    super(`Failed to fetch app settings data`)

    this.name = ErrorName.FetchAppSettingsError
    this.data = error
  }
}

export class BiLoggerError extends Error {
  public readonly data

  constructor(error) {
    super('Failed log bi event')

    this.name = ErrorName.BiLoggerError
    this.data = error
  }
}

export class UploadFileError extends Error {
  public readonly data

  constructor(error) {
    const code = _.get(error, 'errorCode')
    const message = _.get(error, 'errorDescription')

    let errorDescription = ''

    if (code !== undefined) {
      errorDescription = `: ${code}`
    } else if (message) {
      errorDescription = `: ${message}`
    }

    super(`Failed to upload file${errorDescription}`)

    this.name = ErrorName.UploadFileError
    this.data = error
  }
}

export class UploadSignatureError extends Error {
  public readonly data

  constructor(error) {
    super('Failed to upload signature')

    this.name = ErrorName.UploadSignatureError
    this.data = error
  }
}

export class NetworkError extends Error {
  constructor({ endpoint }) {
    super(`Failed to fetch ${endpoint}`)

    this.name = ErrorName.NetworkError
  }
}

export class RegistrationError extends Error {
  public readonly data

  constructor(message, data?) {
    super(message)

    this.name = ErrorName.RegistrationError
    this.data = data
  }
}

export class OnWixFormSubmitHookError extends Error {
  public readonly data
  public readonly stacktrace

  constructor({
    msg,
    data,
    stacktrace,
  }: {
    msg: string
    data?: WixFormField[]
    stacktrace?: string
  }) {
    super(`${ErrorName.OnWixFormSubmitHookError} => ${msg}`)

    this.name = ErrorName.OnWixFormSubmitHookError
    this.data = data
    this.stacktrace = stacktrace
  }
}

export class MembersAutofillError extends Error {
  public readonly data

  constructor(error, errorDescription) {
    super(`Members Autofill error: ${errorDescription}`)
    this.name = ErrorName.MembersAutofillError
    this.data = error
  }
}

export const getRelevantError = ({
  error,
  defaultErrorMessage,
}: {
  error: FormError
  defaultErrorMessage: string
}) => {
  const errorType = _.get(error, 'name')

  const getRegistrationErrorMessage = () => {
    const errorMessage = _.get(error, 'message')

    switch (true) {
      case _.includes(errorMessage, 'non Ascii characters'):
        return siteStore.t('registrationForm.error.invalidPassword')
      case _.includes(errorMessage, 'already exists'):
        return siteStore.t('registrationForm.error.memberAlreadyExists')
      default:
        return siteStore.t('registrationForm.error.general')
    }
  }

  const getFileUploadError = () => {
    const errorCode = _.get(error, 'data.errorCode')
    switch (true) {
      case errorCode === -1:
        return siteStore.t('form.viewer.error.upload.file.noFile')
      case errorCode === -7750:
        return siteStore.t('form.viewer.error.upload.file.notRecognized')
      case errorCode === -7751:
        return siteStore.t('form.viewer.error.upload.file.invalidFile')
      case errorCode === -7752:
        return siteStore.t('form.viewer.error.upload.file.size')
      default:
        return siteStore.t('form.viewer.error.upload.file')
    }
  }

  const getFetchError = () => {
    const status = _.get(error, 'status')
    switch (true) {
      case status === 500 || status === 400:
        return siteStore.t('form.viewer.error.invalid.argument')
      case status === 401:
        return siteStore.t('form.viewer.error.unauthenticated')
      case status === 503:
        return siteStore.t('form.viewer.error.unavailable')
      default:
        return siteStore.t('form.viewer.error.unknown')
    }
  }

  switch (errorType) {
    case ErrorName.RegistrationError:
      return getRegistrationErrorMessage()
    case ErrorName.InvalidCaptchaError:
      return siteStore.t('form.viewer.error.captcha.denied')
    case ErrorName.UploadSignatureError:
      return siteStore.t('form.viewer.error.signature.upload')
    case ErrorName.UploadFileError:
      return getFileUploadError()
    case ErrorName.FetchError:
      return getFetchError()
    default:
      return siteStore.t('form.viewer.error.unknown')
  }
}
