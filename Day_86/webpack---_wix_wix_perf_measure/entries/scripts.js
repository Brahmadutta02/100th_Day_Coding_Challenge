// @ts-check
import {
    isScript
} from '../utils/observeResources.js';
import collectResources from '../utils/collectResources.js';

/**
 * Get scripts resources attributes
 * @param {import('../utils/utils.js').State} state
 */
export default function scripts(state) {
    return collectResources(state, 'scripts', {
        filter: isScript
    });
}