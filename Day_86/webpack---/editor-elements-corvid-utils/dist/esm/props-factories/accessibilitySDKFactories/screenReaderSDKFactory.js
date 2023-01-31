import {
    withValidation
} from '../..';
import {
    assert
} from '../../assert';
import {
    reportError
} from '../../reporters';
import {
    getInvalidScreenReaderValueError
} from './constants';
export const screenReaderSDKFactory = ({
    setProps,
    props
}) => ({
    screenReader: {
        get prefix() {
            var _a;
            return (_a = props.screenReader) === null || _a === void 0 ? void 0 : _a.prefix;
        },
        set prefix(value) {
            if (value !== null && !assert.isString(value)) {
                reportError(getInvalidScreenReaderValueError('prefix'));
                return;
            }
            setProps({
                screenReader: Object.assign(Object.assign({}, props.screenReader), {
                    prefix: value
                })
            });
        },
        get suffix() {
            var _a;
            return (_a = props.screenReader) === null || _a === void 0 ? void 0 : _a.suffix;
        },
        set suffix(value) {
            if (value !== null && !assert.isString(value)) {
                reportError(getInvalidScreenReaderValueError('suffix'));
                return;
            }
            setProps({
                screenReader: Object.assign(Object.assign({}, props.screenReader), {
                    suffix: value
                })
            });
        },
    },
});
export const createScreenReaderSDK = withValidation(screenReaderSDKFactory, {
    type: ['object'],
    properties: {
        prefix: {
            type: ['string'],
            minLength: 1,
            maxLength: 1000,
        },
        suffix: {
            type: ['string'],
            minLength: 1,
            maxLength: 1000,
        },
    },
});
//# sourceMappingURL=screenReaderSDKFactory.js.map