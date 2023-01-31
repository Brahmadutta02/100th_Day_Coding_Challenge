// @ts-check
/**
 * Get wixBiSession for Wix sessions
 * @param {Object} window
 */
export default function getWixBiSession(window) {
    return window.wixBiSession || window.bi ? .wixBiSession;
}