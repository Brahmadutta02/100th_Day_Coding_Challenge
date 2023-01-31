"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", {
    value: true
});
var reportPhaseStarted_1 = require("./reportPhaseStarted");
var version = 'v5';
var _window = window;
var userAgent = ((_c = (_b = (_a = _window.navigator) === null || _a === void 0 ? void 0 : _a.userAgent) === null || _b === void 0 ? void 0 : _b.toLowerCase) === null || _c === void 0 ? void 0 : _c.call(_b)) || '';
// @ts-ignore Checking documentMode to detect IE
var isIEbyDocumentMode = !!((_d = _window.document) === null || _d === void 0 ? void 0 : _d.documentMode);
// eslint-disable-next-line
var isIEByUA = !!(userAgent.match(/msie\s([\d.]+)/) || userAgent.match(/trident\/[\d](?=[^\?]+).*rv:([0-9.].)/));
var isIE = isIEbyDocumentMode || isIEByUA;
var requiredBrowserNativeApis = ['customElements', 'IntersectionObserver', 'ResizeObserver'];
var supportsNativeBrowserApis = function() {
    return requiredBrowserNativeApis.every(function(api) {
        return api in window;
    });
};
var isOldBrowser = !supportsCssVars() || !supportsCssGrid() || !supportsES2017() || !supportsNativeBrowserApis();
if (isIE || isOldBrowser) {
    _window.__browser_deprecation__ = true; // Used to stop the JS flow in clientRunner
    hideBody(); // Hide the HTML generated by SSR
    muteSentry(); // Needs to happen synchronously as Sentry loader is embedded on VM
    // Continue the flow (runDeprecationFlow) when DOM is ready
    if (document.readyState === 'complete') {
        runDeprecationFlow();
    } else {
        document.addEventListener('readystatechange', function onReadyStateChange() {
            if (document.readyState === 'complete') {
                runDeprecationFlow();
            }
        });
    }
}

function runDeprecationFlow() {
    clearDomFromSSR();
    showDeprecationMessage();
    reportBI();
}

function hideBody() {
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.appendChild(document.createTextNode('body { visibility: hidden; }'));
    head.appendChild(style);
}

function clearDomFromSSR() {
    var siteContainer = document.getElementById('SITE_CONTAINER');
    siteContainer && (siteContainer.innerHTML = '');
}

function showDeprecationMessage() {
    var iframe = document.createElement('iframe');
    var iframeUrl = getIframeUrlForOldBrowserMessage();
    iframe.setAttribute('src', iframeUrl);
    iframe.setAttribute('style', 'position: fixed; top: 0; left: 0; width: 100%; height: 100%');
    iframe.onload = function() {
        document.body.style.visibility = 'visible';
    };
    document.body.appendChild(iframe);
}

function getIframeUrlForOldBrowserMessage() {
    var _a;
    var userLanguage = ((_a = _window.viewerModel) === null || _a === void 0 ? void 0 : _a.language.userLanguage) || 'en';
    var supportedLanguages = {
        pt: 1,
        fr: 1,
        es: 1,
        de: 1,
        ja: 1
    };
    var messageLanguage = supportedLanguages[userLanguage] ? userLanguage : 'en';
    return "https://static.parastorage.com/services/wix-thunderbolt/dist/deprecation-".concat(messageLanguage, ".").concat(version, ".html");
}

function reportBI() {
    (0, reportPhaseStarted_1.reportPhaseStarted)('browser_not_supported');
}

function muteSentry() {
    _window.Sentry = {
        mute: true
    };
}

function supportsCssVars() {
    var _a, _b;
    var styleElement = document.createElement('style');
    styleElement.innerHTML = ':root { --tmp-var: bold; }';
    document.head.appendChild(styleElement);
    var isSupported = !!(_window.CSS && _window.CSS.supports && _window.CSS.supports('font-weight', 'var(--tmp-var)'));
    (_b = (_a = styleElement.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild) === null || _b === void 0 ? void 0 : _b.call(_a, styleElement);
    return isSupported;
}

function supportsCssGrid() {
    var el = document.createElement('div');
    return typeof el.style.grid === 'string';
}

function supportsES2017() {
    try {
        /* eslint-disable no-new-func */
        // ES6 features
        new Function('let x = 1');
        new Function('const x = `1`');
        new Function('class X {}');
        new Function('const x = (a = 0, ...b) => a');
        new Function('const x = {...Object}');
        new Function('const y = 1; const x = {y}');
        new Function('const x = (function*() { yield 1; })().next().value === 1');
        // ES2017 features
        new Function('const x = async () => await new Promise(res => res(true))');
        new Function('const objWithTrailingComma = {a: 1, b: 2,}');
        new Function('const arrWithTrailingComma = [1,2,3,]');
        Object.entries({});
        Object.values({});
        'x'.padStart(3, 'A').padEnd(5, 'B');
        Object.getOwnPropertyDescriptor({
            a: 1,
            b: 2
        }, 'a');
        // Starting from Chrome 61 we don't load polyfills (nomodule support), but Object.fromEntries was added only in Chrome 73
        Object.fromEntries([
            ['a', 1]
        ]);
        /* eslint-enable no-new-func */
    } catch (e) {
        return false;
    }
    return true;
}
//# sourceMappingURL=browser-deprecation.js.map