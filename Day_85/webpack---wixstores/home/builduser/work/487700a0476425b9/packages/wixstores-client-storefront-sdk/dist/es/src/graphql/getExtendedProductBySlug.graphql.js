import {
    extendedProduct
} from './schema/extendedProduct';
export var query = "query getExtendedProductBySlug($slug: String!) {\n    catalog {\n      product(slug: $slug, onlyVisible: true) {\n        " + extendedProduct + "\n      }\n    }\n  }";
//# sourceMappingURL=getExtendedProductBySlug.graphql.js.map