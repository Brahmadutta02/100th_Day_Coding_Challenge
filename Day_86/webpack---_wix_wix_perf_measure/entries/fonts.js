// @ts-check
import {
    isFont
} from '../utils/observeResources.js';
import collectResources from '../utils/collectResources.js';

/**
 * Get font resources attributes
 * @param {import('../utils/utils.js').State} state
 */
export default function fonts(state) {
    return collectResources(state, 'fonts', {
        filter: isFont
    });
}