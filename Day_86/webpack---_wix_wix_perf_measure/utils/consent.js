// @ts-check
import {
    excludeSearch
} from './utils.js';

const ESSENTIAL_FIELDS = {
    analytics: true,
    entryType: true,
    clientType: true,
    version: true,
    cores: true,
    memory: true,
    effectiveType: true,
    rtt: true,
    download: true,
    saveData: true,
    url: true,
    dns: true,
    tcp: true,
    ssl: true,
    ttfb: true,
    redirect: true,
    fetchStart: true,
    response: true,
    navigationType: true,
    protocol: true,
    pageCaching: true,
    _brandId: true,
    viewerName: true,
    v: true,
    dc: true,
    microPop: true,
    cdn: true,
    msid: true,
    pageId: true,
    fp: true,
    fcp: true,
    tti: true,
    tbt: true,
    lcp: true,
    lcpSize: true,
    closestId: true,
    lcpTag: true,
    lcpResourceType: true,
    lcpFontClass: true,
    lcpInLightbox: true,
    cls: true,
    countCls: true,
    clsId: true,
    clsTag: true,
    clsOld: true,
    ttlb: true,
    dcl: true,
    transferSize: true,
    decodedBodySize: true,
    isSsr: true,
    ssrDuration: true,
    ssrTimestamp: true,
    startTime: true,
    duration: true,
    delay: true,
    action: true,
    type: true,
    pn: true,
    count: true,
    simLH6: true,
    isMobile: true,
    maybeBot: true,
    btype: true,
    numOfResponsivenessEvents: true,
    worstLatency: true,
    actions: true,
    elementType: true,
    worstLatencyByEntry: true,
    compId: true,
    loadState: true,
    countScripts: true,
};

/**
 * Apply consent policy restrictions
 * @param {Object} window
 * @param {Object} measurement
 */
export function applyConsent(window, measurement) {
    if (Symbol.iterator in measurement) {
        return measurement;
    }

    measurement.analytics = analyticsAllowed(window);
    if (measurement.analytics) {
        return measurement;
    }

    return Object.entries(measurement)
        .filter(([key]) => ESSENTIAL_FIELDS[key])
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
}

/**
 * Shorten URL to imporant part
 * @param {string} url
 * @param {Object} window
 */
export function fixURL(url, window) {
    const e = /^https?:\/\/(?:www\.)?(.*)/.exec(url);
    const short = e ? e[1] : url;
    return analyticsAllowed(window) ? short : excludeSearch(short);
}

export function analyticsAllowed({
    consentPolicyManager
}) {
    return !!consentPolicyManager ? .getCurrentConsentPolicy() ? .policy ? .analytics;
}