export var query = "query getProduct($productId: String!) {\n  catalog {\n    product(productId: $productId) {\n      urlPart\n    }\n  }\n}";
//# sourceMappingURL=getProduct.graphql.js.map