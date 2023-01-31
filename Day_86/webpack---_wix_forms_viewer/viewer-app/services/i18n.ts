import _ from 'lodash'
import * as defaultTranslations from '../../assets/locales/messages_en.json'
import { SUPPORT_LANGUAGES } from '../../constants/supported-languages'

const loadTranslation = async ({ baseUrl, locale }) => {
  if (!_.includes(SUPPORT_LANGUAGES, locale)) {
    return defaultTranslations
  }

  const url = `${baseUrl}assets/locales/messages_${locale}.json`
  const res = await fetch(url)
  return res.ok ? res.json() : defaultTranslations
}

export const i18n = async ({ baseUrl, locale }) => {
  let translations = defaultTranslations

  try {
    translations = await loadTranslation({ baseUrl, locale })
  } catch {}

  return {
    t: (key, options?) => {
      let translatedValue = _.get(translations, key, key)

      if (options) {
        translatedValue = _.reduce(
          options,
          (result, value, _key) => {
            const pattern = new RegExp(`{{${_key}}}`, 'ig')
            return _.replace(result, pattern, value)
          },
          translatedValue,
        )
      }

      return translatedValue
    },
  }
}

// this is a mock for the instance we will get from viewer platform in a few weeks
export const createI18n = (locale: string): any => ({ asyncMessagesLoader }) => {
  let translations: { [key in string]: string },
    loadedCB: () => void,
    englishTranslations: { [key in string]: string }

  try {
    if (locale !== 'en') {
      Promise.all([asyncMessagesLoader(locale), asyncMessagesLoader('en')]).then(([t, enT]) => {
        translations = t
        englishTranslations = enT
        loadedCB()
      })
    } else {
      asyncMessagesLoader(locale).then((t) => {
        translations = t
        englishTranslations = t
        loadedCB()
      })
    }
  } catch {}

  return {
    t: (key, _options?) => _.get(translations, key) || _.get(englishTranslations, key) || key,
    on: (event, cb) => {
      if (event === 'loaded') {
        loadedCB = cb
      }
    },
  }
}
