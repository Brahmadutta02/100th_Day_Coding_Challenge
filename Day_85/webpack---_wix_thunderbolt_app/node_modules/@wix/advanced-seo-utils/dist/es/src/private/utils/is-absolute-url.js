export function isAbsoluteUrl(url) {
    return /^https?/.test(url) || /^\/\//.test(url);
}