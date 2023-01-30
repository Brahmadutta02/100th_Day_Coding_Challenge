import {
    ClientOps
} from './core/clientOps';
import {
    thinToFatRequest,
    toInternalCollaborators
} from './core/thinToFatConvertors';
export var siteAssetsClientBuilder = function(collaborators, config, siteModels) {
    var ops = ClientOps(toInternalCollaborators(collaborators), config, siteModels);
    var execute = function(request) {
        return ops(request).execute();
    };
    var getPublicUrl = function(request) {
        return ops(thinToFatRequest(request)).getPublicUrl();
    };
    return {
        execute: execute,
        getPublicUrl: getPublicUrl
    };
};