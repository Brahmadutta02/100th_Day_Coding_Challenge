// @ts-check
import {
    isUndefined,
    isBoolean,
    isNumber
} from './utils.js';
import getWixBiSession from './wixBiSession.js';

const config = {
    __proto__: {
        load,
    },

    newClsMethod: true,

    resourceDebounce: 2000,
    taskDelta: 300,
    longTask: 60,
    eventDelta: 500,
    ttiDurationInc: 2000,

    ignoreResources: 'cdn_detect,-analytics,perf-measure',

    label: makeLabel('Performance'),
    clientType: '',
    fcpPolyfill: 'wixFirstPaint',
    fcpPolyfillId: 'wix-first-paint',
    pageEvent: makeLabel('Page'),
    clsEvent: makeLabel('Cls'),

    storagePrefix: 'wix-perf-measure',

    sessionDelta: false,

    noMeasure: false,
    log: false,
};

function makeLabel(id) {
    return `wix${id}Measurements`;
}

/**
 * Load configuration from script tag dataSet
 * @param {Window} window
 * @param {HTMLElement & {src?: string}} dataset
 */
function load(window, {
    dataset,
    src
}) {
    Object.entries(config)
        .map(([key, value]) => [dataset[key], key, value])
        .filter(([data]) => !isUndefined(data))
        .forEach(([data, key, value]) => {
            if (isBoolean(value)) {
                data = true;
            } else if (isNumber(value)) {
                const n = Number(data);
                data = Number.isNaN(n) ? value : n;
            }
            config[key] = data;
        });

    if (src) {
        config.src = src;
        const m = /\d+\.\d+\.\d+/.exec(src);
        if (m) {
            config.version = m[0];
        }
    }

    if (!config.clientType && getWixBiSession(window)) {
        config.clientType = 'ugc';
    }
}

export default config;