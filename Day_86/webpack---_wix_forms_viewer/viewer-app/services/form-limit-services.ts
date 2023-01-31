import { getBaseUrl } from '../viewer-utils'
import { LIMIT_REACHED } from './constants'
import { get } from './fetch-utils'

export const isLimitReached = async (formId, siteStore) => {
  try {
    const baseUrl = getBaseUrl()
    const { status } = await get<{ status: string }>(baseUrl, `_api/wix-forms/v1/forms-limit/${formId}/limit-status`)
    return status === LIMIT_REACHED
  } catch (error) {
    siteStore.captureException(error)
  }
  return false
}
