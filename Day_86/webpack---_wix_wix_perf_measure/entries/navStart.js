// @ts-check
import {
    getFirstEntryByType,
    isNumber
} from '../utils/utils.js';
import {
    fixURL
} from '../utils/consent.js';

const entryType = 'navigation-start';

const RETRY = {
    COUNT: 10,
    DELAY: 100,
};

/**
 * @param {import('../utils/utils.js').State} state
 */
export default function navStart([window, performance]) {
    return new Promise((resolve, reject) => {
        let count = 0;
        _resolve();

        function _resolve() {
            const {
                navigationStart,
                fetchStart,
                domainLookupStart,
                domainLookupEnd,
                redirectStart,
                redirectEnd,
                connectStart,
                connectEnd,
                secureConnectionStart,
                requestStart,
                responseStart,
            } = performance.timing;
            const ttfb = responseStart - navigationStart;
            if (!(ttfb >= 0)) {
                if (++count > RETRY.COUNT) {
                    reject(entryType);
                } else {
                    setTimeout(_resolve, RETRY.DELAY);
                }
                return;
            }

            const {
                document: {
                    referrer
                },
                location: {
                    href
                },
            } = window;
            const navigation = /** @type {PerformanceNavigationTiming} */ (
                getFirstEntryByType(performance, 'navigation')
            );
            resolve({
                entryType,
                url: fixURL(href, window),
                referrer: fixURL(referrer, window),
                ...(navigation && {
                    navigationType: navigation.type,
                    protocol: navigation.nextHopProtocol,
                }),
                dns: domainLookupEnd - domainLookupStart,
                ...(isNumber(fetchStart) && {
                    fetchStart: fetchStart - navigationStart,
                }),
                ...(redirectEnd && {
                    redirect: redirectEnd - redirectStart
                }),
                ...(secureConnectionStart ?
                    {
                        tcp: secureConnectionStart - connectStart,
                        ssl: connectEnd - secureConnectionStart,
                    } :
                    {
                        tcp: connectEnd - connectStart,
                    }),
                ttfb,
                response: responseStart - requestStart,
            });
        }
    });
}