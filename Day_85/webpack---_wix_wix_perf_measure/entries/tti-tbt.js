// @ts-check
import config from '../utils/config.js';
import observeResources, {
    isScript,
    isAjax,
} from '../utils/observeResources.js';
import {
    noop,
    rejector
} from '../utils/utils.js';
import {
    dcl
} from '../utils/windowEvents.js';
import longtasks from '../polyfills/longtasks.js';

const entryType = 'interactive';
const {
    max,
    min
} = Math;

/**
 * Get TTI and TBT attributes
 * @param {import('../utils/utils.js').State} state
 * @param {Promise<number>} start
 * @param {Promise<{startTime: number, delay: number}>} [interaction]
 */
export default function tti_tbt(state, start, interaction) {
    const [window, , PerformanceObserver, setTimeout, clearTimeout] = state;
    const {
        resourceDebounce,
        taskDelta,
        ttiDurationInc
    } = config;

    return start
        .then(
            (start) =>
            new Promise((resolve) => {
                let finished = start;

                let ltDone = true;
                let ltTimer = 0;
                const lts = [];
                const ltStop = longtasks(state, (entries) => {
                    lts.push(...entries);
                    ltDone = false;
                    clearTimeout(ltTimer);
                    ltTimer = setTimeout(() => {
                        ltDone = true;
                        checkDone();
                    }, taskDelta);
                });

                const dclPromise = dcl(window);
                let resourceDone = false;
                let resourceTimer = setTimeout(checkResourceDone, resourceDebounce);
                const {
                    finish: resourceStop
                } = observeResources(
                    PerformanceObserver,
                    (rs) => {
                        rs = rs.filter((r) => isAjax(r) || isScript(r));
                        if (rs.length) {
                            resourceDone = false;
                            finished = rs.reduce(
                                (acc, {
                                    startTime,
                                    duration
                                }) =>
                                max(acc, startTime + duration),
                                finished,
                            );
                            // TTI cannot happen before DCL otherwise SSR failures will get great TTI scores which is wrong
                            dclPromise.then(({
                                startTime
                            }) => {
                                finished = max(startTime, finished);
                                clearTimeout(resourceTimer);
                                resourceTimer = setTimeout(
                                    checkResourceDone,
                                    resourceDebounce,
                                );
                            });
                        }
                    },
                    false,
                );

                interaction ? .then(
                    ({
                        startTime,
                        delay
                    }) => done(startTime + delay),
                    noop,
                );

                function checkResourceDone() {
                    resourceDone = true;
                    checkDone();
                }

                function checkDone() {
                    if (ltDone && resourceDone) {
                        done(1000000);
                    }
                }

                function done(interactionEnd) {
                    ltStop();
                    resourceStop();
                    resolve([lts, start, finished, interactionEnd]);
                }
            }),
        )
        .then(([lts, start, finished, interactionEnd]) => {
            const tti = calc_tti(lts, start, finished, interactionEnd);
            const {
                document,
                innerHeight
            } = window;
            const tbt = calc_tbt(lts, tti);
            const result = {
                tti,
                tbt,
                iframes: /** @type {Document} */ (document).querySelectorAll('iframe')
                    .length,
            };
            const pageHeight = max(document.body.offsetHeight, innerHeight);
            if (pageHeight > 0) {
                result.screens = document.body.scrollHeight / pageHeight;
            }
            return result;
        })
        .catch(rejector(entryType));

    function calc_tti(lts, start, finished, interactionEnd) {
        if (start === finished) {
            finished += ttiDurationInc;
        }
        let tail = lts.findIndex(({
            startTime,
            duration
        }) => {
            if (startTime > finished + taskDelta) {
                return true;
            }
            finished = max(finished, startTime + duration);
        });
        if (tail === -1) {
            tail = lts.length;
        }
        const found =
            tail > 0 ? ((llt) => llt.startTime + llt.duration)(lts[tail - 1]) : 0;
        return max(min(found, interactionEnd), start);
    }

    function calc_tbt(lts, tti) {
        let tbt = 0;
        for (let i = 0; i < lts.length; ++i) {
            const {
                startTime,
                duration
            } = lts[i];
            if (startTime > tti) {
                break;
            }
            tbt += max(duration - 50, 0);
        }
        return tbt;
    }
}