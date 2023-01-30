// @ts-check
import observe from './observe.js';

/**
 * @callback promisifiedObserverCallback
 * @param {PerformanceEntryList} entries
 * @param {(r:*) => void} finish - and report
 * @returns {void}
 */

/**
 * @typedef {Promise & {takeRecords: () => (PerformanceEntryList | undefined)}} promisifiedObserver
 */

/**
 * Wrap PerformanceObserver in a promise
 * @param {import('../utils/utils.js').PerformanceObserverType} PerformanceObserver
 * @param {string} entryType
 * @param {promisifiedObserverCallback} cb
 * @param {boolean} [buffered]
 */
export default function promisifyObserver(
    PerformanceObserver,
    entryType,
    cb,
    buffered,
) {
    let observer;
    const promise = /** @type {promisifiedObserver} */ (
        new Promise((resolve, reject) => {
            observer = observe(
                PerformanceObserver,
                entryType,
                (entries) =>
                cb(entries, (result) => {
                    observer && observer.disconnect && observer.disconnect();
                    resolve(result);
                }),
                buffered,
            );
            if (!observer) {
                reject(entryType);
            }
        })
    );
    promise.takeRecords = () => observer ? .takeRecords ? .();
    return promise;
}