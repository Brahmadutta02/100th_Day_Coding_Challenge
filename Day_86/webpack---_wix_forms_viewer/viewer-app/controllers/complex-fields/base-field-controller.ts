import _ from 'lodash'

export abstract class BaseFieldController {
  protected $w
  protected fields: WixCodeField[]

  constructor($w) {
    this.$w = $w
  }

  protected setRequired(newVal: boolean) {
    this.fields.forEach((field) => {
      if (field) {
        field.required = newVal
      }
    })
  }

  protected setValue(newVal) {
    this.fields.forEach((field) => {
      if (field) {
        field.value = newVal
      }
    })
  }

  protected get valid() {
    return this.fields.reduce((acc, field) => acc && getFieldValid(field), true)
  }

  protected updateValidityIndication() {
    this.fields.forEach((field) => {
      if (field && field.updateValidityIndication) {
        field.updateValidityIndication()
      }
    })
  }

  protected resetValidityIndication() {
    this.fields.forEach((field) => {
      if (field && field.resetValidityIndication) {
        field.resetValidityIndication()
      }
    })
  }

  abstract get controller(): {
    exports: () => {
      value: any
      valid: boolean
      updateValidityIndication: () => void
      resetValidityIndication: () => void
      type: string
      required: boolean
      onChange: (cb: Function) => void
      disableFromRule: boolean
    }
    pageReady: () => void
  }
}

export const getFieldValue = (field) => _.get(field, 'value', '')
export const getFieldValid = (field) => _.get(field, 'valid', true)
