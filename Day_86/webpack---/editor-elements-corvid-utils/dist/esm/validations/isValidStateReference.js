import {
    assert
} from '../assert';
import {
    messages
} from '../messages';
import {
    reportError
} from '../reporters';
export const isValidStateReference = (functionArgs, sdkFactoryArgs) => {
    const [stateReference] = functionArgs;
    const isObjectStateReference = assert.isObject(stateReference);
    const states = sdkFactoryArgs.getChildren();
    let inputState = -1;
    // if stateRefernce is object - validate object by properties and search by id
    if (assert.isObject(stateReference)) {
        const isValidStateSDKObject = Object.keys(states[0]).every(key => stateReference.hasOwnProperty(key));
        if (!isValidStateSDKObject) {
            reportError(messages.invalidTypeMessage({
                propertyName: 'stateReference',
                functionName: 'changeState',
                value: stateReference,
                types: ['state', 'string'],
                index: undefined,
            }));
            return false;
        }
        inputState = states.findIndex(state => state.uniqueId === stateReference.uniqueId);
    }
    // if stateReference is string - find by role
    if (assert.isString(stateReference)) {
        inputState = states.findIndex(state => state.role === stateReference);
    }
    if (inputState < 0) {
        reportError(messages.invalidStateInputMessage({
            value: isObjectStateReference ?
                stateReference.role :
                stateReference,
            propertyName: 'stateReference',
            functionName: 'changeState',
            stateBoxId: sdkFactoryArgs.metaData.role,
        }));
        return false;
    }
    return true;
};
//# sourceMappingURL=isValidStateReference.js.map