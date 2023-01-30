// @ts-check
import promisifyObserver from '../utils/promisifyObserver.js';
import {
    closestId
} from '../utils/utils.js';
import fidPolyfill from '../polyfills/fid.js';

const entryType = 'first-input';

/**
 * Resolve FID attribues
 * @param {import('../utils/utils.js').State} state
 */
export default function fid(state) {
    const [, , PerformanceObserver, setTimeout] = state;
    return promisifyObserver(
        PerformanceObserver,
        entryType,
        (entries, resolve) => {
            const {
                name,
                startTime,
                processingStart,
                duration,
                target
            } =
            /** @type {any} */
            (entries[0]);
            const result = {
                entryType,
                action: name,
                startTime,
                delay: processingStart - startTime,
                duration,
            };
            const cid = closestId(target);
            if (cid) {
                result.closestId = cid;
            }
            setTimeout(() => resolve(result), 0);
        },
    ).catch(() => fidPolyfill(state, entryType));
}