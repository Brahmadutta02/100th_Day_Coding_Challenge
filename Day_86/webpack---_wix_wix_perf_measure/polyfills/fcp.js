// @ts-check
import {
    addEventListener,
    dcl
} from '../utils/windowEvents.js';
import config from '../utils/config.js';

/**
 * Get FCP polyfill
 * @param {Window} window
 * @param {string} entryType
 */
export default function fcpPolyfill(window, entryType) {
    return new Promise((resolve, reject) => {
        // Use polyfill
        const {
            fcpPolyfill,
            fcpPolyfillId
        } = config;
        if (fcpPolyfill in window) {
            resolvePaint();
        } else {
            addEventListener(window, fcpPolyfill, resolvePaint);
            dcl(window).then(() => {
                if (!window.document.getElementById(fcpPolyfillId)) {
                    reject(entryType);
                }
            });
        }

        function resolvePaint() {
            const when = window[fcpPolyfill];
            resolve({
                entryType,
                fp: when,
                fcp: when,
            });
        }
    });
}