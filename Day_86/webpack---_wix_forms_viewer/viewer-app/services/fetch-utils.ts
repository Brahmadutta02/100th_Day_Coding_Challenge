import { siteStore } from '../stores/site-store'
import { FORMS_APP_DEF_ID } from '../../constants'
import _ from 'lodash'
import {
  CaptchaRequiredError,
  FetchError,
  FetchLimitStatusError,
  InvalidCaptchaError,
  NetworkError,
} from '../errors'
import { LogLevel } from 'raven-js'
import { sanitizePII } from '@wix/bi-logger-sanitizer/dist/src/lib/sanitizers'
import { CAPTCHA_REQUIRED_ERROR } from './constants'

const MAX_FETCH_RETRIES = 2
const DELAY_AFTER_FETCH_RETRY = 100
const IMMUTABLES_ERROR_CODES = [400, 429, 403, 401] // skip retry for business logic errors

const shouldTryAgain = (retries, status = -1, disableRetry) =>
  !disableRetry && retries > 0 && !IMMUTABLES_ERROR_CODES.includes(status)

const mapHeaders = (headers: Headers) => {
  const keyValueHeaders = {}
  headers.forEach((value, key) => (keyValueHeaders[key] = value))
  return keyValueHeaders
}

const captureFetchBreadcrumb = ({
  responseData,
  response,
  endpoint,
  options,
  level,
}: {
  responseData: Object
  response?: Response
  endpoint: string
  options: RequestInit
  level: LogLevel
}) => {
  const data: {
    url?: string
    method?: string
    responseData?
    status_code?: number
    reason?: string
    authorization?: string
    headers?
  } = {
    url: endpoint,
    method: _.get(options, 'method'),
    responseData,
  }

  if (response) {
    data.status_code = response.status
    data.url = response.url

    if (!response.ok) {
      data.reason = response.statusText
      data.authorization = _.get(options, 'headers.Authorization')
      data.headers = _.omit(mapHeaders(response.headers), ['x-seen-by'])
    }
  }

  siteStore.captureBreadcrumb({
    category: 'fetch',
    type: 'http',
    data,
    level,
  })
}

export const fetchWithRetries = <T>(
  baseUrl: string,
  endpoint: string,
  options: RequestInit = {},
  disableRetry = false,
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const wrappedFetch = (retries) => {
      fetch(`${baseUrl}/${endpoint}`, options)
        .then((response) => {
          if (response.ok) {
            response
              .json()
              .then((data) => {
                captureFetchBreadcrumb({
                  responseData: _.isObject(data)
                    ? _.mapValues(data, (value) => (_.isString(value) ? sanitizePII(value) : value))
                    : data,
                  response,
                  options,
                  endpoint,
                  level: 'info',
                })

                resolve(data)
              })
              .catch((error) => {
                captureFetchBreadcrumb({
                  responseData: error,
                  response,
                  options,
                  endpoint,
                  level: 'error',
                })

                reject(error)
              })
          } else {
            if (shouldTryAgain(retries, response.status, disableRetry)) {
              retry(retries)
            } else {
              response
                .text()
                .then((err) => {
                  let error

                  try {
                    error = JSON.parse(err)
                  } catch (_e) {
                    error = { message: err }
                  }

                  captureFetchBreadcrumb({
                    responseData: error,
                    response,
                    options,
                    endpoint,
                    level: 'error',
                  })

                  const errorMessage = error.message || response.statusText
                  const isCaptchaError = errorMessage === 'Invalid CAPTCHA'
                  const isCaptchaRequiredError = errorMessage === CAPTCHA_REQUIRED_ERROR
                  const isLimitStatusError = _.includes(endpoint, 'limit-status')

                  let errorObject

                  if (isCaptchaError) {
                    // TODO: Extract this code from here
                    errorObject = new InvalidCaptchaError(error)
                  } else if (isCaptchaRequiredError) {
                    errorObject = new CaptchaRequiredError(error)
                  } else if (isLimitStatusError) {
                    errorObject = new FetchLimitStatusError({
                      status: response.status,
                      message: error.message || response.statusText,
                    })
                  } else {
                    errorObject = new FetchError({
                      endpoint,
                      status: response.status,
                      message: error.message || response.statusText,
                    })
                  }

                  reject(errorObject)
                })
                .catch((error) => {
                  captureFetchBreadcrumb({
                    responseData: error,
                    response,
                    options,
                    endpoint,
                    level: 'error',
                  })

                  reject(
                    new FetchError({
                      endpoint,
                      status: response.status,
                      message: response.statusText,
                    }),
                  )
                })
            }
          }
        })
        .catch((error) => {
          if (shouldTryAgain(retries, -1, disableRetry)) {
            retry(retries)
          } else {
            captureFetchBreadcrumb({ responseData: error, options, endpoint, level: 'error' })
            reject(new NetworkError({ endpoint }))
          }
        })
    }

    const retry = (retries) => {
      setTimeout(() => {
        wrappedFetch(--retries)
      }, DELAY_AFTER_FETCH_RETRY)
    }

    wrappedFetch(MAX_FETCH_RETRIES)
  })
}

export const get = <T>(baseUrl, endpoint) =>
  fetchWithRetries<T>(baseUrl, endpoint, {
    method: 'GET',
    headers: {
      Authorization: siteStore.wixApi.site.getAppToken(FORMS_APP_DEF_ID),
      'X-Wix-Client-Artifact-Id': 'wix-form-builder',
    },
  })

export const post = async <T>(baseUrl, endpoint, payload, shouldDisableRetry = false) =>
  fetchWithRetries<T>(
    baseUrl,
    endpoint,
    {
      method: 'POST',
      headers: {
        Authorization: await siteStore.instance(),
        'Content-Type': 'application/json',
        'X-Wix-Client-Artifact-Id': 'wix-form-builder',
      },
      body: JSON.stringify(payload),
    },
    shouldDisableRetry,
  )
