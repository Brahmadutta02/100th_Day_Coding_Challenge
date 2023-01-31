import _ from 'lodash'
import {
  getFieldType,
  FIELD_TYPE,
  isWixFromFieldArray,
  WixFormField,
  toWixFormFieldType,
  getFieldValue,
  setFieldValue,
  isFieldValueEqual,
} from './viewer-utils'
import {
  FormError,
  ErrorName,
  FetchError,
  NetworkError,
  RegistrationError,
  UploadFileError,
  UploadSignatureError,
  FieldValidity,
  OnWixFormSubmitHookError,
} from './errors'
import { submitUtils } from './submit-utils'
import CorvidApiLogger from './corvid-api-logger'
import { Attachment } from './field-dto/field-dto'
import { IController } from './controllers/controllers'
import { I$WWrapper, IWidgetController } from '@wix/native-components-infra/dist/src/types/types'

export const FORM_PRE_SUBMIT_EVENT = 'wixFormSubmitEvent'
const FORM_POST_SUBMIT_EVENT = 'wixFormSubmittedEvent'
const FORM_SUBMIT_ERROR_EVENT = 'wixFormSubmittedErrorEvent'

const SUPPORTED_CONTROLLERS: ControllerType[] = [
  'getSubscribers',
  'multiStepForm',
  'wixForms',
  'registrationForm',
]

export const CORVID_ERROR_CODE = {
  INVALID_FIELD: 'INVALID_FIELD',
  FILE_NOT_UPLOADED: 'FILE_NOT_UPLOADED',
  INVALID_ARGUMENT: 'INVALID_ARGUMENT',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  RESOURCE_EXHAUSTED: 'RESOURCE_EXHAUSTED',
  UNAVAILABLE: 'UNAVAILABLE',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
}

const canFieldBeUpdated = (field): boolean => {
  const fieldType = getFieldType(field)

  switch (fieldType) {
    case FIELD_TYPE.FILE_UPLOAD:
      return false
    case FIELD_TYPE.SIGNATURE:
      return false
    case FIELD_TYPE.CAPTCHA:
      return false
    default:
      return true
  }
}

const assertFieldUpdate = ({
  originalField,
  beforeField,
  afterField,
  hookReturn,
}: {
  originalField: any
  beforeField: WixFormField
  afterField: WixFormField
  hookReturn: any
}): boolean => {
  if (beforeField.id !== afterField.id || beforeField.fieldName !== afterField.fieldName) {
    throw new OnWixFormSubmitHookError({
      msg: 'field id or field name cannot be changed',
      data: hookReturn,
    })
  }

  if (
    !_.isEqual(beforeField.fieldValue, afterField.fieldValue) &&
    !canFieldBeUpdated(originalField)
  ) {
    throw new OnWixFormSubmitHookError({
      msg: `field of type ${getFieldType(originalField)} cannot be changed`,
      data: hookReturn,
    })
  }

  return !_.isEqual(beforeField.fieldValue, afterField.fieldValue)
}

const processOnWixFormSubmitHookReturn = ({
  fields,
  beforeHookFieldsArg,
  hookReturn,
}: {
  fields: any[]
  beforeHookFieldsArg: WixFormField[]
  hookReturn: any
}): { continueSubmit: boolean; afterHookFieldsArg: WixFormField[] } => {
  if (_.isBoolean(hookReturn)) {
    return { continueSubmit: hookReturn, afterHookFieldsArg: beforeHookFieldsArg }
  } else if (isWixFromFieldArray(hookReturn)) {
    if (beforeHookFieldsArg.length !== hookReturn.length) {
      throw new OnWixFormSubmitHookError({
        msg: 'missing or extra fields in returned fields array',
        data: hookReturn,
      })
    }

    const afterHookFieldsArg = _.map(beforeHookFieldsArg, (hookField, idx) => {
      const fieldChanged = assertFieldUpdate({
        originalField: fields[idx],
        beforeField: hookField,
        afterField: hookReturn[idx],
        hookReturn,
      })

      return fieldChanged ? { ...hookField, fieldValue: hookReturn[idx].fieldValue } : hookField
    })

    return { continueSubmit: true, afterHookFieldsArg }
  } else {
    throw new OnWixFormSubmitHookError({
      msg: 'return value must be an array or boolean',
      data: hookReturn,
    })
  }
}

const updateFields = ({
  fields,
  changes,
  attachments,
}: {
  fields: any[]
  changes: WixFormField[]
  attachments: Attachment[]
}): WixFormField[] => {
  const oldValues: WixFormField[] = toWixFormFieldType({ fields, attachments })

  _.forEach(_.zip(fields, changes), ([field, change]: [any, WixFormField], idx: number) => {
    if (!_.isEqual(getFieldValue({ field, attachments }), change.fieldValue)) {
      setFieldValue({ field, value: change.fieldValue })
    }
  })

  return oldValues
}

const updateFieldsWithAssertChange = ({
  fields,
  changes,
  attachments,
}: {
  fields: any[]
  changes: WixFormField[]
  attachments: Attachment[]
}): { oldVals: WixFormField[]; invalidChanges: boolean } => {
  const oldVals = updateFields({
    fields,
    changes,
    attachments,
  })

  const unChangedFields = _.filter(
    _.zip(fields, changes),
    ([field, change]: [any, WixFormField], idx: number) => {
      return !isFieldValueEqual({ field, attachments, val: change.fieldValue })
    },
  )

  return { oldVals, invalidChanges: unChangedFields.length >= 1 }
}

const executeOnWixFormSubmitHookCall = (hookCall: () => any) => {
  try {
    return hookCall()
  } catch (err) {
    throw new OnWixFormSubmitHookError({
      msg: `Exception in hook => ${err.message}`,
      stacktrace: err.stack,
    })
  }
}

const errorNameToHandler: {
  [key: string]: (error: FormError) => { code: string; message: string }
} = {
  [ErrorName.FetchError]: (error: FetchError) => {
    switch (error.status) {
      case 403:
        return { code: CORVID_ERROR_CODE.PERMISSION_DENIED, message: error.data }
      case 400:
        return { code: CORVID_ERROR_CODE.INVALID_ARGUMENT, message: error.data }
      case 401:
        return { code: CORVID_ERROR_CODE.UNAUTHENTICATED, message: error.data }
      case 429:
        return { code: CORVID_ERROR_CODE.RESOURCE_EXHAUSTED, message: error.data }
      default:
        return { code: CORVID_ERROR_CODE.UNKNOWN_ERROR, message: error.data }
    }
  },
  [ErrorName.NetworkError]: (error: NetworkError) => ({
    code: CORVID_ERROR_CODE.UNAVAILABLE,
    message: error.message,
  }),
  [ErrorName.RegistrationError]: (_error: RegistrationError) => ({
    // let's not support registration form for now
    code: CORVID_ERROR_CODE.UNKNOWN_ERROR,
    message: 'unknown error',
  }),
  [ErrorName.UploadFileError]: (error: UploadFileError) => ({
    code: CORVID_ERROR_CODE.FILE_NOT_UPLOADED,
    message: error.message,
  }),
  [ErrorName.UploadSignatureError]: (error: UploadSignatureError) => ({
    code: CORVID_ERROR_CODE.FILE_NOT_UPLOADED,
    message: error.message,
  }),
  [ErrorName.FieldValidity]: (error: FieldValidity) => ({
    code: CORVID_ERROR_CODE.INVALID_FIELD,
    message: error.message,
  }),
}

export class CorvidAPI {
  private $w: I$WWrapper
  private controllerType: ControllerType
  private onWixFormSubmitCallStack: ((event: {
    context: any
    target: any
    type: string
    fields: WixFormField[]
  }) => WixFormField[] | boolean)[]

  constructor($w, controllerType: ControllerType) {
    this.$w = $w
    this.controllerType = controllerType
    this.onWixFormSubmitCallStack = []
  }

  public fireFormSubmit({
    fields,
    attachments,
    controller,
  }: {
    fields: any[]
    attachments: Attachment[]
    controller: IController
  }): boolean {
    const callStack = this.onWixFormSubmitCallStack[Symbol.iterator]()
    let currentHook = callStack.next().value

    if (_.isUndefined(currentHook)) {
      return true
    }

    try {
      let currentHookFieldsArg = toWixFormFieldType({ fields, attachments })

      while (!_.isUndefined(currentHook)) {
        // eslint-disable-next-line no-loop-func
        const currentCallReturn = executeOnWixFormSubmitHookCall(() =>
          currentHook(
            this.$w.createEvent(FORM_PRE_SUBMIT_EVENT, {
              fields: _.cloneDeep(currentHookFieldsArg),
            }),
          ),
        )

        const { continueSubmit, afterHookFieldsArg } = processOnWixFormSubmitHookReturn({
          fields,
          beforeHookFieldsArg: currentHookFieldsArg,
          hookReturn: currentCallReturn,
        })

        if (!continueSubmit) {
          return false
        }

        currentHook = callStack.next().value
        currentHookFieldsArg = afterHookFieldsArg
      }

      const { oldVals, invalidChanges } = updateFieldsWithAssertChange({
        fields,
        changes: currentHookFieldsArg,
        attachments,
      })

      const invalidFields = submitUtils.validateFields({ fields, controller })

      if (invalidFields.length !== 0 || invalidChanges) {
        updateFields({
          fields,
          changes: oldVals,
          attachments,
        })

        throw new OnWixFormSubmitHookError({
          msg: 'changes to fields are not valid',
          data: currentHookFieldsArg,
        })
      }

      return true
    } catch (err) {
      if (err.name === ErrorName.OnWixFormSubmitHookError) {
        CorvidApiLogger.w(err.message, err.stacktrace)
      }

      return true
    }
  }

  public fireFormSubmitted({ fields, attachments }) {
    try {
      this.$w.fireEvent(
        FORM_POST_SUBMIT_EVENT,
        this.$w.createEvent(FORM_POST_SUBMIT_EVENT, {
          fields: toWixFormFieldType({ fields, attachments }),
        }),
      )
    } catch (_e) {}
  }

  public fireSubmitError({ error }: { error: FormError }) {
    try {
      this.$w.fireEvent(
        FORM_SUBMIT_ERROR_EVENT,
        this.$w.createEvent(
          FORM_SUBMIT_ERROR_EVENT,
          errorNameToHandler[_.get(error, 'name')]
            ? errorNameToHandler[error.name](error)
            : { code: CORVID_ERROR_CODE.UNKNOWN_ERROR, message: 'unknown error' },
        ),
      )
    } catch (_e) {}
  }

  private _onWixFormSubmit(cb) {
    if (_.isFunction(cb)) {
      this.onWixFormSubmitCallStack.push(cb)
    }
  }

  private _onWixFormSubmitted(cb) {
    if (_.isFunction(cb)) {
      this.$w.on(FORM_POST_SUBMIT_EVENT, cb)
    }
  }

  private _onWixFormSubmittedError(cb) {
    if (_.isFunction(cb)) {
      this.$w.on(FORM_SUBMIT_ERROR_EVENT, cb)
    }
  }

  public createController(initialController: IWidgetController): IWidgetController {
    return _.includes(SUPPORTED_CONTROLLERS, this.controllerType)
      ? {
          ...initialController,
          exports: () => ({
            onWixFormSubmit: (cb) => this._onWixFormSubmit(cb),
            onWixFormSubmitted: (cb) => this._onWixFormSubmitted(cb),
            onWixFormSubmittedError: (cb) => this._onWixFormSubmittedError(cb),
          }),
        }
      : initialController
  }
}
