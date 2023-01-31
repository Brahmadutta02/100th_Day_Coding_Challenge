// @ts-check
import {
    MARKER
} from '../utils/constants.js';
import {
    noop,
    allFulfilled
} from '../utils/utils.js';

/**
 * Log measurements to console
 * @param {Promise[]} together
 * @param {Promise[]} individually
 */
export default function log(together, individually) {
    allFulfilled(together).then((values) => values.forEach(doLog), noop);
    individually.forEach((measurement) => measurement.then(doLog, noop));
}

export function doLog(value) {
    console.log(MARKER, value); // eslint-disable-line no-console
}