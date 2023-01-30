// @ts-check
import {
    noop,
    allFulfilled
} from '../utils/utils.js';

const TTI_LABEL = 'tti';
const LCP_LABEL = 'lcp';

/**
 * Create marks and measures for performance metrics
 * @param {Performance} performance
 * @param {Promise<Readonly<{}>>[]} measurements
 */
export function markAndMeasure(performance, measurements) {
    allFulfilled(measurements).then((values) => {
        const {
            tti,
            tbt,
            lcp
        } = find(values, 'loaded');
        if (!mark(TTI_LABEL, tti, tbt)) {
            performance.clearMarks(TTI_LABEL); // Don't show wrong mark/measure on limited browsers
            return;
        }
        mark(LCP_LABEL, lcp);

        const {
            fcp
        } = find(values, 'initial-paint');
        const lcpFirst = lcp < tti;
        const lcpDuration = {
            start: lcpFirst ? fcp : tti,
            end: lcp,
        };
        const ttiDuration = {
            start: lcpFirst ? lcp : fcp,
            end: tti,
            detail: tbt,
        };
        measure(performance, LCP_LABEL, lcpDuration);
        measure(performance, TTI_LABEL, ttiDuration);
    }, noop);

    /**
     * @param {{entryType: string}[]} values
     * @param {string} et
     * @returns {{fcp: number, tti: number, tbt: number, lcp: number}}
     */
    function find(values, et) {
        return /** @type {Object} */ (
            values.find(({
                entryType
            }) => entryType === et) || {}
        );
    }

    /**
     * @param {string} label
     * @param {number} startTime
     * @param {any} [detail]
     */
    function mark(label, startTime, detail) {
        if (startTime) {
            return /** @type {(string, Object) => Object} */ (performance.mark)(
                label, {
                    startTime,
                    detail,
                },
            );
        }
    }
}

/**
 * Create measure for page metrics
 * @param {Performance} performance
 * @param {{pn: number, startTime: number, tti: number, tbt: number}} page
 */
export function measurePage(performance, {
    pn,
    startTime,
    tti,
    tbt
}) {
    measure(performance, `page #${pn} tti`, {
        start: startTime,
        end: tti,
        detail: tbt,
    });
}

/**
 * @param {Performance} performance
 * @param {string} label
 * @param {{start: number, end: number, detail?: any}} options
 */
function measure(performance, label, options) {
    if (options.end > options.start) {
        // TODO: fix syntax error as in this ticket https://jira.wixpress.com/browse/TB-6232
        try {
            performance.measure(label, options);
        } catch (e) {}
    }
}