// @ts-check
import {
    isImage
} from '../utils/observeResources.js';
import collectResources from '../utils/collectResources.js';

/**
 * Get image resources attributes
 * @param {import('../utils/utils.js').State} state
 */
export default function images(state) {
    return collectResources(state, 'images', {
        filter: isImage
    });
}