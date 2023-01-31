import _ from 'lodash'
import {
  PAYMENT_RESTRICTION,
  PAYMENT_FEATURE,
  PREMIUM_RESTRICTIONS_ENDPOINT,
  PLATFORMIZED_FORMS_URL,
  FEATURES_MANAGER_ENDPOINT,
} from './constants'
import { get } from './fetch-utils'

// this method is being used only in preview mode in editor although imported in viewer-app
export const isPaymentAllowed = async () => {
  let allowed = false

  try {
    const [oldRestrictions, featuresResponse] = await Promise.all([
      get(PLATFORMIZED_FORMS_URL, PREMIUM_RESTRICTIONS_ENDPOINT),
      get(FEATURES_MANAGER_ENDPOINT, `bulk-features?uniqueNames=${PAYMENT_FEATURE}`),
    ])

    const allowedFeatures = _.get(oldRestrictions, 'allowedFeatures')
    const features = _.get(featuresResponse, 'features')

    allowed =
      _.includes(allowedFeatures, PAYMENT_RESTRICTION) ||
      !!_.find(features, (feature) => feature.uniqueName === PAYMENT_FEATURE && feature.enabled)
  } catch {}

  return allowed
}
