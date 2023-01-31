// @ts-check
import config from './config.js';
import observe from './observe.js';
import {
    handleFinish,
    disconnectHandler
} from './utils.js';

/** @typedef {(entry: PerformanceResourceTiming) => boolean} PerformanceEntryFilter */

/** @type {PerformanceEntryFilter} */
export const isScript = ({
        initiatorType,
        name
    }) =>
    initiatorType === 'script' ||
    (initiatorType === 'link' && /\.js$/.test(name));
/** @type {PerformanceEntryFilter} */
export const isAjax = ({
        initiatorType
    }) =>
    initiatorType === 'fetch' || initiatorType === 'xmlhttprequest';
/** @type {PerformanceEntryFilter} */
export const isImage = ({
        initiatorType,
        name
    }) =>
    initiatorType === 'img' ||
    initiatorType === 'image' ||
    (initiatorType === 'css' && /\.(?:jpe?g|png|webp|gif)/i.test(name));
/** @type {PerformanceEntryFilter} */
export const isFont = ({
        initiatorType,
        name
    }) =>
    (initiatorType === 'css' && name.includes('font')) ||
    /\.(?:woff2?|ttf|eot)/i.test(name);

/**
 * @callback ObserveResourcesCallback
 * @param {PerformanceResourceTiming[]} entries
 * @returns {void}
 */

/**
 * @type {PerformanceObserver | undefined}
 */
let observer;
/**
 * @type {ObserveResourcesCallback[]}
 */
const cbs = [];

/**
 * Report resource as they are downloaded
 * @param {import('../utils/utils.js').PerformanceObserverType} PerformanceObserver
 * @param {ObserveResourcesCallback} cb
 * @param {boolean} buffered
 */
export default function observeResources(PerformanceObserver, cb, buffered) {
    if (cbs.push(cb) === 1) {
        const ignores = config.ignoreResources.split(',');
        observer = observe(
            PerformanceObserver,
            'resource',
            (entries) => {
                entries = entries.filter(
                    ({
                        name
                    }) => !ignores.some((ignore) => name.includes(ignore)),
                );
                if (entries.length) {
                    cbs.forEach((cb) =>
                        cb( /** @type {PerformanceResourceTiming[]} */ (entries)),
                    );
                }
            },
            buffered,
        );
    }
    return {
        observer,
        finish: handleFinish(cbs, cb, disconnectHandler(observer)),
    };
}