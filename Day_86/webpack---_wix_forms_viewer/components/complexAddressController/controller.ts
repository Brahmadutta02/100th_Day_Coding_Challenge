import { CreateControllerFn } from '@wix/yoshi-flow-editor'
import {
  ROLE_COMPLEX_ADDRESS_ADDRESS,
  ROLE_COMPLEX_ADDRESS_ADDRESS2,
  ROLE_COMPLEX_ADDRESS_COUNTRY,
  ROLE_COMPLEX_ADDRESS_CITY,
  ROLE_COMPLEX_ADDRESS_REGION,
  ROLE_COMPLEX_ADDRESS_ZIP_CODE,
} from '../../constants/roles'
import _ from 'lodash'
import { FIELD_TYPE } from '../../viewer-app/viewer-utils'
import {
  BaseFieldController,
  getFieldValue,
} from '../../viewer-app/controllers/complex-fields/base-field-controller'
import { siteStore } from '../../viewer-app/stores/site-store'
import { LocaleData } from '@wix/forms-common'
import { createI18n } from '../../viewer-app/services/i18n'

export class AddressController extends BaseFieldController {
  private streetAddress
  private streetAddress2
  private city
  private region
  private zipCode
  private country

  private onInputChangeCb: Function

  private localeData: LocaleData

  private _pageReady() {
    this.streetAddress = _.get(this.$w(`@${ROLE_COMPLEX_ADDRESS_ADDRESS}`), '[0]')
    this.streetAddress2 = _.get(this.$w(`@${ROLE_COMPLEX_ADDRESS_ADDRESS2}`), '[0]')
    this.city = _.get(this.$w(`@${ROLE_COMPLEX_ADDRESS_CITY}`), '[0]')
    this.region = _.get(this.$w(`@${ROLE_COMPLEX_ADDRESS_REGION}`), '[0]')
    this.zipCode = _.get(this.$w(`@${ROLE_COMPLEX_ADDRESS_ZIP_CODE}`), '[0]')
    this.country = _.get(this.$w(`@${ROLE_COMPLEX_ADDRESS_COUNTRY}`), '[0]')

    this.fields = _.compact([
      this.streetAddress,
      this.streetAddress2,
      this.city,
      this.region,
      this.zipCode,
      this.country,
    ])

    if (this.country) {
      this.localeData = new LocaleData(createI18n(siteStore.multilingualLocale || siteStore.locale))
      this.localeData.translations.on('loaded', () => {
        this.country.options = this.localeData.getAllCountries(
          this.country.options.map((o) => o.value),
        )

        if (this.country.options.length === 0) {
          this.country.required = false
        }
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
      type: `$w.${FIELD_TYPE.COMPLEX_ADDRESS}`,
      value: {
        streetAddress: '',
        streetAddress2: '',
        city: '',
        region: '',
        zipCode: '',
        country: '',
      },
      required: false,
      onChange: this._onChange.bind(this),
      disableFromRule: false,
      innerFields: this.fields,
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
      get: () =>
        _.get(this.streetAddress, 'required', false) ||
        _.get(this.streetAddress2, 'required', false) ||
        _.get(this.city, 'required', false) ||
        _.get(this.region, 'required', false) ||
        _.get(this.zipCode, 'required', false) ||
        _.get(this.country, 'required', false),
      set: (value) => {
        this.setRequired(value)
      },
    })

    return exports
  }

  private get value() {
    return {
      streetAddress: getFieldValue(this.streetAddress),
      streetAddress2: getFieldValue(this.streetAddress2),
      city: getFieldValue(this.city),
      region: getFieldValue(this.region),
      zipCode: getFieldValue(this.zipCode),
      country: getFieldValue(this.country),
    }
  }

  protected setValue(newVal) {
    if (this.streetAddress) {
      this.streetAddress.value = newVal?.streetAddress
    }

    if (this.streetAddress2) {
      this.streetAddress2.value = newVal?.streetAddress2
    }

    if (this.city) {
      this.city.value = newVal?.city
    }

    if (this.region) {
      this.region.value = newVal?.region
    }

    if (this.zipCode) {
      this.zipCode.value = newVal?.zipCode
    }

    if (this.country) {
      this.country.value = newVal?.country
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
  return new AddressController($w).controller
}

export default createController
