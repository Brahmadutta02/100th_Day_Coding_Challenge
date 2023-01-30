import {
    __assign,
    __awaiter,
    __extends,
    __generator,
    __read,
    __spread
} from "tslib";
import * as _ from 'lodash';
import Experiments from '@wix/wix-experiments';
import {
    APP_DEFINITION_ID,
    CacheKey,
    createOOIPlatformSiteBILogger,
    createOOIStoreFrontBILogger,
    createOOIWebBILogger,
    PageMap,
    STORES_FQDN,
    Topology,
    URLUtils,
} from '@wix/wixstores-client-core';
import {
    isWorker
} from '../utils';
import {
    CustomUrlApi
} from '../../utils/CustomUrl/CustomUrlApi';
import {
    BI_STOREFRONT_VIEW_MODE,
    SPECS
} from '../../constants';
import {
    PubSubManager
} from '../../services/PubSubManager/PubSubManager';
import {
    query as getClientConfigQuery
} from '../../graphql/getClientConfig.graphql';
import {
    EcomHttpClient
} from './EcomHttpClient';
var SiteStore = /** @class */ (function(_super) {
    __extends(SiteStore, _super);

    function SiteStore(_a, _b, wixCodeApi, platform, _c) {
        var instance = _a.instance,
            instanceId = _a.instanceId,
            baseUrls = _a.baseUrls,
            appDefinitionId = _a.appDefinitionId;
        var pubSub = _b.pubSub,
            storage = _b.storage,
            links = _b.links;
        var _d = (_c === void 0 ? {} : _c).appName,
            appName = _d === void 0 ? 'Stores' : _d;
        var _this = _super.call(this, {
            instance: instance,
            wixCodeApi: wixCodeApi,
            csrfToken: platform.getCsrfToken(),
            essentials: platform.essentials,
            storeId: instanceId,
            isSSR: wixCodeApi.window.rendering.env === 'backend',
            experiments: platform.essentials.experiments,
        }) || this;
        _this.priceSettings = {
            showPriceRange: false,
            showTaxDisclaimer: false,
            shippingDisclaimer: null,
            taxOnProduct: false,
        };
        _this.pageMap = {
            cart: 'shopping_cart',
            checkout: 'checkout',
            gallery: 'product_gallery',
            thankyou: 'thank_you_page',
            product: 'product_page',
        };
        _this.locale = 'en';
        _this.isMiniCartExists = false;
        _this.isCartIconExists = false;
        _this.isCartExists = true;
        var wixWindow = wixCodeApi.window,
            site = wixCodeApi.site,
            location = wixCodeApi.location,
            seo = wixCodeApi.seo,
            usersApi = wixCodeApi.user;
        _this.bi = platform.bi;
        _this.instance = instance;
        _this.formFactor = wixWindow.formFactor;
        _this.isMobileFriendly = wixWindow.isMobileFriendly;
        _this.viewMode = wixWindow.viewMode;
        _this.pubSub = pubSub;
        _this.siteApis = site;
        _this.location = location;
        _this.links = links;
        _this.seo = seo;
        _this.windowApis = wixWindow;
        _this.usersApi = usersApi;
        _this.storeId = instanceId;
        _this.msid = _this.bi.metaSiteId;
        _this.ownerId = _this.bi.ownerId;
        _this.platformServices = platform;
        _this.storage = storage;
        var user = _this.isSiteMode() ? {
            visitor_id: _this.bi.visitorId
        } : {
            uuid: _this.ownerId
        };
        _this.uuid = _this.bi.visitorId;
        _this.biLogger = createOOIStoreFrontBILogger(user, _this.platformServices.bi.biToken, {
            storeId: _this.storeId,
            isMerchant: false,
            appName: appName,
            _msid: _this.msid,
        }, _this.platformServices.biLoggerFactory());
        _this.webBiLogger = createOOIWebBILogger({
            biLoggerFactory: _this.platformServices.biLoggerFactory,
            user: user,
            biToken: _this.platformServices.bi.biToken,
            defaults: {
                storeId: _this.storeId,
                editorMode: _this.isDesktop() ? 'desktop' : 'mobile',
                isMerchant: false,
                appName: appName,
                _msid: _this.msid,
            },
        });
        _this.platformBiLogger = createOOIPlatformSiteBILogger(_this.platformServices.bi.biToken, {
            appName: appName,
            _msid: _this.msid,
        }, _this.platformServices.biLoggerFactory());
        _this.pubSubManager = new PubSubManager(_this.pubSub);
        if (!_this.location.navigateToSection) {
            _this.location.navigateToSection = function() {
                return Promise.resolve();
            };
        }
        var overrideBaseUrl = _.has(location.query, 'localDevServer');
        _this.baseUrls = _.mapValues(baseUrls,
            /* istanbul ignore next: todo: test */
            function(url) {
                return (overrideBaseUrl ? location.query.localDevServer : url);
            });
        _this.isSiteMode() && _this.purgeMemoryCache();
        site.onInstanceChanged(function(event) {
            _this.instanceManager.setInstance(event.instance); //TODO: move to the constructor once merged
            _this.instance = event.instance;
        }, appDefinitionId);
        _this.trackMiniCartExists();
        return _this;
    }
    /* istanbul ignore next: todo: test */
    SiteStore.prototype.trackEvent = function(eventName, params) {
        this.windowApis.trackEvent(eventName, __assign({
            appDefId: APP_DEFINITION_ID,
            category: 'All Products',
            currency: this.currency,
            origin: 'Stores'
        }, params));
    };
    SiteStore.prototype.loadClientConfig = function() {
        return __awaiter(this, void 0, void 0, function() {
            var cache, cachedData, variables;
            var _this = this;
            return __generator(this, function(_a) {
                cache = this.storage.memory.getItem(CacheKey.GET_CONFIG);
                if (cache) {
                    cachedData = JSON.parse(cache);
                    if (cachedData.clientConfig) {
                        return [2 /*return*/ , this.handleGetConfigData(cachedData)];
                    }
                }
                variables = {
                    withPremiumFeatures: !this.isSSR(),
                    countryKeys: [this.storeCountry],
                    language: this.storeLanguage,
                };
                return [2 /*return*/ , this.tryGetGqlAndFallbackToPost(this.resolveAbsoluteUrl("/" + Topology.STOREFRONT_GRAPHQL_URL), {
                    query: getClientConfigQuery,
                    variables: variables,
                    source: 'WixStoresWebClient',
                    operationName: 'getConfig',
                }).then(function(_a) {
                    var data = _a.data;
                    _this.isSiteMode() && _this.storage.memory.setItem(CacheKey.GET_CONFIG, JSON.stringify(data));
                    return _this.handleGetConfigData(data);
                })];
            });
        });
    };
    Object.defineProperty(SiteStore.prototype, "storeCountry", {
        get: function() {
            var _a, _b;
            var locale = this.siteApis.regionalSettings;
            if (this.windowApis.multilingual.isEnabled) {
                var multilingualLanguage = this.getCurrentlyUsedMultilingualLanguage();
                if (multilingualLanguage === null || multilingualLanguage === void 0 ? void 0 : multilingualLanguage.locale) {
                    locale = multilingualLanguage.locale;
                }
            }
            var regionalSettingsLanguageAndCountry = (_a = locale === null || locale === void 0 ? void 0 : locale.split('-')) !== null && _a !== void 0 ? _a : '';
            var countryCode = (_b = regionalSettingsLanguageAndCountry[1]) !== null && _b !== void 0 ? _b : 'US';
            return countryCode.toUpperCase();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SiteStore.prototype, "storeLanguage", {
        get: function() {
            if (this.windowApis.multilingual.isEnabled) {
                return this.windowApis.multilingual.currentLanguage;
            }
            return this.siteApis.language;
        },
        enumerable: false,
        configurable: true
    });
    SiteStore.prototype.isMobile = function() {
        if (!this.isMobileFriendly) {
            return false;
        }
        return this.formFactor === 'Mobile';
    };
    SiteStore.prototype.isDesktop = function() {
        return this.formFactor === 'Desktop';
    };
    SiteStore.prototype.isTablet = function() {
        return this.formFactor === 'Tablet';
    };
    SiteStore.prototype.isEditorMode = function() {
        return this.viewMode === 'Editor';
    };
    SiteStore.prototype.isSiteMode = function() {
        return this.viewMode === 'Site';
    };
    SiteStore.prototype.isPreviewMode = function() {
        return this.viewMode === 'Preview';
    };
    SiteStore.prototype.getSectionUrl = function(sectionId) {
        var params = {
            sectionId: sectionId,
            appDefinitionId: APP_DEFINITION_ID
        };
        var section = this.siteApis.getSectionUrl(params, false);
        return Promise.resolve(section);
    };
    SiteStore.prototype.isInteractive = function() {
        return this.windowApis.rendering.env === 'browser';
    };
    SiteStore.prototype.isSSR = function() {
        return this.windowApis.rendering.env === 'backend';
    };
    SiteStore.prototype.isRTL = function() {
        return this.layoutDirection === 'rtl';
    };
    Object.defineProperty(SiteStore.prototype, "isOwner", {
        get: function() {
            return !!(this.bi && this.usersApi.currentUser && this.ownerId === this.usersApi.currentUser.id);
        },
        enumerable: false,
        configurable: true
    });
    SiteStore.prototype.buildUrl = function(relativeUrl, conf) {
        var url = "" + relativeUrl;
        var appSectionParams = JSON.stringify(conf.queryParams);
        var queryParams = [];
        if (conf.state !== undefined) {
            url += "/" + conf.state;
        }
        if (conf.queryParams !== undefined) {
            queryParams.push("appSectionParams=" + appSectionParams);
        }
        if (conf.urlParams) {
            var params_1 = conf.urlParams;
            queryParams.push.apply(queryParams, __spread(Object.keys(params_1).map(function(key) {
                return key + "=" + params_1[key];
            })));
        }
        if (queryParams.length) {
            url += "?" + queryParams.join('&');
        }
        return url;
    };
    // In OOI we should avoid navigating using this method, and use an actual <a href="..."> instead
    SiteStore.prototype.navigate = function(conf, forceNavigate) {
        if (forceNavigate === void 0) {
            forceNavigate = false;
        }
        return __awaiter(this, void 0, void 0, function() {
            var isUrlWithOverrides, relativeUrl;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        if (!isWorker()) return [3 /*break*/ , 4];
                        return [4 /*yield*/ , this.customUrlApi.init()];
                    case 1:
                        isUrlWithOverrides = _a.sent();
                        if (!forceNavigate) {
                            return [2 /*return*/ , Promise.resolve()];
                        }
                        if (!(isUrlWithOverrides && conf.sectionId === PageMap.PRODUCT)) return [3 /*break*/ , 2];
                        this.location.to(this.customUrlApi.buildProductPageUrl({
                            slug: conf.state
                        }));
                        return [3 /*break*/ , 4];
                    case 2:
                        return [4 /*yield*/ , this.getSectionUrl(conf.sectionId)];
                    case 3:
                        relativeUrl = (_a.sent()).relativeUrl;
                        this.location.to(this.buildUrl(relativeUrl, conf));
                        _a.label = 4;
                    case 4:
                        if (!isWorker()) {
                            if (conf.sectionId === PageMap.PRODUCT) {
                                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                                this.location.navigateToSection({
                                    sectionId: conf.sectionId,
                                    state: conf.state,
                                    customizeTarget: {
                                        customUrlData: {
                                            key: STORES_FQDN.PRODUCT_PAGE,
                                            variables: {
                                                slug: conf.state
                                            }
                                        },
                                    },
                                });
                            } else {
                                //eslint-disable-next-line @typescript-eslint/no-floating-promises
                                this.location.navigateToSection(conf);
                            }
                        }
                        return [2 /*return*/ ];
                }
            });
        });
    };
    SiteStore.prototype.navigateToLink = function(link) {
        this.location.to(isWorker() ? link.url : link.sdkLink);
    };
    SiteStore.prototype.getHomepageStructurePage = function() {
        var _a;
        return __awaiter(this, void 0, void 0, function() {
            var siteStructure;
            return __generator(this, function(_b) {
                switch (_b.label) {
                    case 0:
                        return [4 /*yield*/ , this.getSiteStructure()];
                    case 1:
                        siteStructure = _b.sent();
                        return [2 /*return*/ , (_a = siteStructure.pages.find(function(p) {
                            return p.isHomePage;
                        })) !== null && _a !== void 0 ? _a : siteStructure.pages[0]];
                }
            });
        });
    };
    SiteStore.prototype.getSiteStructure = function() {
        var _a;
        return __awaiter(this, void 0, void 0, function() {
            var _b, _c;
            return __generator(this, function(_d) {
                switch (_d.label) {
                    case 0:
                        if (!((_a = this.siteStructure) !== null && _a !== void 0)) return [3 /*break*/ , 1];
                        _b = _a;
                        return [3 /*break*/ , 3];
                    case 1:
                        _c = this;
                        return [4 /*yield*/ , this.siteApis.getSiteStructure({
                            includePageId: true
                        })];
                    case 2:
                        _b = (_c.siteStructure = _d.sent());
                        _d.label = 3;
                    case 3:
                        return [2 /*return*/ , _b];
                }
            });
        });
    };
    SiteStore.prototype.getUrl = function(sdkLink) {
        return this.links ? this.links.toUrl(sdkLink) : URLUtils.getUrlFromLink(sdkLink, []);
    };
    SiteStore.prototype.getPageLink = function(pageLink) {
        var _a;
        return __awaiter(this, void 0, void 0, function() {
            var siteStructure, _b, _c, link, _d;
            return __generator(this, function(_e) {
                switch (_e.label) {
                    case 0:
                        return [4 /*yield*/ , this.getSiteStructure()];
                    case 1:
                        siteStructure = _e.sent();
                        if (!!(pageLink === null || pageLink === void 0 ? void 0 : pageLink.pageId)) return [3 /*break*/ , 3];
                        _b = {};
                        _c = {};
                        return [4 /*yield*/ , this.getHomepageStructurePage()];
                    case 2:
                        return [2 /*return*/ , (_b.sdkLink = (_c.pageId = (_e.sent()).id, _c.type = 'PageLink', _c),
                            _b.url = this.location.baseUrl,
                            _b)];
                    case 3:
                        if (!((_a = siteStructure.pages.find(function(p) {
                                return p.id === pageLink.pageId;
                            })) !== null && _a !== void 0)) return [3 /*break*/ , 4];
                        _d = _a;
                        return [3 /*break*/ , 6];
                    case 4:
                        return [4 /*yield*/ , this.getHomepageStructurePage()];
                    case 5:
                        _d = (_e.sent());
                        _e.label = 6;
                    case 6:
                        link = _d;
                        return [2 /*return*/ , {
                            sdkLink: {
                                pageId: link.id,
                                type: 'PageLink'
                            },
                            url: "" + this.location.baseUrl + link.url,
                        }];
                }
            });
        });
    };
    SiteStore.prototype.getAnchorLink = function(anchorLink) {
        return __awaiter(this, void 0, void 0, function() {
            var siteStructure, pageId, link;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , this.getSiteStructure()];
                    case 1:
                        siteStructure = _a.sent();
                        pageId = anchorLink.pageId.replace('#', '');
                        link = siteStructure.pages.find(function(p) {
                            return p.id === pageId;
                        });
                        if (!link) {
                            return [2 /*return*/ , this.getPageLink()];
                        }
                        return [2 /*return*/ , {
                            sdkLink: {
                                pageId: link.id,
                                type: 'AnchorLink',
                                anchorName: anchorLink.anchorName,
                                anchorDataId: anchorLink.anchorDataId,
                            },
                            url: this.getUrl(anchorLink),
                        }];
                }
            });
        });
    };
    SiteStore.prototype.getHomepageLink = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                return [2 /*return*/ , this.getPageLink()];
            });
        });
    };
    SiteStore.prototype.getLink = function(sdkLink) {
        return __awaiter(this, void 0, void 0, function() {
            var link;
            return __generator(this, function(_a) {
                if (sdkLink.type === 'PageLink') {
                    link = __assign(__assign({}, sdkLink), {
                        pageId: sdkLink.pageId.replace('#', '')
                    });
                    return [2 /*return*/ , this.getPageLink(link)];
                }
                if (sdkLink.type === 'AnchorLink') {
                    return [2 /*return*/ , this.getAnchorLink(sdkLink)];
                }
                return [2 /*return*/ , {
                    sdkLink: sdkLink,
                    url: this.getUrl(sdkLink),
                }];
            });
        });
    };
    SiteStore.prototype.getCurrentCurrency = function() {
        return this.getCurrencyHeader() || this.currency;
    };
    SiteStore.prototype.handleGetConfigData = function(data) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function() {
            var _c, encodedInstance, parsedInstance;
            return __generator(this, function(_d) {
                switch (_d.label) {
                    case 0:
                        return [4 /*yield*/ , this.handleExperiments(data.experiments)];
                    case 1:
                        _d.sent();
                        this.customUrlApi = new CustomUrlApi(this.location.buildCustomizedUrl);
                        _c = this;
                        return [4 /*yield*/ , this.getSectionUrl(PageMap.CART)];
                    case 2:
                        _c.isCartExists = !!(_d.sent()).url;
                        this.locale = data.clientConfig.language;
                        this.currency = data.clientConfig.storeCurrency;
                        this.layoutDirection = data.clientConfig.layoutDirection;
                        this.premiumFeatures = data.premiumFeatures;
                        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain, @typescript-eslint/tslint/config
                        this.taxName = (_b = (_a = data.localeData) === null || _a === void 0 ? void 0 : _a.countries[0].properties) === null || _b === void 0 ? void 0 : _b.taxName;
                        /* istanbul ignore if */
                        if (!this.isSiteMode()) {
                            encodedInstance = this.instanceManager
                                .getInstance()
                                .substring(this.instanceManager.getInstance().indexOf('.') + 1);
                            parsedInstance = JSON.parse(atob(encodedInstance));
                            // @ts-expect-error
                            this.biLogger.biLoggerClientFactoryInstance.updateDefaults({
                                uuid: parsedInstance.uid
                            });
                        }
                        if (!data.priceSettings) {
                            return [2 /*return*/ ];
                        }
                        this.priceSettings = __assign(__assign({}, this.priceSettings), {
                            showPriceRange: Boolean(data.priceSettings.showPriceRange),
                            showTaxDisclaimer: Boolean(data.priceSettings.showTaxDisclaimer),
                            taxOnProduct: Boolean(data.priceSettings.taxOnProduct),
                            shippingDisclaimer: data.priceSettings.shippingDisclaimer
                        });
                        return [2 /*return*/ ];
                }
            });
        });
    };
    /* istanbul ignore next: todo: test */
    SiteStore.prototype.handleExperiments = function(gqlExperiments) {
        if (gqlExperiments === void 0) {
            gqlExperiments = [];
        }
        var experimentsConductedByPlatform = this.platformServices.essentials.experiments.all();
        var experiments = this.platformServices.essentials.experiments.enabled(SPECS.ShouldUseOnlyPlatformExperiments) ?
            {} :
            gqlExperiments.reduce(function(acc, e) {
                var _a;
                return (__assign(__assign({}, acc), (_a = {}, _a[e.name] = e.value, _a)));
            }, {});
        this.experiments = new Experiments({
            experiments: __assign(__assign({}, experiments), experimentsConductedByPlatform)
        });
        return this.experiments.ready();
    };
    /* istanbul ignore next: todo: test */
    SiteStore.prototype.purgeMemoryCache = function() {
        var cachedLang = this.storage.memory.getItem(CacheKey.MULTI_LANG);
        if (cachedLang !== this.windowApis.multilingual.currentLanguage) {
            this.storage.memory.clear();
            this.storage.memory.setItem(CacheKey.MULTI_LANG, this.windowApis.multilingual.currentLanguage);
        }
    };
    Object.defineProperty(SiteStore.prototype, "biStorefrontViewMode", {
        get: function() {
            if (this.isPreviewMode()) {
                return BI_STOREFRONT_VIEW_MODE.PREVIEW;
            }
            if (this.isEditorMode()) {
                return BI_STOREFRONT_VIEW_MODE.EDITOR;
            }
            return BI_STOREFRONT_VIEW_MODE.SITE;
        },
        enumerable: false,
        configurable: true
    });
    SiteStore.prototype.trackMiniCartExists = function() {
        var _this = this;
        this.pubSubManager.subscribe('Minicart.LoadedWithoutData', function() {
            return (_this.isMiniCartExists = true);
        }, true);
    };
    return SiteStore;
}(EcomHttpClient));
export {
    SiteStore
};
//# sourceMappingURL=SiteStore.js.map