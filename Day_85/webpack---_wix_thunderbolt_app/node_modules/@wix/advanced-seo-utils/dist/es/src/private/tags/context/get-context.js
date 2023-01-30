var __assign = (this && this.__assign) || function() {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import {
    CONTEXT_PROPS
} from '../../types/ContextProps';
import {
    getValueByIdentifier
} from '../values/get-by-identifier';
import {
    IDENTIFIERS
} from '../../types/Identifiers';
export function getContext(siteLevelSeoData, pageLevelSeoData, userPatternSchema) {
    var _a;
    var _b;
    var _c = siteLevelSeoData.context,
        context = _c === void 0 ? {} : _c,
        _d = siteLevelSeoData.mainPageId,
        mainPageId = _d === void 0 ? false : _d;
    var defaultUrl = (_b = context[CONTEXT_PROPS.DEFAULT_URL]) === null || _b === void 0 ? void 0 : _b.replace(/\/$/, '');
    var pageName = pageLevelSeoData.pageName,
        title = pageLevelSeoData.title,
        description = pageLevelSeoData.description,
        ogImage = pageLevelSeoData.ogImage,
        ogImageWidth = pageLevelSeoData.ogImageWidth,
        ogImageHeight = pageLevelSeoData.ogImageHeight,
        indexPage = pageLevelSeoData.indexPage,
        _e = pageLevelSeoData.currentPageUrl,
        currentPageUrl = _e === void 0 ? defaultUrl : _e,
        _f = pageLevelSeoData.pageId,
        pageId = _f === void 0 ? false : _f,
        tpaPageId = pageLevelSeoData.tpaPageId;
    var isHomePage = mainPageId && mainPageId === pageId;
    return __assign(__assign({}, context), (_a = {}, _a[CONTEXT_PROPS.DEFAULT_URL] = defaultUrl, _a[CONTEXT_PROPS.IS_HOME_PAGE] = isHomePage, _a[CONTEXT_PROPS.PAGE_NAME] = pageName, _a[CONTEXT_PROPS.TITLE] = title, _a[CONTEXT_PROPS.DESCRIPTION] = description, _a[CONTEXT_PROPS.OG_IMAGE] = ogImage, _a[CONTEXT_PROPS.OG_IMAGE_WIDTH] = ogImageWidth, _a[CONTEXT_PROPS.OG_IMAGE_HEIGHT] = ogImageHeight, _a[CONTEXT_PROPS.INDEX_PAGE] = indexPage, _a[CONTEXT_PROPS.CURRENT_PAGE_URL] = currentPageUrl, _a[CONTEXT_PROPS.ROBOTS_FROM_USER_PATTERN] = getValueByIdentifier(userPatternSchema.tags, IDENTIFIERS.ROBOTS), _a[CONTEXT_PROPS.TPA_PAGE_ID] = tpaPageId, _a));
}