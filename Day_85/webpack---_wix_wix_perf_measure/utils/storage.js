import {
    analyticsAllowed
} from './consent.js';
import config from './config.js';

/**
 * Get value from localStorage if consent allows, remove it otherwise
 * @param {Window} window
 * @param {string} key
 */
export function get(window, key) {
    return storageOp(window, key, (localStorage, k) => localStorage.getItem(k));
}

/**
 * Set value to localStorage if consent allows, remove it otherwise
 * @param {Window} window
 * @param {string} key
 * @param {*} value
 */
export function set(window, key, value) {
    storageOp(window, key, (localStorage, k) => localStorage.setItem(k, value));
}

/**
 * Remove value from localStorage
 * @param {Window} window
 * @param {string} key
 */
export function remove(window, key) {
    storageOp(window, key);
}

function storageOp(window, key, cb) {
    key = `${config.storagePrefix}-${key}`;
    try {
        const {
            localStorage
        } = window;
        if (cb && analyticsAllowed(window)) {
            return cb(localStorage, key);
        }
        localStorage.removeItem(key);
    } catch (e) {
        // empty
    }
}