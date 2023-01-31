import {
    NilAssignmentError,
    UnsupportedLinkTypeError
} from '../../errors';
import {
    messageTemplates
} from '../../messages';
export class InvalidLabelError extends NilAssignmentError {
    constructor(index) {
        super({
            functionName: 'menuItems',
            propertyName: 'label',
            index,
        });
        this.name = 'InvalidLabelError';
    }
}
export class InvalidTargetError extends Error {
    constructor({
        index,
        label,
        target,
    }) {
        super(messageTemplates.error_menu_items_target({
            index,
            label,
            target,
        }));
        this.name = 'InvalidTargetError';
    }
}
export class InvalidMenuDepthError extends Error {
    constructor(maxLevels, labelValue) {
        super(messageTemplates.error_menu_items_depth({
            labelValue,
            maxLevels,
        }));
        this.name = 'InvalidMenuDepth';
    }
}
export class LinkTypeError extends UnsupportedLinkTypeError {
    constructor(wrongValue, index) {
        super({
            functionName: 'menuItems',
            propertyName: 'link',
            wrongValue,
            index,
        });
    }
}
//# sourceMappingURL=errors.js.map