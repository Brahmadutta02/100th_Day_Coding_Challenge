import { sanitizePII } from '@wix/bi-logger-sanitizer/dist/src/lib/sanitizers'
import {
  IAppData,
  IFedOpsLogger,
  IPlatformAPI,
  IPlatformServices,
  IWixAPI,
} from '@wix/native-components-infra/dist/src/types/types'
import _ from 'lodash'
import { RavenStatic } from 'raven-js'
import { FORMS_APP_DEF_ID, FORMS_WIDGET_ID } from '../../constants'
import { BiLoggerError, FetchAppSettingsError } from '../errors'
import { AppSettingsViewer } from '../services/app-settings-viewer'
import { getAppVersion, serializeError } from '../utils/utils'

const sanitizeBiLogger = (fields = {}) => {
  const sanitizedFields = {}

  Object.keys(fields).forEach((fieldName) => {
    sanitizedFields[fieldName] = sanitizePII(fields[fieldName])
  })

  return sanitizedFields
}

type AppData = IAppData & {
  url: string
}

type PlatformAPI = IPlatformAPI & {
  links: {
    toUrl: Function
  }
}

class SiteStore {
  private _ravenInstance: RavenStatic
  private _biLogger
  private _fedopsLogger: IFedOpsLogger
  private _t
  private _release: string
  private _platformServicesAPI: IPlatformServices
  private _scopedGlobalSdkApis: IWixAPI
  private _initAppParams: AppData
  private _platformApi: PlatformAPI
  private _formLoadedTimestamp: { [key: string]: number }

  constructor() {
    this._release = getAppVersion()
  }

  public async init({
    initAppParams,
    platformApi,
    scopedGlobalSdkApis,
    platformServicesAPI,
    translationsFactory,
    ravenInstance,
  }) {
    this._ravenInstance = ravenInstance
    this._platformApi = platformApi
    this._initAppParams = initAppParams
    this._platformServicesAPI = platformServicesAPI
    this._scopedGlobalSdkApis = scopedGlobalSdkApis
    this._formLoadedTimestamp = {}

    this._initFedopsLogger()
    this._initRavenContext()
    this._initBiLogger()

    return Promise.all([this._initTranslations({ translationsFactory })])
  }

  private async _initTranslations({ translationsFactory }) {
    await translationsFactory.init(this.locale)

    this._t = translationsFactory.t
  }

  public get locale() {
    return _.get(this._scopedGlobalSdkApis, 'site.language', 'en')
  }

  public get multilingualLocale() {
    return (
      _.get(this._scopedGlobalSdkApis, 'window.multilingual.isEnabled') &&
      _.get(this._scopedGlobalSdkApis, 'window.multilingual.currentLanguage')
    )
  }

  private _initRavenContext() {
    this._ravenInstance.setRelease(this._release)

    const userMonitoringContext = {
      id: this._initAppParams.instanceId,
      url: this._scopedGlobalSdkApis.location.baseUrl,
      uuid: this._platformServicesAPI.bi.visitorId,
    }

    this._ravenInstance.setUserContext(userMonitoringContext)
  }

  private _initBiLogger() {
    const loggerFactory = this._platformServicesAPI.biLoggerFactory()
    const appVersion = getAppVersion()
    this._biLogger = loggerFactory.updateDefaults({ src: 5, appVersion }).logger()
  }

  private _initFedopsLogger() {
    if (this._platformServicesAPI.fedOpsLoggerFactory.getLoggerForWidget) {
      this._fedopsLogger = this._platformServicesAPI.fedOpsLoggerFactory.getLoggerForWidget({
        appId: FORMS_APP_DEF_ID,
        widgetId: FORMS_WIDGET_ID,
      })
    }
  }

  private _getExtraLoggingData(err) {
    const biParamsForExtra = ['requestId', 'viewerSessionId', 'pageId']
    const biParamsForTags = [
      'metaSiteId',
      'artifactVersion',
      'isCached',
      'isServerSide',
      'viewerName',
      'dc',
      'isjp',
      'btype',
      'isPreview',
    ]

    const extra: any = {
      queryParams: _.get(this._scopedGlobalSdkApis, 'location.query'),
      errorObject: serializeError(err),
    }
    const tags = {}

    try {
      const userAgentData = _.get(globalThis, 'navigator.userAgentData')
      extra.userAgentData = userAgentData
    } catch (error) {
      // do nothing
    }

    _.forEach(biParamsForTags, (paramName) => {
      const paramValue = _.get(this._platformServicesAPI, `bi.${paramName}`)
      if (paramValue !== undefined) {
        tags[paramName] = paramValue
      }
    })

    _.forEach(biParamsForExtra, (paramName) => {
      const paramValue = _.get(this._platformServicesAPI, `bi.${paramName}`)
      if (paramValue !== undefined) {
        extra[paramName] = paramValue
      }
    })

    return { extra, tags }
  }

  t(key, options = {}) {
    return this._t(key, options)
  }

  log(fields) {
    try {
      const sanitizedFields = sanitizeBiLogger(fields)
      return this._biLogger.log(sanitizedFields, { endpoint: 'form-builder' })
    } catch (err) {
      this.captureException(new BiLoggerError(err), {
        extra: { fields },
      })
    }
  }

  async loadSettings({ externalId, instanceId }): Promise<ControllerSettings> {
    try {
      if (!externalId) {
        return { ok: true, data: { rules: [] } }
      }

      this.interactionStarted('load-settings')

      const data = await AppSettingsViewer({
        appDefId: FORMS_APP_DEF_ID,
        scope: 'COMPONENT',
        externalId,
        instanceId,
      }).getAll()

      this.interactionEnded('load-settings')

      return {
        ok: true,
        data,
      }
    } catch (err) {
      this.captureException(new FetchAppSettingsError(err), {
        extra: { externalId, instanceId },
      })

      return {
        err,
        ok: false,
      }
    }
  }

  isEnabled(spec) {
    try {
      return this._platformServicesAPI.essentials.experiments.enabled(spec)
    } catch (_e) {
      return false
    }
  }

  interactionStarted(interactionName) {
    if (this._fedopsLogger) {
      this._fedopsLogger.interactionStarted(interactionName)
    }
  }

  interactionEnded(interactionName) {
    if (this._fedopsLogger) {
      this._fedopsLogger.interactionEnded(interactionName)
    }
  }

  appLoadStarted() {
    if (this._fedopsLogger) {
      this._fedopsLogger.appLoadStarted()
    }
  }

  appLoaded(formId: string) {
    if (this._fedopsLogger) {
      this._fedopsLogger.appLoaded()
    }

    this._formLoadedTimestamp[formId] = Date.now()
  }

  timeSinceLoad(formId: string): number {
    try {
      if (this._formLoadedTimestamp[formId]) {
        return Math.round((Date.now() - this._formLoadedTimestamp[formId]) / 1000)
      }
    } catch (err) {
      // do nothing
    }

    return -1
  }

  captureException(err, options = {}) {
    if (this._ravenInstance) {
      const { extra, tags } = this._getExtraLoggingData(err)
      this._ravenInstance.captureException(err, _.merge({}, { extra, tags }, options))
      this._ravenInstance.setTagsContext()
      this._ravenInstance.setExtraContext()
    }
  }

  captureMessage(message, options = undefined) {
    if (this._ravenInstance) {
      this._ravenInstance.captureMessage(message, options)
    }
  }

  captureBreadcrumb(crumb) {
    if (this._ravenInstance) {
      this._ravenInstance.captureBreadcrumb(crumb)
    }
  }

  get initAppParams() {
    return this._initAppParams
  }

  get platformApi() {
    return this._platformApi
  }

  get wixApi() {
    return this._scopedGlobalSdkApis
  }

  get forceCaptcha() {
    return !!_.get(this.wixApi, 'location.query.forceChallenge')
  }

  get isBot() {
    return !!_.get(this.platformServices, 'bi.isjp')
  }

  get botType() {
    return _.get(this.platformServices, 'bi.btype')
  }

  get platformServices() {
    return this._platformServicesAPI
  }

  get isTestRun() {
    const baseUrl = _.get(siteStore.wixApi, 'location.baseUrl')

    return (
      !!_.get(this.wixApi, 'location.query.viewerPlatformOverrides') || // own tests
      !!_.get(this.wixApi, 'location.query.thunderboltTag') || // thunderbolt tests
      !!_.get(this.wixApi, 'location.query.editor-elements-override') || // Editor Elements tests
      !!_.get(this.wixApi, 'location.query.boltTag') || // bolt tests
      _.startsWith(baseUrl, 'https://platform-integration') || // forms bolt tests
      _.startsWith(baseUrl, 'https://inboxtestim') || // inbox automation tests
      _.get(this.wixApi, 'window.viewMode') === 'Preview' // editor preview
    )
  }

  private _getAppToken() {
    return this.wixApi.site.getAppToken(FORMS_APP_DEF_ID)
  }

  async instance() {
    let updatedInstance = this._getAppToken()

    if (!updatedInstance) {
      try {
        const siteApi = this.wixApi.site as any
        if (siteApi.loadNewSession) {
          await siteApi.loadNewSession()
          updatedInstance = this._getAppToken()
        }
      } catch (err) {}
    }

    return updatedInstance
  }
}

export const siteStore = new SiteStore()
