// @ts-check
import takeRecords from '../utils/takeRecords.js';
import {
    CLS_FACTOR
} from '../utils/constants.js';
import {
    closestId,
    closestContainer
} from '../utils/utils.js';
import config from '../utils/config.js';

const entryType = 'layout-shift';

/**
 * @typedef {Object} LayoutShiftAttribution
 * @property {Node} [node]
 * @property {DOMRectReadOnly} currentRect;
 *
 * @typedef {Object} LayoutShiftType
 * @property {number} startTime
 * @property {number} value
 * @property {boolean} hadRecentInput;
 * @property {Array<LayoutShiftAttribution>} sources
 *
 * @typedef {LayoutShiftType & PerformanceEntry} LayoutShift
 *
 * @typedef {Object} LayoutShiftResult
 * @property {number} cls
 * @property {number} countCls
 * @property {string} [clsId]
 * @property {string} [clsTag]
 * @property {Element} [element]
 */

const WINDOW = {
    MAX_SIZE: 200,
    MAX_INTERVAL: 100,
};
const NO_WINDOW = {
    MAX_SIZE: 10 _000_000,
    MAX_INTERVAL: 10 _000_000,
};

/**
 * Get CLS attributes
 * @param {import('../utils/utils.js').State} state
 * @param {boolean} [shouldGetElement]
 * @returns {LayoutShiftResult | undefined}
 */
export default function cls([, , PerformanceObserver], shouldGetElement) {
    const entries = takeRecords(PerformanceObserver, entryType);
    if (!entries) {
        return;
    }

    const window = config.newClsMethod ? WINDOW : NO_WINDOW;

    let clsOld = 0;
    const [cls, countCls, map] = /** @type {Array<LayoutShift>} */ (entries)
    .filter(({
            hadRecentInput
        }) => !hadRecentInput)
        .map(({
            sources = [],
            value,
            startTime
        }) => {
            clsOld += value;
            // @ts-ignore - will be resolved when moved to TS
            const [node] = sources.reduce(
                // @ts-ignore - will be resolved when moved to TS
                (acc, {
                    node,
                    currentRect: {
                        width,
                        height
                    }
                }) => {
                    const area = width * height;
                    return area < acc[1] ? acc : [node, area];
                }, [null, -1],
            );
            return [value, node, startTime];
        })
        .reduce((acc, entry) => {
            const [current] = acc.slice(-1);
            if (current) {
                const [, , startTime] = entry;
                const [first] = current;
                if (startTime - first[2] < window.MAX_SIZE) {
                    const [last] = current.slice(-1);
                    if (startTime - last[2] < window.MAX_INTERVAL) {
                        current.push(entry);
                        return acc;
                    }
                }
            }
            acc.push([entry]);
            return acc;
        }, [])
        .reduce(
            (acc, sequence) => {
                const value = sequence.reduce((acc, [value]) => acc + value, 0);
                if (value <= acc[0]) {
                    return acc;
                }
                const map = sequence
                    .filter(([, node]) => node)
                    .reduce((acc, [value, node]) => {
                        acc.set(node, value + (acc.get(node) || 0));
                        return acc;
                    }, new Map());
                return [value, sequence.length, map];
            }, [0, 0],
        );

    const result = {
        cls: cls * CLS_FACTOR,
        countCls,
        clsOld: clsOld * CLS_FACTOR,
    };

    if (map) {
        const nodes = [];
        for (const entry of map.entries()) {
            nodes.push(entry);
        }
        if (nodes.length) {
            nodes.sort((a, b) => b[1] - a[1]);

            let node = /** @type {Element} */ (nodes[0][0]);
            if (node ? .nodeType !== Node.ELEMENT_NODE) {
                // @ts-ignore
                node = node.parentElement;
            }
            if (shouldGetElement && node) {
                result.element = closestContainer(node);
            }
            const cid = closestId(node);
            if (cid) {
                result.clsId = cid;
            }
            const {
                tagName
            } = node;
            if (tagName) {
                result.clsTag = tagName;
            }
        }
    }

    return result;
}