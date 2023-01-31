import { CreateControllerFn } from '@wix/yoshi-flow-editor'

import { ROLE_COMPLEX_PHONE_DROPDOWN, ROLE_COMPLEX_PHONE_TEXT } from '../../constants/roles'
import _ from 'lodash'
import { FIELD_TYPE } from '../../viewer-app/viewer-utils'
import {
  BaseFieldController,
  getFieldValue,
} from '../../viewer-app/controllers/complex-fields/base-field-controller'
import { getCountryCodeByGEO } from '@wix/forms-common'

export class PhoneController extends BaseFieldController {
  private phoneDropdown
  private phoneInput
  private onInputChangeCb: Function

  private _pageReady() {
    this.phoneDropdown = _.get(this.$w(`@${ROLE_COMPLEX_PHONE_DROPDOWN}`), '[0]')
    this.phoneInput = _.get(this.$w(`@${ROLE_COMPLEX_PHONE_TEXT}`), '[0]')
    this.fields = [this.phoneInput, this.phoneDropdown]

    if (this.phoneDropdown) {
      this.phoneDropdown.options = this.phoneDropdown.options.filter((option) => {
        const geo = option.value.split(' ')[0]

        const countryCode = getCountryCodeByGEO(geo)
        return !!countryCode
      })

      if (this.phoneDropdown.options.length === 0) {
        this.phoneDropdown.required = false
      }
    }

    if (!this.phoneInput && this.phoneDropdown) {
      this.phoneDropdown.required = false
    }
    if (this.phoneInput) {
      this.phoneInput.onInput((event) => {
        _.isFunction(this.onInputChangeCb) && this.onInputChangeCb(event)
      })
    }
  }

  private _onChange(cb: Function) {
    this.onInputChangeCb = cb
  }

  private _exports() {
    const exports = {
      valid: true,
      updateValidityIndication: this.updateValidityIndication.bind(this),
      resetValidityIndication: this.resetValidityIndication.bind(this),
      type: `$w.${FIELD_TYPE.COMPLEX_PHONE}`,
      value: { country: '', prefix: '', value: '' },
      required: false,
      onChange: this._onChange.bind(this),
      disableFromRule: !this.phoneInput,
    }

    Object.defineProperty(exports, 'value', {
      get: () => this.value,
      set: (value) => {
        this.setValue(value)
      },
    })

    Object.defineProperty(exports, 'valid', {
      get: () => this.valid,
    })

    Object.defineProperty(exports, 'required', {
      get: () => _.get(this.phoneInput, 'required', false),
      set: (value) => {
        this.setRequired(value)
      },
    })

    return exports
  }

  private get value() {
    const dropDownValue = getFieldValue(this.phoneDropdown).split(' ')
    const noValue = dropDownValue.length === 1 && !!dropDownValue[0]
    const fullCode = !noValue && dropDownValue.length === 2
    const [country = '', prefix = ''] = fullCode ? dropDownValue : ['', dropDownValue[0]]

    return {
      country,
      prefix,
      value: getFieldValue(this.phoneInput),
    }
  }

  protected setValue(newVal) {
    if (this.phoneDropdown) {
      this.phoneDropdown.value = `${newVal.country} ${newVal.prefix}`.trim()
    }

    if (this.phoneInput) {
      this.phoneInput.value = newVal.value
    }
  }

  get controller() {
    return {
      pageReady: () => this._pageReady(),
      exports: () => this._exports(),
    }
  }
}

const createController: CreateControllerFn = ({ controllerConfig }) => {
  const { $w } = controllerConfig
  return new PhoneController($w).controller
}

export default createController
