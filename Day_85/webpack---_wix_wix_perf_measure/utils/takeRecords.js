// @ts-check
import observe from './observe.js';

/**
 * Helper for taking records from PerformanceObserver
 * @param {any} PerformanceObserver
 * @param {string} type
 */
export default function takeRecords(PerformanceObserver, type) {
    const observer = observe(PerformanceObserver, type);
    if (observer) {
        const result = observer.takeRecords ? .();
        observer.disconnect();
        return result;
    }
}