// @ts-check
import {
    addEventListener,
    removeEventListener,
    pagehide,
} from '../utils/windowEvents.js';

const entryType = 'visibility';
const VISIBILITY = 'visibilitychange';

/**
 * Get visibility attributes
 * @param {import('../utils/utils.js').State} state
 * @return {Promise<{entryType: 'visibility', type: string, startTime: number}>}
 */
export default function hidden([window]) {
    return new Promise((resolve) => {
        if (isHidden(window)) {
            return done(VISIBILITY, 0);
        }

        addEventListener(window, VISIBILITY, visibilitychange, false);

        function visibilitychange({
            timeStamp
        }) {
            if (isHidden(window)) {
                removeEventListener(document, VISIBILITY, visibilitychange, false);
                done(VISIBILITY, timeStamp);
            }
        }

        pagehide(window).then(({
            startTime
        }) => done('pagehide', startTime));

        /**
         * @param {string} type
         * @param {number} startTime
         */
        function done(type, startTime) {
            resolve({
                entryType,
                type,
                startTime,
            });
        }
    });
}

/**
 * @param {Window} window
 * @returns {boolean}
 */
export function isHidden({
    document
}) {
    const {
        visibilityState
    } = document;
    return typeof visibilityState === 'undefined' ?
        document.hidden :
        visibilityState === 'hidden';
}