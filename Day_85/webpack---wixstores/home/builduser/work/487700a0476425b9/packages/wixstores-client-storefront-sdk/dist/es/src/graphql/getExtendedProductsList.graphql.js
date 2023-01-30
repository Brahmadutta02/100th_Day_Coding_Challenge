import {
    extendedProduct
} from './schema/extendedProduct';
export var query = "query getExtendedProductsList($limit: Int, $sortField: ProductSortField!, $direction: SortDirection!, $onlyVisible: Boolean) {\n  catalog {\n    products(limit: $limit, sort: {sortField: $sortField, direction: $direction}, onlyVisible: $onlyVisible) {\n      list {\n        " + extendedProduct + "\n      }\n    }\n  }\n}\n";
//# sourceMappingURL=getExtendedProductsList.graphql.js.map