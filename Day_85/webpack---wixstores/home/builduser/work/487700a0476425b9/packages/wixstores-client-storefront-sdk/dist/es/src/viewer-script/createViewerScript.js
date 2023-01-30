import {
    __assign,
    __awaiter,
    __generator
} from "tslib";
import {
    StoresWidgetID,
    MINICART_POPUP_URL,
    VIEWER_SCRIPT_DSN
} from '@wix/wixstores-client-core';
import {
    SiteStore
} from './site-store/SiteStore';
import {
    setSentryInstance,
    createControllerRaven,
    createFakeRaven,
    withErrorReporting,
    withErrorReportingWrapping,
    errorReporter,
} from './errorReporter';
import {
    sentryConfPerController
} from './sentryConf';
import {
    isWorker
} from './utils';
import {
    getReleaseFromBaseUrl
} from '@wix/native-components-infra';
import {
    createWixcodeExports
} from './wixcode/createWixcodeExports';
import {
    SPECS
} from '../constants';

function emptyCtrl() {
    return {
        pageReady: /* istanbul ignore next: todo: test */ function() {
            //
        },
        exports: /* istanbul ignore next: todo: test */ function() {
            return ({});
        },
    };
}
var defaultOptions = {
    useWorkerRaven: true,
};

function openPopup(config, siteStore) {
    var popupUrl = MINICART_POPUP_URL;
    var cartIconConf = config.filter(function(c) {
        return c.type === StoresWidgetID.CART_ICON;
    });
    if (cartIconConf.length && cartIconConf[0].config.externalId) {
        popupUrl += "?externalId=" + cartIconConf[0].config.externalId;
    }
    //eslint-disable-next-line @typescript-eslint/no-floating-promises
    siteStore.windowApis.openPersistentPopup(popupUrl, {
        theme: 'BARE',
        width: '0%',
        height: '100%',
        position: {
            origin: 'FIXED',
            placement: 'TOP_RIGHT',
            x: 0,
            y: 0,
        },
    }, (cartIconConf.length && cartIconConf[0].compId) || config[0].compId);
}

function getControllerFactory(controllerInstances, controllerFactories, type) {
    var ctrlFactory;
    if (controllerInstances === null || controllerInstances === void 0 ? void 0 : controllerInstances[type]) {
        var controllerFunction = Object.keys(controllerInstances[type]).filter(function(k) {
            return k.toLowerCase().includes('controller');
        })[0];
        ctrlFactory = {
            factory: controllerInstances[type][controllerFunction],
            sentryDSN: sentryConfPerController[type].dsn,
            baseUrlKey: sentryConfPerController[type].baseUrlsKey,
        };
        // @ts-expect-error
    } else if (controllerFactories === null || controllerFactories === void 0 ? void 0 : controllerFactories[type]) {
        // @ts-expect-error
        ctrlFactory = controllerFactories[type];
    }
    // @ts-expect-error
    return ctrlFactory;
}

function initController(ctrlFactory, context, props) {
    return __awaiter(this, void 0, void 0, function() {
        var baseUrl, release, monitoring, reportError, setPropsWithErrorsReporting, ctrl, _a;
        return __generator(this, function(_b) {
            switch (_b.label) {
                case 0:
                    if (!ctrlFactory) {
                        return [2 /*return*/ , emptyCtrl()];
                    }
                    baseUrl = ctrlFactory.baseUrlKey && context.siteStore.baseUrls[ctrlFactory.baseUrlKey];
                    release = baseUrl &&
                        getReleaseFromBaseUrl(baseUrl, {
                            artifactName: true,
                        });
                    monitoring = context.createMonitoring(ctrlFactory.sentryDSN, {
                        release: release,
                    });
                    reportError = function(exception, options) {
                        /* istanbul ignore else */
                        if (process.env.NODE_ENV === 'test') {
                            console.error('Error in viewer script:\n', exception);
                        }
                        return monitoring(exception, options);
                    };
                    setPropsWithErrorsReporting = function(p) {
                        var errorBoundaryProps = {
                            sentryRelease: release,
                            ravenUserContextOverrides: {
                                id: context.siteStore.storeId,
                                uuid: context.siteStore.uuid,
                            },
                        };
                        props.setProps(__assign(__assign({}, errorBoundaryProps), withErrorReporting(reportError)(p)));
                    };
                    ctrl = ctrlFactory.factory({
                        config: props.config,
                        compId: props.compId,
                        context: context,
                        setProps: setPropsWithErrorsReporting,
                        platformAPIs: props.platformAPIs,
                        reportError: reportError,
                        type: props.type,
                        warmupData: props.warmupData,
                        wixCodeApi: props.wixCodeApi,
                        // Fields needed for editor flow integration,
                        controllerConfig: props,
                        appData: {
                            context: context,
                            __prepopulated: {
                                experiments: context.siteStore.experiments.all(),
                                biLogger: context.siteStore.biLogger,
                            },
                            reportError: reportError,
                        },
                    });
                    _a = withErrorReporting(reportError);
                    return [4 /*yield*/ , ctrl];
                case 1:
                    // eslint-disable-next-line @typescript-eslint/await-thenable
                    return [2 /*return*/ , _a.apply(void 0, [_b.sent()])];
            }
        });
    });
}
export function createViewerScript(controllerFactories, options) {
    if (options === void 0) {
        options = {};
    }
    var context = {
        controllerConfigs: [],
    };
    options = __assign(__assign({}, defaultOptions), options);
    return withErrorReportingWrapping({
        initAppForPage: function(initParams, apis, namespaces, platformServices) {
            var userMonitoringContext = {
                id: initParams.instanceId,
                url: namespaces.location.baseUrl,
                uuid: platformServices.bi.visitorId,
            };
            context.siteStore = new SiteStore(initParams, apis, namespaces, platformServices);
            if (options.useWorkerRaven) {
                var sentryInstance = platformServices.monitoring.createMonitor(VIEWER_SCRIPT_DSN, function(data) {
                    data.environment = 'Worker';
                    data.release =
                        initParams.url &&
                        getReleaseFromBaseUrl(initParams.url, {
                            artifactName: true,
                        });
                    return data;
                });
                sentryInstance.setUserContext(userMonitoringContext);
                setSentryInstance(sentryInstance);
                context.createMonitoring = createControllerRaven(platformServices, userMonitoringContext, context.siteStore);
            } else {
                context.createMonitoring = createFakeRaven();
            }
            return context.siteStore
                .loadClientConfig()
                .then(function() {
                    return context;
                })
                .catch(errorReporter);
        },
        createControllers: function(controllerConfigs, controllerInstances) {
            var allowMobile = !context.siteStore.isMobile() || context.siteStore.experiments.enabled(SPECS.AllowMobileTinyCartInViewer);
            var cartExists = context.siteStore.isCartExists;
            var isViewer = context.siteStore.isSiteMode() || context.siteStore.isPreviewMode();
            var shouldOpenMiniCart = allowMobile && isViewer && isWorker() && cartExists;
            context.controllerConfigs = controllerConfigs;
            if (shouldOpenMiniCart) {
                openPopup(controllerConfigs, context.siteStore);
            }
            if (controllerConfigs.filter(function(c) {
                    return c.type === StoresWidgetID.CART_ICON;
                }).length) {
                context.siteStore.isCartIconExists = true;
            }
            return controllerConfigs.map(function(props) {
                // @ts-expect-error
                var ctrlFactory = getControllerFactory(controllerInstances, controllerFactories, props.type);
                var ctrl = initController(ctrlFactory, context, props);
                return Promise.resolve(ctrl);
            });
        },
        exports: createWixcodeExports({
            context: context,
            origin: 'wixcode'
        }),
    });
}
//# sourceMappingURL=createViewerScript.js.map