import {
    cartResponse
} from './schema/cartResponse';
export var query = "mutation addToCart($params: [AddToCartInput!]) {\n  cart {\n    addToCart(params: $params) {\n      " + cartResponse + "\n    }\n  }\n}\n";
//# sourceMappingURL=addToCart.graphql.js.map