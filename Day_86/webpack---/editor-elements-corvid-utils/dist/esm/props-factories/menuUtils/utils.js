import {
    assert
} from '../../assert';
const externalRegex = /^(http|https):\/\/(.*)/;
const pageUrlRegex = /^\/([^ ?#]*)[?]?(.*)/;
export const isPageUrl = (url) => pageUrlRegex.test(url);
export const isExternalPage = (url) => externalRegex.test(url);
export const getLink = ({
    link,
    target,
    linkUtils,
}) => {
    if (!assert.isNil(link)) {
        const passedTarget = (target ||
            (isExternalPage(link) ? '_blank' : '_self'));
        return linkUtils.getLinkProps(link, passedTarget);
    }
    return {};
};
const getPageTitleFromUrl = (url, pageList) => {
    var _a;
    const key = url.slice(1);
    if (pageList.hasOwnProperty(key)) {
        return (_a = pageList[key]) === null || _a === void 0 ? void 0 : _a.title;
    }
    return undefined;
};
export const getLabel = ({
    link,
    label,
    pageList,
}) => {
    if (!assert.isNil(label)) {
        return label;
    }
    if (!assert.isNil(link) && isPageUrl(link)) {
        return getPageTitleFromUrl(link, pageList);
    }
    return undefined;
};
//# sourceMappingURL=utils.js.map