// @ts-check
import config from './config.js';
import observeResources from './observeResources.js';
import {
    isNumber
} from './utils.js';

const LARGE_TIME = 1000000;

const {
    min,
    max
} = Math;

/**
 *
 * @param {import('./utils.js').State} state
 * @param {string} entryType
 * @param {Object} options
 * @param {import('./observeResources.js').PerformanceEntryFilter} [options.filter]
 * @param {boolean} [options.tag = true]
 * @param {number} [options.debounce]
 */
export default function collectResources(
    [, , PerformanceObserver, setTimeout, clearTimeout],
    entryType, {
        filter,
        tag = true,
        debounce = config.resourceDebounce
    } = {},
) {
    const promise = new Promise((resolve, reject) => {
            const resources = [];

            let timer = setTimeout(done, debounce);
            const {
                observer,
                finish
            } = observeResources(
                PerformanceObserver,
                (entries) => {
                    if (filter) {
                        entries = entries.filter(filter);
                    }
                    if (entries.length) {
                        resources.push(...entries);
                        clearTimeout(timer);
                        timer = setTimeout(done, debounce);
                    }
                },
                true,
            );

            function done() {
                if (!observer) {
                    return reject();
                }

                const extra = observer.takeRecords ? .();
                if (extra) {
                    resources.push(...extra);
                }
                finish();
                resolve(resources);
            }
        })
        .then((r) => {
            const resources = /** @type {PerformanceResourceTiming[]} */ (r);

            const count = resources.length;
            if (!count) {
                throw entryType;
            }

            const {
                tbd,
                firstResponse,
                lastResponse
            } = resources.reduce(
                (acc, {
                    transferSize,
                    responseStart,
                    responseEnd
                }) => ({
                    tbd: acc.tbd + transferSize,
                    firstResponse: responseStart > 0 && responseStart < acc.firstResponse ?
                        responseStart :
                        acc.firstResponse,
                    lastResponse: max(acc.lastResponse, responseEnd),
                }), {
                    tbd: 0,
                    firstResponse: LARGE_TIME,
                    lastResponse: 0,
                },
            );

            const ttfbs = resources
                .filter(({
                    requestStart
                }) => isNumber(requestStart))
                .map(({
                    requestStart,
                    responseStart
                }) => responseStart - requestStart)
                .sort();
            const {
                length
            } = ttfbs;
            const half = length >> 1;

            const startTime = min(firstResponse, lastResponse);
            const result = {
                count,
                startTime,
                duration: lastResponse - startTime,
                mttfb: length % 2 ? ttfbs[half] : (ttfbs[half - 1] + ttfbs[half]) / 2,
                attfb: ttfbs.reduce((acc, ttfb) => acc + ttfb, 0) / length,
            };
            if (!Number.isNaN(tbd)) {
                result.tbd = tbd;
            }
            return result;
        })
        .catch(() => ({
            count: 0,
        }));

    return tag ? promise.then(tagToAvoidConflicts) : promise;

    function tagToAvoidConflicts(result) {
        const tagLabel = capitalize(entryType);
        return Object.entries(result).reduce((acc, [key, value]) => {
            acc[key + tagLabel] = value;
            return acc;
        }, {});
    }

    function capitalize(s) {
        return s[0].toUpperCase() + s.slice(1);
    }
}