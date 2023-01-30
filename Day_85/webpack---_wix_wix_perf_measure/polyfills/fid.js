// @ts-check
import interaction from '../utils/interaction.js';

/**
 * Resolve FID polyfill attribues
 * @param {import('../utils/utils.js').State} state
 * @param {string} entryType
 */
export default function fidPolyfill(state, entryType) {
    return new Promise((resolve) => {
        const finish = interaction(state, (action, startTime, delay) => {
            finish();
            resolve({
                entryType,
                action,
                startTime,
                delay,
            });
        });
    });
}