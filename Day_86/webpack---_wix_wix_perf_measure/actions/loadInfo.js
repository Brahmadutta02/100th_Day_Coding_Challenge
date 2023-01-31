import {
    noop
} from '../utils/utils.js';

// @ts-check
/* global process, requirejs */
const INFO_LABEL = 'wix-perf-measure-info';

/**
 * @type {Promise}
 */
let info;

/**
 * @typedef {import('../utils/utils.js').State} State
 */

/**
 * Load and execgit statute info helper
 * @param {State} state
 * @param {Document} document
 * @param {string} src
 * @param {Promise[]} measurements
 * @param {import('../entries/crux.js').getCurrentLcp} getCurrentLcp
 * @param {(state: State) => (import('../entries/cls.js').LayoutShiftResult | undefined)} cls
 */
export default function loadInfo(
    state,
    document,
    src,
    measurements,
    getCurrentLcp,
    cls,
) {
    Object.defineProperty(measurements, 'info', {
        value() {
            const [window] = state;
            if (typeof process === 'undefined') {
                /** @type {Object} */
                (window).process = {
                    env: {}
                }; // It's OK to leak it for debugging
            }
            if (process.env.NODE_ENV !== 'production') {
                // removed in production
                if (!info) {
                    info =
                        import ('../info.js');
                }
                return info.then(invoke).catch(fail);
            }
            if (!info) {
                info = new Promise((resolve, reject) => {
                    if (!src) {
                        return reject();
                    }
                    const script = document.createElement('script');
                    script.src = src.replace('measure.', 'measure-info.');
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            }
            info
                .then(() => {
                    // @ts-ignore
                    if (typeof requirejs === 'function') {
                        // @ts-ignore
                        requirejs([INFO_LABEL], invoke, fail);
                    } else {
                        invoke(window[INFO_LABEL]);
                    }
                })
                .catch(fail);

            function invoke(r) {
                if (r) {
                    r.default(measurements, getCurrentLcp().catch(noop), cls(state));
                } else {
                    fail();
                }
            }

            function fail() {
                console.info('Failed to load info'); // eslint-disable-line no-console
            }
        },
    });
}