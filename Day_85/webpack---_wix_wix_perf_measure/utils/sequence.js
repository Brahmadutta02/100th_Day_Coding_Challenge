import {
    round
} from './utils.js';
import {
    fireEvent
} from './windowEvents.js';
import {
    applyConsent
} from './consent.js';
import config from './config.js';

/**
 * Construct a value sequence, reported by both async iterator and a custom event
 * @param {Window} window
 * @param {string} entryType
 * @param {string} [eventName]
 */
export default function sequence(window, entryType, eventName) {
    const promises = [];
    const values = [];

    let resolve;
    const next = () => promises.push(new Promise((r) => (resolve = r)));
    next();

    return {
        report: (value) => {
            value = prepareMeasurement(window, value);
            values.push(value);
            resolve({
                value,
            });
            next();
            if (eventName) {
                fireEvent(window, eventName, value);
            }
        },
        result: Promise.resolve({
            entryType,
            [Symbol.iterator]() {
                let index = 0;
                return {
                    next: () => ({
                        value: values[index++],
                        done: index > values.length,
                    }),
                };
            },
            [Symbol.asyncIterator]() {
                let index = 0;
                return {
                    next: () => promises[index++],
                };
            },
            ...(eventName && {
                eventName
            }),
        }),
    };
}

/**
 * @template
 * @param {T} payload
 * @param {Window} window
 * @returns {Readonly<T>}
 */
export function prepareMeasurement(window, payload) {
    return Object.freeze(
        round(applyConsent(window, { ...payload,
            clientType: config.clientType
        })),
    );
}