export function extractImageNameFromWixMediaUrl(url) {
    if (!url) {
        return url;
    }
    var pattern = 'static.wixstatic.com/media/';
    var index = url.indexOf(pattern);
    if (index !== -1) {
        var name_1 = url.substr(index + pattern.length);
        if (name_1.includes('/')) {
            return '';
        }
        return name_1;
    }
    return '';
}