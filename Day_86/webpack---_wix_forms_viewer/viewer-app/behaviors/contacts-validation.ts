import _ from 'lodash'
import { CRM_TYPES } from '../../constants/crm-types-tags'
import { EMAIL_REGEX } from '../services/constants'
import { IController } from '../controllers/controllers'
import { siteStore } from '../stores/site-store'

// https://github.com/wix-private/crm/blob/master/user-activity-domain/src/main/scala/com/wixpress/useractivity/entities/ContactUpdate.scala
export const CRM_MAX_LENGTH = {
  [CRM_TYPES.FIRST_NAME]: 100,
  [CRM_TYPES.ADDRESS]: 250,
  [CRM_TYPES.EMAIL]: 250,
  [CRM_TYPES.COMPANY]: 100,
  [CRM_TYPES.POSITION]: 100,
  [CRM_TYPES.LAST_NAME]: 100,
  [CRM_TYPES.PHONE]: 50,
}

const CRM_PATTERNS = {
  [CRM_TYPES.EMAIL]: EMAIL_REGEX,
}

export const addContactsValidation = async (controller: IController) => {
  const fields = controller.getFields()
  const maxLengthValidation = (field, crmType) => {
    const crmMaxLength = _.get(CRM_MAX_LENGTH, crmType)
    if (crmMaxLength) {
      const fieldMaxLength = _.isNumber(field.maxLength) ? field.maxLength : Infinity
      field.maxLength = Math.min(fieldMaxLength, crmMaxLength)
    }
  }

  const patternValidation = async (field: WixCodeField, crmType) => {
    if (CRM_PATTERNS[crmType]) {
      field.onCustomValidation((value, reject) => {
        if (!field.collapsed && !field.hidden) {
          if (!_.isEmpty(_.trim(value)) && !CRM_PATTERNS[crmType].test(value)) {
            reject(siteStore.t('form.viewer.error.email.invalidFormat'))
          }
        }
      }, false)
    }
  }

  fields.forEach((field) => {
    const crmType = _.get(field, 'connectionConfig.crmType')
    maxLengthValidation(field, crmType)
    patternValidation(field, crmType)
  })
}
