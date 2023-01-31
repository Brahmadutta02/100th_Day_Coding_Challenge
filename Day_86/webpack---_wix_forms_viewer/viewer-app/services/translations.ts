import { i18n } from './i18n'
import { getBaseUrl } from '../utils/utils'

const FALLBACK_TRANSLATIONS_FILE = 'static.parastorage.com/services/forms-viewer/1.301.0'
const BASE_URL = `https://${getBaseUrl() || FALLBACK_TRANSLATIONS_FILE}/`

class TranslationsInstance {
  private _t: Function

  constructor() {
    this.init = this.init.bind(this)
  }

  async init(locale) {
    const { t } = await i18n({ baseUrl: BASE_URL, locale })
    this._t = t
  }

  setTranslationInstance(t) {
    this._t = t
  }

  t = (key, options?) => {
    return this._t(key, options)
  }
}

export default new TranslationsInstance()
