import {
    assert
} from './assert';
export const SVG_FALLBACK_CONTENT = '<svg data-failed />';
export const SVG_TYPE_INLINE = 'inline';
export const SVG_TYPE_WIX_MEDIA = 'wixMedia';
export const SVG_TYPE_URL = 'url';
const WIX_MEDIA_PREFIX_REGEX = /^wix:vector:\/\/v1\//;
const WIX_MEDIA_REGEX = /^wix:vector:\/\/v1\/[0-9|a-z|_]+.svg/;
const resolveSvgShape = (value, baseSvgMediaUrl) => {
    /**
     * Shapes have next format `wix:vector://v1/svgshape.v2.Svg_283bac5c7f3f4b348e0f68e27825aaa0/`
     * and they handled separately:
     * https://github.com/wix-private/santa-core/blob/master/santa-core-utils/src/coreUtils/core/svgUtils.js#L61
     */
    const extractShapeUri = (svgId) => {
        const [, shapeVersion, hash, svgName] = svgId
            .replace(/^.*\//, '')
            .split('.');
        const version = shapeVersion === 'v1' ? 1 : 2;
        const svgHash = hash.replace(/svg_/i, '');
        return `${svgHash + (version === 1 ? `_svgshape.v1.${svgName}` : '')}.svg`;
    };
    const [svgShape] = value.replace(WIX_MEDIA_PREFIX_REGEX, '').split('/');
    const svgUri = extractShapeUri(svgShape);
    return {
        type: SVG_TYPE_WIX_MEDIA,
        data: `${baseSvgMediaUrl}/${svgUri}`,
    };
};
const extractWixMediaUrl = (value) => {
    const [wixMediaUrl] = WIX_MEDIA_REGEX.exec(value) || [];
    return wixMediaUrl;
};
export const createSvgWixMediaUrl = (id, title) => {
    const titleSuffix = title ? encodeURIComponent(title) : '';
    return `wix:vector://v1/${id}/${titleSuffix}`;
};
const queryAttribute = (markup, attr) => {
    const re = new RegExp(`${attr}=("|')?([-\\w\\s,]+)\\1`);
    return markup.match(re);
};
const getAttribute = (markup, attr) => {
    const attribute = queryAttribute(markup, attr);
    return attribute ? attribute[2] : null;
};
const addDefaultSizes = (markup) => {
    return markup.replace('<svg', `<svg width="300" height="150"`);
};
const hasDefaultSizes = (svg) => {
    const width = getAttribute(svg, 'width');
    const height = getAttribute(svg, 'height');
    const viewBox = getAttribute(svg, 'viewBox');
    return viewBox || (width && height);
};
export const resolveSvg = (src, baseSvgMediaUrl) => {
    if (assert.isWixSVGShape(src)) {
        return resolveSvgShape(src, baseSvgMediaUrl);
    }
    const wixMediaUrl = extractWixMediaUrl(src);
    if (wixMediaUrl) {
        const svgId = wixMediaUrl.replace(WIX_MEDIA_PREFIX_REGEX, '');
        return {
            type: SVG_TYPE_WIX_MEDIA,
            data: `${baseSvgMediaUrl}${svgId}`,
        };
    }
    if (assert.isInlineSvg(src)) {
        return {
            type: SVG_TYPE_INLINE,
            data: src
        };
    }
    return {
        type: SVG_TYPE_URL,
        data: src
    };
};
export const fetchSvg = async (url) => {
    try {
        const response = await fetch(url);
        if (response.ok) {
            return response.text();
        }
    } catch (_a) {
        /* do nothing */
    }
    return SVG_FALLBACK_CONTENT;
};
const getSanitizedSvg = async (maybeValidSvg, sanitizeSVG) => {
    const content = hasDefaultSizes(maybeValidSvg) ?
        maybeValidSvg :
        addDefaultSizes(maybeValidSvg);
    try {
        const {
            svg
        } = await sanitizeSVG(content);
        return svg || SVG_FALLBACK_CONTENT;
    } catch (e) {
        return SVG_FALLBACK_CONTENT;
    }
};
export const resolveAndFetchSvg = async (src, baseSvgMediaUrl, sanitizeSVG) => {
    const {
        type,
        data
    } = resolveSvg(src, baseSvgMediaUrl);
    if (type === SVG_TYPE_INLINE) {
        return getSanitizedSvg(data, sanitizeSVG);
    }
    let content = await fetchSvg(data);
    if (!isFallbackSvg(content) && type !== SVG_TYPE_WIX_MEDIA) {
        content = await getSanitizedSvg(content, sanitizeSVG);
    }
    return content;
};
export const isFallbackSvg = (svg) => svg === SVG_FALLBACK_CONTENT;
//# sourceMappingURL=svg.js.map