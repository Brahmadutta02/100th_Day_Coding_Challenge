// @ts-check
import {
    PIXEL_RATIO_FACTOR,
    MAX_DOWNLOAD_SPEED
} from '../utils/constants.js';
import {
    isBoolean,
    isNumber
} from '../utils/utils.js';
import config from '../utils/config.js';

/**
 * Get client attributes
 * @param {import('../utils/utils.js').State} state
 * @returns {Promise}
 */
export default function client([window]) {
    const {
        screen
    } = window;
    const result = {
        screenRes: `${screen.width}x${screen.height}`,
        availScreenRes: `${screen.availWidth}x${screen.availHeight}`,
        windowInner: `${window.innerWidth}x${window.innerHeight}`,
        windowOuter: `${window.outerWidth}x${window.outerHeight}`,
        devicePixelRatio: window.devicePixelRatio * PIXEL_RATIO_FACTOR,
        colorDepth: screen.colorDepth,
    };
    if (config.version) {
        result.version = config.version;
    }
    const {
        orientation
    } = screen;
    if (orientation ? .type) {
        result.orientation = orientation.type;
    }
    /** @type {Object} */
    const {
        navigator
    } = window;
    const {
        connection,
        deviceMemory,
        hardwareConcurrency
    } = navigator;
    if (hardwareConcurrency) {
        result.cores = hardwareConcurrency;
    }
    if (deviceMemory) {
        result.memory = Math.floor(deviceMemory);
    }
    if (connection) {
        const {
            type,
            effectiveType,
            rtt,
            downlink,
            saveData
        } = connection;
        if (type) {
            result.networkType = type;
        }
        if (effectiveType) {
            result.effectiveType = effectiveType;
        }
        if (isNumber(rtt) && rtt) {
            result.rtt = rtt;
        }
        if (downlink) {
            result.download = Math.min(downlink, MAX_DOWNLOAD_SPEED);
        }
        if (isBoolean(saveData)) {
            result.saveData = saveData;
        }
    }
    if (window.matchMedia) {
        const mql = window.matchMedia('(prefers-reduced-motion:reduce)');
        result.reducedMotion = mql.matches;
    }

    return !navigator.getBattery ?
        Promise.resolve(result) :
        navigator
        .getBattery()
        .then(({
            charging,
            level
        }) => {
            result.lowBattery = charging === false && level < 0.1;
            return result;
        })
        .catch(() => result);
}