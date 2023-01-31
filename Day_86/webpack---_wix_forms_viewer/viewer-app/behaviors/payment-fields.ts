import {
  FormPlugin,
  paymentMappingToRadioOptions,
  getCurrencyByKey,
  validatePriceValue as validatePriceValidInCurrency,
} from '@wix/forms-common'
import _ from 'lodash'
import { FIELDS } from '../../constants/roles'
import { IController } from '../controllers/controllers'
import { siteStore } from '../stores/site-store'

const addCustomAmountValidation = (controller: IController) => {
  const $customAmountField = controller.$w(`@${FIELDS.ROLE_FIELD_CUSTOM_AMOUNT}`)
  const currency = _.get(siteStore.wixApi, 'site.currency')
  const currencySymbol = _.get(getCurrencyByKey(currency), 'symbol')

  const paymentPluginData = _.find(
    _.get(controller.$form, 'connectionConfig.plugins'),
    (plugin) => plugin.id === FormPlugin.PAYMENT_FORM,
  )

  _.forEach($customAmountField, ($field: WixCodeField) => {
    if ($field.prefix && $field.prefix !== currencySymbol) {
      $field.prefix = currencySymbol
    }
    const productId = _.get($field, 'connectionConfig.productId')
    const productData = _.get(paymentPluginData, `payload.items[${productId}]`)

    const defaultPriceValue = _.toNumber(_.get(productData, 'price'))

    if (defaultPriceValue) {
      $field.value = defaultPriceValue.toString()
    }

    $field.onCustomValidation((value, reject) => {
      if (!$field.required && _.isEmpty(value)) {
        return
      }

      const number = _.toNumber(value)
      if (siteStore.isEnabled('specs.crm.FormsViewerPaymentsVerboseContent')) {
        if (_.isNaN(number)) {
          reject(siteStore.t('paymentField.invalidFormat'))
        } else {
          const minAmount = parseFloat(productData?.min || 0)
          const maxAmount = parseFloat(productData?.max)
          const isMaxDefined = !_.isNaN(maxAmount)

          if (isMaxDefined) {
            if (number < minAmount || number > maxAmount) {
              reject(
                siteStore.t('form.viewer.paymentField.outOfMinMaxValues', { minAmount, maxAmount }),
              )
              return
            }
          }

          if (number < minAmount) {
            reject(siteStore.t('form.viewer.paymentField.outOfMinValue', { minAmount }))
            return
          }

          if (number > Number.MAX_SAFE_INTEGER) {
            reject(siteStore.t('paymentField.outOfRange'))
            return
          }

          if (
            !validatePriceValidInCurrency({
              priceValue: number,
              currencyKey: currency,
              allowZero: true,
            })
          ) {
            reject(siteStore.t('paymentField.invalidFormat'))
            return
          }
        }
      } else {
        if (_.isNaN(number)) {
          reject(siteStore.t('paymentField.invalidFormat'))
        } else {
          const minValue = _.toNumber(_.get(productData, 'min') || 0)
          const maxValue = _.toNumber(_.get(productData, 'max') || Number.MAX_SAFE_INTEGER)

          if (number < minValue || number > maxValue) {
            reject(siteStore.t('paymentField.outOfRange'))
          }
        }
      }
    })
  })
}

const addItemsListBehavior = (controller: IController) => {
  const $listItemsField = controller.$w(`@${FIELDS.ROLE_FIELD_ITEMS_LIST}`)
  const currency = _.get(siteStore.wixApi, 'site.currency')

  if (currency) {
    _.forEach($listItemsField, ($field) => {
      const paymentMapping = _.get($field, 'connectionConfig.paymentItemsMapping')
      if (paymentMapping) {
        $field.options = paymentMappingToRadioOptions(paymentMapping, currency, {
          t: siteStore.t.bind(siteStore),
        })
      }
    })
  }
}

export const registerPaymentFieldsIfExists = (controller: IController) => {
  addCustomAmountValidation(controller)
  addItemsListBehavior(controller)
}
