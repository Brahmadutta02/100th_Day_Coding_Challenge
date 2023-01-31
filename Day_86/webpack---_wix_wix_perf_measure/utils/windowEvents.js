// @ts-check
import {
    LISTEN,
    LISTEN_ONCE
} from './constants.js';

/**
 * Hook up DOM event handler
 * @param {Window | Document | Element} target
 * @param {string} type
 * @param {EventListenerOrEventListenerObject} listener
 * @param {boolean} [once = true]
 */
export function addEventListener(target, type, listener, once = true) {
    target.addEventListener(type, listener, once ? LISTEN_ONCE : LISTEN);
}
/**
 * Remove DOM event handler
 * @param {Window | Document | Element} target
 * @param {string} type
 * @param {EventListenerOrEventListenerObject} listener
 * @param {boolean} [once = true]
 */
export function removeEventListener(target, type, listener, once = true) {
    target.removeEventListener(type, listener, once ? LISTEN_ONCE : LISTEN);
}

export const dcl = once(
    (readyState) => readyState !== 'loading',
    'DOMContentLoaded',
);
export const load = once((readyState) => readyState === 'complete', 'load');
export const pagehide = once(() => false, 'pagehide', false);

function stateToPromise(window, isState, eventName, delay) {
    return new Promise((resolve) => {
        if (isState(window.document.readyState)) {
            resolve({
                startTime: 0
            });
        } else {
            const _resolve = (ev) => resolve({
                startTime: ev.timeStamp
            });
            const handler = delay ?
                (ev) => setTimeout(() => _resolve(ev), 0) :
                _resolve;
            addEventListener(window, eventName, handler);
        }
    });
}
/**
 * @param {(s:string) => (boolean)} isState
 * @param {string} eventName
 * @param {boolean} [delay = true]
 * @returns {(window: Window) => Promise<{startTime: number}>}
 */
function once(isState, eventName, delay = true) {
    let promise;
    return (window) => {
        if (!promise) {
            promise = stateToPromise(window, isState, eventName, delay);
        }
        return promise;
    };
}

/**
 * Dispatch a custom event
 * @param {Object} window
 * @param {string} label
 * @param {any} detail
 * @param {EventTarget} [target=window]
 */
export function fireEvent(window, label, detail, target = window) {
    target.dispatchEvent(
        new window.CustomEvent(label, {
            detail,
        }),
    );
}