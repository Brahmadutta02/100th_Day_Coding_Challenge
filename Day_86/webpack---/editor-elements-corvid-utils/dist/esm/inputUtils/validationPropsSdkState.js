import {
    INITIAL_VALIDATION_DATA
} from './validityUtils';
const defaultState = {
    validationData: INITIAL_VALIDATION_DATA,
    customValidators: [() => {}],
};
const NAMESPACE = 'validation';
export const getValidationData = ({
    createSdkState,
}) => {
    const [state] = createSdkState(defaultState, NAMESPACE);
    return state.validationData;
};
export const setValidationData = ({
    createSdkState
}, validationData) => {
    const [, setState] = createSdkState(defaultState, NAMESPACE);
    setState({
        validationData
    });
};
export const getCustomValidator = ({
    createSdkState,
}) => {
    const [{
        customValidators
    }] = createSdkState(defaultState, NAMESPACE);
    return (value, reject) => {
        let abortValidation = false;
        const innerReject = (rejectMessage) => {
            abortValidation = true;
            reject(rejectMessage);
        };
        for (let idx = 0; idx < customValidators.length && !abortValidation; idx++) {
            customValidators[idx](value, innerReject);
        }
    };
};
export const setCustomValidator = ({
    createSdkState
}, customValidator, override = true) => {
    const [{
        customValidators
    }, setState] = createSdkState(defaultState, NAMESPACE);
    if (override) {
        setState({
            customValidators: [customValidator]
        });
    } else {
        setState({
            customValidators: [...customValidators, customValidator],
        });
    }
};
//# sourceMappingURL=validationPropsSdkState.js.map