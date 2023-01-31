import sequence from '../utils/sequence';
import {
    doLog
} from '../actions/log';
import {
    onINP
} from 'web-vitals/attribution';
import {
    getClosestElementWithId
} from '../utils/utils';

const RESPONSIVENESS = 'responsiveness';
const DOM_TREE_LIMIT = 20;

let isInfoCalled = false;
const {
    report,
    result
} = sequence(window, RESPONSIVENESS, RESPONSIVENESS);
window.addEventListener('info-called', () => (isInfoCalled = true));

/**
 * @param {boolean} isLoggingEnabled
 */
export const startMeasureResponsiveness = (isLoggingEnabled) => {
    onINP(measureINP(isLoggingEnabled));

    return result;
};

/**
 * @param {boolean} isLogging
 * @returns {(metric: import('web-vitals').MetricWithAttribution) => void}
 */
export const measureINP = (isLogging) => {
    let inpEvents = 0;
    /**
     * @param {import('web-vitals').INPMetricWithAttribution} metric
     * @returns {void}
     */
    return (metric) => {
        const {
            reportData,
            logData
        } =
        extractingResponsivenessEventDetails(metric);

        const currentResponsivenessMeasure = {
            entryType: RESPONSIVENESS,
            worstLatency: metric.value,
            numOfResponsivenessEvents: ++inpEvents,
            ...reportData,
        };

        report(currentResponsivenessMeasure);

        const queryParams = new URLSearchParams(window.location.search);
        const isDebugQueryParamOn = queryParams.get('debug') === 'true';

        if (isLogging || isInfoCalled || isDebugQueryParamOn) {
            doLog({
                currentLatency: metric.value,
                ...currentResponsivenessMeasure,
                ...logData,
            });
        }
    };
};

/**
 * PerformanceObserver callback for responsiveness (type "event")
 * @param {import('web-vitals').INPMetricWithAttribution} metric
 */
const extractingResponsivenessEventDetails = (metric) => {
    const attribution = metric.attribution;
    const actions = attribution.eventEntry.name;
    const target = attribution.eventEntry.target;
    const latencyByEntry = attribution.eventEntry.duration;
    const loadState = attribution.loadState;
    const interactionWaterfall = attribution.eventTarget;
    const startTime = attribution.eventTime;
    const elementDetails = getElementDetails(target);

    return {
        reportData: {
            interactionWaterfall,
            actions,
            latencyByEntry,
            startTime,
            loadState,
            ...elementDetails,
        },
        logData: {
            target,
        },
    };
};

/**
 * PerformanceObserver callback for responsiveness (type "event")
 * @param {HTMLElement} target
 * @returns {{elementType:string, compId: string}}
 */
const getElementDetails = (target) => {
    const closestNode = getClosestElementWithId(target);
    const compId = closestNode ? .id ? ? '';
    const elementType = target ? .localName;

    return {
        elementType,
        compId,
    };
};