import {
    __awaiter,
    __extends,
    __generator
} from "tslib";
import {
    BaseApi
} from '../BaseApi';
import {
    query as getProductQuery
} from '../../graphql/getProduct.graphql';
import {
    query as getExtendedProductBySlugQuery
} from '../../graphql/getExtendedProductBySlug.graphql';
import {
    query as getExtendedProductByIdQuery
} from '../../graphql/getExtendedProductById.graphql';
import {
    query as getExtendedProductsListQuery
} from '../../graphql/getExtendedProductsList.graphql';
import {
    GraphQLOperations,
    RemoteSourceTypes
} from '../constants';
import {
    NotFoundError
} from '../errors/NotFoundError';
var ProductsApi = /** @class */ (function(_super) {
    __extends(ProductsApi, _super);

    function ProductsApi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProductsApi.prototype.fetchProductSlug = function(productId) {
        return this.fetch({
            variables: {
                productId: productId
            },
            operationName: GraphQLOperations.GetProduct,
            query: getProductQuery,
        }, RemoteSourceTypes.ScalaReadOnly).then(function(response) {
            return response.data.catalog.product;
        });
    };
    ProductsApi.prototype.fetchExtendedProductBySlug = function(slug) {
        return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , this.fetch({
                            variables: {
                                slug: slug
                            },
                            operationName: GraphQLOperations.GetExtendedProductBySlug,
                            query: getExtendedProductBySlugQuery,
                        }, RemoteSourceTypes.ScalaReadOnly)];
                    case 1:
                        response = _a.sent();
                        if (response.data.catalog.product === null) {
                            throw new NotFoundError("cannot find a product with slug: " + slug);
                        }
                        return [2 /*return*/ , response.data.catalog.product];
                }
            });
        });
    };
    ProductsApi.prototype.fetchExtendedProductById = function(id) {
        return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , this.fetch({
                            variables: {
                                id: id
                            },
                            operationName: GraphQLOperations.GetExtendedProductById,
                            query: getExtendedProductByIdQuery,
                        }, RemoteSourceTypes.ScalaReadOnly)];
                    case 1:
                        response = _a.sent();
                        if (response.data.catalog.product === null) {
                            throw new NotFoundError("cannot find a product with id: " + id);
                        }
                        return [2 /*return*/ , response.data.catalog.product];
                }
            });
        });
    };
    ProductsApi.prototype.fetchDefaultProduct = function() {
        return __awaiter(this, void 0, void 0, function() {
            var response;
            return __generator(this, function(_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/ , this.fetch({
                            variables: {
                                limit: 1,
                                sortField: 'CreationDate',
                                direction: 'Descending',
                                onlyVisible: true,
                            },
                            operationName: GraphQLOperations.GetExtendedProductsList,
                            query: getExtendedProductsListQuery,
                        }, RemoteSourceTypes.ScalaReadOnly)];
                    case 1:
                        response = _a.sent();
                        if (response.data.catalog.products.list === null) {
                            throw new NotFoundError('no products in store');
                        }
                        return [2 /*return*/ , response.data.catalog.products.list[0]];
                }
            });
        });
    };
    return ProductsApi;
}(BaseApi));
export {
    ProductsApi
};
//# sourceMappingURL=ProductsApi.js.map