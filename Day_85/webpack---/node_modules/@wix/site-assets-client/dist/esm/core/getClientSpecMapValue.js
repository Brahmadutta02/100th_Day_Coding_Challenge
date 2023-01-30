import {
    SiteAssetsClientSpecMapSupplierError
} from '../domain/siteAssetsClientErrors';
export var getClientSpecMapPromise = function(metaSiteModel) {
    if (!metaSiteModel.clientSpecMapSupplier && !metaSiteModel.clientSpecMap) {
        throw new SiteAssetsClientSpecMapSupplierError();
    }
    return metaSiteModel.clientSpecMapSupplier ? metaSiteModel.clientSpecMapSupplier() : Promise.resolve(metaSiteModel.clientSpecMap);
};