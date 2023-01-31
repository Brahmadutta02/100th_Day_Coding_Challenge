// @ts-check
import {
    noop
} from './utils.js';

/**
 * @callback ObserverCallback
 * @param {PerformanceEntryList} list
 * @param {PerformanceObserver} [observer]
 */

/**
 * Wrapper for PerformanceObserver
 * @param {import('../utils/utils.js').PerformanceObserverType} PerformanceObserver
 * @param {string} type
 * @param {ObserverCallback} [cb = noop]
 * @param {boolean} [buffered = true]
 * @param {object} [more]
 * @returns {PerformanceObserver|undefined}
 */
export default function observe(
    PerformanceObserver,
    type,
    cb = noop,
    buffered = true,
    more,
) {
    if (!PerformanceObserver) {
        return;
    }

    const {
        supportedEntryTypes
    } = /** @type {object} */ (PerformanceObserver);
    if (!supportedEntryTypes || !supportedEntryTypes.includes(type)) {
        return;
    }

    const observer = new PerformanceObserver((list, observer) =>
        cb(list.getEntries(), observer),
    );
    try {
        observer.observe({
            type,
            buffered,
            ...more,
        });
    } catch (e) {
        observer.observe({
            entryTypes: [type],
        });
    }
    return observer;
}