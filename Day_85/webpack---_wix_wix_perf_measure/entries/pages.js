// @ts-check
import interaction from '../utils/interaction.js';
import tti_tbt from './tti-tbt.js';
import {
    addEventListener
} from '../utils/windowEvents.js';
import config from '../utils/config.js';
import {
    excludeSearch
} from '../utils/utils.js';
import {
    fixURL
} from '../utils/consent.js';
import sequence from '../utils/sequence.js';
import {
    measurePage
} from '../actions/markAndMeasure';
import observe from '../utils/observe.js';

const subEntryType = 'page-transition';
const entryType = `${subEntryType}s`;

let pn = 0;

/**
 * Get page transition duration
 * @param {import('../utils/utils.js').State} state
 */
export default function pages(state) {
    const [window, performance, PerformanceObserver] = state;
    let origin = getCurrentURL();
    const {
        clientType,
        pageEvent
    } = config;

    const {
        report,
        result
    } = sequence(window, entryType, pageEvent);

    addEventListener(
        window,
        'popstate',
        ({
            type,
            timeStamp
        }) => _report(type, timeStamp, 0),
        false,
    );
    if (!observe(PerformanceObserver, 'event', eventTiming, false, {
            durationThreshold: 1,
        })) {
        interaction(state, _report, ['click']);
    }

    let measuring = false;
    return result;

    /**
     * @param {PerformanceEntryList} entries
     */
    function eventTiming(entries) {
        // Loop from end
        entries.reduceRight((acc, entry) => {
            const {
                name
            } = entry;
            if (name === 'click' || name === 'keyup') {
                _report(name, entry.startTime, entry.duration);
            }
            return acc;
        }, undefined);
    }

    /**
     * @param {string} action
     * @param {number} startTime
     * @param {number} delay
     */
    function _report(action, startTime, delay) {
        if (measuring) {
            return;
        }
        measuring = true;

        tti_tbt(state, Promise.resolve(startTime + delay)).then((finish) => {
            measuring = false;
            const destination = getCurrentURL();
            if (urlChanged(origin, destination)) {
                const duration = finish.tti - startTime;
                const value = {
                    entryType: subEntryType,
                    clientType,
                    origin,
                    destination,
                    action,
                    startTime,
                    delay,
                    duration,
                    pn: ++pn,
                    ...finish,
                };
                origin = destination;
                report(value);
                if (!config.noMeasure) {
                    measurePage(performance, value);
                }
            }
        });
    }

    function getCurrentURL() {
        return fixURL(window.location.href, window);
    }

    function urlChanged(origin, destination) {
        return excludeSearch(origin) !== excludeSearch(destination);
    }
}

export function getPn() {
    return pn;
}