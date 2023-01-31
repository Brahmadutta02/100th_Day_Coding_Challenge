import {
    messages
} from '../messages';
export class NilAssignmentError extends Error {
    constructor(params) {
        const message = messages.nilAssignmentMessage(params);
        super(message);
        this.name = 'NilAssignmentError';
        this.message = message;
    }
}
export class UnsupportedLinkTypeError extends Error {
    constructor(params) {
        const message = messages.unsupportedLinkType(params);
        super(message);
        this.name = 'UnsupportedLinkTypeError';
        this.message = message;
    }
}
//# sourceMappingURL=index.js.map