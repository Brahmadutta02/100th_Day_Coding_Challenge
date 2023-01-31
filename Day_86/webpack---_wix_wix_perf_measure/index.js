// @ts-check
import hidden from './entries/hidden.js';
import client from './entries/client.js';
import navStart from './entries/navStart.js';
import navFinish from './entries/navFinish.js';
import wixStart from './entries/wixStart.js';
import wixFinish from './entries/wixFinish.js';
import scripts from './entries/scripts.js';
import images from './entries/images.js';
import fonts from './entries/fonts.js';
import fcp from './entries/fcp.js';
import tti_tbt from './entries/tti-tbt.js';
import lcp from './entries/lcp.js';
import cls from './entries/cls.js';
import fid from './entries/fid.js';
import pages from './entries/pages.js';
import crux, {
    addGetters,
    getCurrentLcp
} from './entries/crux.js';
import crux_cls from './entries/crux-cls.js';
import {
    startMeasureResponsiveness
} from './entries/responsiveness';

import config from './utils/config.js';
import {
    batch,
    extract
} from './utils/utils.js';
import {
    fireEvent
} from './utils/windowEvents.js';
import {
    prepareMeasurement
} from './utils/sequence.js';

import loadInfo from './actions/loadInfo.js';
import {
    markAndMeasure
} from './actions/markAndMeasure.js';
import log from './actions/log.js';
import alert from './info/alert.js';

const TAG_ID = 'wix-perf-measure';

measure();

function measure() {
    if (
        typeof Promise !== 'function' ||
        !( /** @type {any} */ (Promise).allSettled)
    ) {
        return;
    }

    const {
        document,
        performance
    } = window;
    const script = document.currentScript || document.getElementById(TAG_ID);
    if (script) {
        config.load(window, script);
    }
    const {
        noMeasure,
        log: isLogging,
        label
    } = config;

    /** @type {import('./utils/utils.js').State} */
    const state = [
        window,
        performance,
        window.PerformanceObserver,
        window.setTimeout,
        window.clearTimeout,
    ];
    const measurements = obtainMeasurements(state, isLogging);
    loadInfo(state, document, config.src, measurements, getCurrentLcp, cls);
    Object.freeze(measurements);

    const together = measurements.slice(0, 3);
    const individually = measurements.slice(3, 5);
    if (!noMeasure) {
        markAndMeasure(performance, together);
    }
    if (isLogging) {
        log(together, individually);
    }

    window[label] = measurements;
    fireEvent(window, label, measurements);

    alert(window, measurements);
}

/**
 * @param {import('./utils/utils.js').State} state
 * @param {boolean} isLogging
 */
function obtainMeasurements(state, isLogging) {
    const environment = batch(
        'environment',
        client(state),
        navStart(state),
        wixStart(state),
    );

    const visibility = hidden(state);

    const initialPaint = fcp(state);
    const interaction = fid(state);
    const interactive = tti_tbt(state, extract(initialPaint, 'fcp'), interaction);
    const lastPaint = lcp(state, interactive, visibility, interaction);

    const ss = scripts(state);
    const is = images(state);
    const fs = fonts(state);

    const loaded = batch(
        'loaded',
        interactive,
        lastPaint,
        ss,
        is,
        fs,
        navFinish(state),
        wixFinish(state, interactive),
    ).then((result) => Object.assign(result, cls(state)));

    const cruxResult = crux(state, visibility);
    const measurements = [
        environment,
        initialPaint,
        loaded,
        interaction,
        visibility,
        pages(state),
        cruxResult,
        crux_cls(state, cruxResult),
        startMeasureResponsiveness(isLogging),
    ].map((measurement) =>
        measurement.then((payload) => prepareMeasurement(state[0], payload)),
    );

    return addGetters(measurements);
}