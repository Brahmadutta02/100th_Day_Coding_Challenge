// @ts-check
import {
    load
} from '../utils/windowEvents.js';
import {
    isNumber,
    getFirstEntryByType
} from '../utils/utils.js';

const entryType = 'navigation-finish';

const CACHE_LIMIT_MS = 13;
const CDN_LIMIT_MS = 333;

const BROWSER = 'browser';
const ETAG = 'eTag';
const MAYBE = 'maybe';

/**
 *
 * @param {import('../utils/utils.js').State} state
 */
export default function navFinish([, performance]) {
    return load(window).then(() => {
        const {
            timing
        } = performance;
        const {
            navigationStart,
            domContentLoadedEventEnd,
            loadEventEnd
        } = timing;
        let {
            responseEnd
        } = timing;
        if (!(responseEnd >= navigationStart)) {
            responseEnd = timing.domInteractive || timing.domContentLoadedEventStart;
        }
        const navigation = /** @type {PerformanceNavigationTiming} */ (
            getFirstEntryByType(performance, 'navigation')
        );
        const pageCaching = determineCaching(navigation);
        const result = {
            entryType,
            duration: loadEventEnd - navigationStart,
            ttlb: responseEnd - navigationStart,
            dcl: domContentLoadedEventEnd - navigationStart,
            ...(navigation && {
                transferSize: navigation.transferSize,
                decodedBodySize: navigation.decodedBodySize,
            }),
            ...(pageCaching && {
                pageCaching
            }),
        };
        return result;
    });
}

function determineCaching(navigation) {
    if (navigation) {
        const {
            requestStart,
            responseStart,
            responseEnd,
            transferSize,
            encodedBodySize,
        } = navigation;
        if (isNumber(transferSize)) {
            if (transferSize === 0) {
                return BROWSER;
            }
            if (transferSize < encodedBodySize) {
                return ETAG;
            }
        } else {
            if (responseStart - requestStart < CACHE_LIMIT_MS) {
                return BROWSER;
            }
            if (responseEnd - responseStart < CACHE_LIMIT_MS) {
                return `${MAYBE} ${ETAG}`;
            }
        }
        if (responseEnd - responseStart < CDN_LIMIT_MS) {
            return `${MAYBE} CDN`;
        }
    }
}