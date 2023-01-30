import {
    cartResponse
} from './schema/cartResponse';
export var query = "mutation removeCoupon($params: RemoveCouponInput!) {\n  cart {\n    removeCoupon(params: $params) {\n      " + cartResponse + "\n    }\n  }\n}\n";
//# sourceMappingURL=removeCoupon.graphql.js.map