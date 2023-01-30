// @ts-check
import {
    MARKER
} from './constants.js';

/**
 * @typedef {new (callback: PerformanceObserverCallback) => PerformanceObserver} PerformanceObserverType
 * @typedef {[Window & typeof globalThis,Performance,PerformanceObserverType,((handler:TimerHandler,timeout?:number) => number),((handle:number) => void)]} State
 */

export function noop() {}

export const label = (s) => `${MARKER}${s}`;

export function rejector(value) {
    return () => Promise.reject(value);
}

function isType(type) {
    return (v) => typeof v === type;
}
export const isUndefined = isType('undefined');
export const isNumber = isType('number');
export const isBoolean = isType('boolean');
export const isString = isType('string');

export function round(obj) {
    return Object.entries(obj)
        .filter(([, value]) => typeof value === 'number')
        .reduce((acc, [key, value]) => {
            acc[key] = Math.round(value);
            return acc;
        }, obj);
}

/**
 * Shorten URL to imporant part
 * @param {string} url
 */
export function excludeSearch(url) {
    return url && url.replace(/\?.*$/, '');
}

/**
 * Return the first entry for an entry type, if it exists
 * @param {Performance} performance
 * @param {string} entryType
 * @returns {PerformanceEntry|undefined}
 */
export function getFirstEntryByType(performance, entryType) {
    return performance.getEntriesByType ? .(entryType) ? .[0];
}

/**
 * Extracts a field value from a promise return
 * @param {Promise} promise
 * @param {string|number} field
 */
export function extract(promise, field) {
    return promise.then(({
        [field]: value
    }) => value);
}

/**
 * Finish function factory
 * @template T
 * @param {Array<T>} cbs
 * @param {T} cb
 * @param {() => void} terminate
 */
export function handleFinish(cbs, cb, terminate) {
    return () => {
        const index = cbs.indexOf(cb);
        if (index > -1) {
            cbs.splice(index, 1);
            if (cbs.length === 0) {
                terminate();
            }
        }
    };
}

/**
 * Create disconnect handler
 * @param {PerformanceObserver | undefined} observer
 */
export function disconnectHandler(observer) {
    return () => observer ? .disconnect();
}

/**
 * Get id of closest containing ancestor that has an id, or id param if provided
 * @param {Element} [element]
 */
export function getClosestElementWithId(element) {
    return closestSelector(element, '*[id]') || element;
}

/**
 * Get id of closest containing ancestor that has an id, or id param if provided
 * @param {Element} [element]
 * @param {string} [id]
 */
export function closestId(element, id) {
    return id || closestSelector(element, '*[id]') ? .id;
}

/**
 * Get container element
 * @param {Element} [element]
 */
export function closestContainer(element) {
    return (
        closestSelector(
            element,
            'h1,h2,h3,h4,h5,h6,p,picture,wix-image,wow-image,article,section',
        ) || element
    );
}

/**
 * @param {Element | undefined} element
 * @param {string} selector
 */
export function closestSelector(element, selector) {
    return element ? .closest(selector);
}

/**
 * Add field value to property bag, coercing to boolean if name starts with "is"
 * @param {Object} target
 * @param {string} key
 * @param {*} value
 */
export function addField(target, key, value) {
    if (!isUndefined(value)) {
        target[key] = /^is/.test(key) ? !!value : value;
    }
}

/**
 * Waits until all promises are settled, and return promise with fulfilled values
 * @template T
 * @param {Promise<T>[]} promises
 */
export function allFulfilled(promises) {
    return /** @type {any} */ (Promise)
        .allSettled(promises)
        .then((results) =>
            results
            .filter(({
                status
            }) => status === 'fulfilled')
            .map((result) => result.value),
        );
}

/**
 * Combine multiple fulfilled entries into a single entry
 * @param {string} entryType
 * @param  {...Promise} promises
 */
export function batch(entryType, ...promises) {
    return new Promise((resolve) => {
        allFulfilled(promises).then((values) => {
            const result = values.reduce(
                (acc, value) => Object.assign(acc, value), {},
            );
            result.entryType = entryType;
            resolve(result);
        });
    });
}

export const objectAssignDeep = (partialData, data) => {
    Object.entries(partialData).forEach(([key, value]) => {
        if (typeof value === 'object') {
            if (!data[key]) {
                data[key] = value;
            } else {
                objectAssignDeep(partialData[key], data[key]);
            }
        } else {
            data[key] = partialData[key];
        }
    });
};