// @ts-check
import promisifyObserver from '../utils/promisifyObserver.js';
import fcpPolyfill from '../polyfills/fcp.js';

const entryType = 'paint';

const FCP = 'fcp';

const MAP_NAME = {
    'first-paint': 'fp',
    'first-contentful-paint': FCP,
};

/**
 * Get FCP
 * @param {import('../utils/utils.js').State} state
 */
export default function fcp([window, , PerformanceObserver]) {
    const paints = {
        entryType: `initial-${entryType}`,
    };
    return promisifyObserver(
        PerformanceObserver,
        entryType,
        (entries, resolve) => {
            const done = entries.reduce((acc, {
                name,
                startTime
            }) => {
                name = MAP_NAME[name] || name;
                paints[name] = startTime;
                return acc || name === FCP;
            }, false);
            if (done) {
                resolve(paints);
            }
        },
    ).catch(() => fcpPolyfill(window, paints.entryType));
}