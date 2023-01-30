// @ts-check
import config from '../utils/config.js';
import {
    rejector,
    closestId,
    closestContainer,
    closestSelector,
    noop,
} from '../utils/utils.js';
import promisifyObserver from '../utils/promisifyObserver.js';

export const entryType = 'largest-contentful-paint';

/**
 * Get LCP attributes
 * @param {import('../utils/utils.js').State} state
 * @param {Promise} interactive
 * @param {Promise} visibility
 * @param {Promise} interaction
 */
export default function lcp(
    [, performance, PerformanceObserver, setTimeout, clearTimeout],
    interactive,
    visibility,
    interaction,
) {
    return interactive.then(({
        tti
    }) => {
        const {
            resourceDebounce
        } = config;

        let timer;
        const timeout = new Promise((resolve) => {
            const delay = Math.max(resourceDebounce - (performance.now() - tti), 0);
            timer = setTimeout(resolve, delay);
        });

        const lcpPromise = promisifyObserver(
            PerformanceObserver,
            entryType,
            (entries, resolve) => {
                clearTimeout(timer);
                timer = setTimeout(
                    () => resolve(entries[entries.length - 1]),
                    resourceDebounce,
                );
            },
        );

        return Promise.race([
                lcpPromise,
                timeout,
                visibility.then(noop),
                interaction.then(noop),
            ])
            .then((lcpFound) => {
                const records = lcpPromise.takeRecords ? .();
                // @ts-ignore
                const [lcpFoundMore] = records ? .slice(-1);
                return lcpResult(lcpFoundMore || lcpFound);
            })
            .catch(rejector(entryType));
    });
}

/**
 * @typedef {Object} LargestContentfulPaintType
 * @property {number} startTime
 * @property {number} size
 * @property {string} url
 * @property {string} id
 * @property {Element} [element]
 *
 * @typedef {LargestContentfulPaintType & PerformanceEntry} LargestContentfulPaint
 */

/**
 * Calculate LCP result from measurement
 * @param {LargestContentfulPaint} lcp
 */
export function lcpResultValue(lcp) {
    const {
        startTime,
        size,
        url,
        element,
        id
    } = lcp;
    const container = closestContainer(element);
    const lcpTag = container ? .tagName;
    const lcpFontClass = getFontClass(container);
    const cid = closestId(element, id);
    const m = /\.(jpe?g|png|gif|svg|webp)/i.exec(url);
    const lcpResourceType =
        m ? .[1] ? .toLowerCase().replace('jpeg', 'jpg') || 'other';

    return {
        entryType,
        lcp: startTime,
        lcpSize: size,
        ...(cid && {
            closestId: cid
        }),
        ...(lcpTag && {
            lcpTag
        }),
        ...(url && {
            lcpResourceType
        }),
        ...(lcpFontClass && {
            lcpFontClass
        }),
        lcpInLightbox: inLightbox(element),
    };
}

/**
 * Calculate LCP result from measurement
 * @param {LargestContentfulPaint} [lcp]
 */
export function lcpResult(lcp) {
    if (!lcp) {
        return Promise.reject(entryType);
    }

    return Promise.resolve(lcpResultValue(lcp));
}

function getFontClass(element) {
    if (element) {
        for (const cls of element.classList) {
            const m = /^font_\d$/.exec(cls);
            if (m) {
                return m[0];
            }
        }
    }
}

function inLightbox(element) {
    return closestSelector(element, '#POPUPS_ROOT') !== null;
}