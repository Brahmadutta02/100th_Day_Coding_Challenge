import {
    resolveWithPatterns
} from './private/renderer/resolve-with-patterns';
import {
    filterPageLevelTags
} from './private/tags/filters/filter-page-level-tags';
import {
    convertSeoModel
} from './private/converters/convert-seo-model';
import {
    convertSiteLevelMetaTags
} from './private/converters/convert-site-level-meta-tags';
import {
    adapter as staticPageAdapterV2
} from './private/item-types/static-page-v2';
import {
    STATIC_PAGE_V2
} from './private/item-types/static-page-v2/pattern-static-page-v2';
import {
    enrichWithSiteLevelData
} from './private/adapters/utils';
import {
    getUserPatternByItemType
} from './private/patterns/get-user-pattern-by-item-type';
import {
    getContext
} from './private/tags/context/get-context';
import {
    getDefaultItemPayload
} from './private/patterns/get-default-item';
import {
    filterPayloadWithoutVelo
} from './private/tags/filters/filter-payload-without-velo';
export {
    getTitle,
    getLinks,
    getMetaTags,
    getSchemas,
}
from './private/renderer/getters';
export {
    setExternalRouter
}
from './private/renderer/setters';
export {
    convertDynamicPageModel,
    convertWixImageForMetaTags,
}
from './private/converters';
export {
    buildOgImagePreviewUrl
}
from './private/utils/build-og-image-preview';
export {
    extractDynamicRouteData
}
from './private/renderer/extract-dynamic-route-data';
export {
    getInitialTags,
    getDefaultItemPayload
};

function getInitialTags(_a) {
    var _b = _a.siteLevelSeoData,
        siteLevelSeoData = _b === void 0 ? {} : _b,
        pageLevelSeoData = _a.pageLevelSeoData,
        _c = _a.veloOverrides,
        veloOverrides = _c === void 0 ? [] : _c,
        _d = _a.dynamicPageData,
        dynamicPageData = _d === void 0 ? [] : _d,
        _e = _a.options,
        options = _e === void 0 ? {
            logError: function() {}
        } : _e;
    var siteLevelMetaTags = filterPageLevelTags(convertSiteLevelMetaTags(siteLevelSeoData.metaTags));
    var defaultStaticPatternSchema = STATIC_PAGE_V2;
    var userPatternSchema = getUserPatternByItemType(siteLevelSeoData.userPatterns, undefined, options);
    var adapter = enrichWithSiteLevelData(staticPageAdapterV2);
    var context = getContext(siteLevelSeoData, pageLevelSeoData, userPatternSchema);
    var contextWithItemData = {
        context: context
    };
    var editorPanelLegacyData = adapter.getLegacySeoBlob({
        context: context
    });
    var editorPanelData = convertSeoModel(pageLevelSeoData.advancedSeoData);
    var payload = [
        filterPayloadWithoutVelo([
            siteLevelMetaTags,
            defaultStaticPatternSchema,
            userPatternSchema,
            editorPanelLegacyData,
            editorPanelData,
            dynamicPageData,
        ], veloOverrides),
        veloOverrides,
    ];
    var adaptedContext = adapter.getData(contextWithItemData);
    return resolveWithPatterns(payload, adaptedContext, options);
}