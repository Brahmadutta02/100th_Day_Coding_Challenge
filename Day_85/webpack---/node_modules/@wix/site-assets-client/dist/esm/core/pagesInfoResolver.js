import {
    concatUnique,
    keys
} from '../helper/objectHelper';
export var PagesInfoResolver = function(sitePagesModel) {
    var urlFormatModel = sitePagesModel.urlFormatModel,
        pageJsonFileNames = sitePagesModel.pageJsonFileNames,
        protectedPageIds = sitePagesModel.protectedPageIds,
        routersInfo = sitePagesModel.routersInfo;
    var uniquePageIds = concatUnique(keys(pageJsonFileNames).filter(function(pageId) {
        return pageId !== 'masterPage';
    }), protectedPageIds);
    return {
        getPagesInfo: function() {
            return Promise.resolve({
                pageIdsArray: uniquePageIds,
                pageJsonFileNames: pageJsonFileNames,
                routersInfo: routersInfo,
                urlFormatModel: urlFormatModel,
                protectedPageIds: protectedPageIds
            });
        }
    };
};