import {
    cartResponse
} from './schema/cartResponse';
export var query = "mutation updateBuyerNote($params: UpdateBuyerNoteInput!) {\n  cart {\n    updateBuyerNote(params: $params) {\n      " + cartResponse + "\n    }\n  }\n}\n";
//# sourceMappingURL=updateBuyerNote.graphql.js.map