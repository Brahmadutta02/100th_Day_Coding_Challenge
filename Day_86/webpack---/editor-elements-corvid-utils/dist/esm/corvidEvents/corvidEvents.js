import {
    createCompSchemaValidator
} from '../validations';
import {
    EVENT_TYPES_MAP
} from './eventTypes';
const reactToCorvidEventType = {
    dblclick: 'dblClick',
    keydown: 'keyPress',
    input: 'onInput',
};
export const convertToCorvidEventBase = (event) => {
    var _a;
    const {
        target,
        type,
        context
    } = event;
    return {
        target,
        type: (_a = reactToCorvidEventType[type]) !== null && _a !== void 0 ? _a : type,
        context
    };
};
export const convertToCorvidMouseEvent = (event) => {
    const {
        clientX,
        clientY,
        pageX,
        pageY,
        screenX,
        screenY,
        nativeEvent
    } = event;
    const {
        offsetX,
        offsetY
    } = nativeEvent;
    return {
        clientX,
        clientY,
        pageX,
        pageY,
        screenX,
        screenY,
        offsetX,
        offsetY,
    };
};
export const convertToCorvidKeyboardEvent = (event) => {
    const {
        altKey,
        ctrlKey,
        key,
        metaKey,
        shiftKey
    } = event;
    return {
        key,
        altKey,
        ctrlKey,
        metaKey,
        shiftKey,
    };
};
const functionValidator = (value, eventName, role) => {
    return createCompSchemaValidator(role)(value, {
        type: ['function'],
    }, eventName);
};
const eventNameMapToMethodName = {
    onMouseEnter: 'onMouseIn',
    onMouseLeave: 'onMouseOut',
};
const removeOnPrefix = (st) => st.replace(/^on/i, '');
const mapMethodNameToEventName = (methodName) => {
    var _a;
    const mapEntry = Object.entries(eventNameMapToMethodName).find(([_, value]) => removeOnPrefix(value.toLowerCase()) ===
        removeOnPrefix(methodName.toLowerCase()));
    return (_a = mapEntry === null || mapEntry === void 0 ? void 0 : mapEntry[0]) !== null && _a !== void 0 ? _a : methodName;
};
const createEventListenerState = (api) => {
    return api.createSdkState({
        listeners: []
    }, 'eventListeners');
};
export const registerCorvidEvent = (eventName, api, cb, projection) => {
    var _a;
    const {
        create$w,
        createEvent,
        registerEvent,
        getSdkInstance,
        metaData
    } = api;
    const setterName = (_a = eventNameMapToMethodName[eventName]) !== null && _a !== void 0 ? _a : eventName;
    if (!functionValidator(cb, setterName, metaData.role)) {
        return getSdkInstance();
    }
    const [eventListenerState, setEventListenerState] = createEventListenerState(api);
    const unregisterEvent = registerEvent(eventName,
        /**
         * `eventPayload` adds extra data into native React events
         * which will be sanitized by the platform
         */
        (event, eventPayload) => {
            const baseEvent = createEvent({
                type: event.type,
                compId: event.compId
            });
            const $w = create$w({
                context: baseEvent.context
            });
            const projectionEvent = projection === null || projection === void 0 ? void 0 : projection({
                componentEvent: event,
                eventPayload,
            });
            cb(Object.assign(Object.assign({}, convertToCorvidEventBase(baseEvent)), projectionEvent), $w);
        });
    const listener = {
        eventName,
        compId: metaData.compId,
        cb,
        unregister: unregisterEvent,
    };
    setEventListenerState({
        listeners: [...eventListenerState.listeners, listener],
    });
    return getSdkInstance();
};
const isEventNameMatches = (eventName, userRequestedEventNameOrActionType) => {
    var _a;
    const targetEventName = mapMethodNameToEventName((_a = EVENT_TYPES_MAP[userRequestedEventNameOrActionType]) !== null && _a !== void 0 ? _a : userRequestedEventNameOrActionType);
    return eventName.toLowerCase() === targetEventName.toLowerCase();
};
export const unregisterCorvidEvent = (eventNameOrActionType, api, cb) => {
    const {
        metaData,
        getSdkInstance
    } = api;
    const [eventListenerState, setEventListenerState] = createEventListenerState(api);
    const eventListeners = eventListenerState.listeners.filter(listener => isEventNameMatches(listener.eventName, eventNameOrActionType) &&
        listener.cb === cb &&
        listener.compId === metaData.compId);
    for (const listener of eventListeners) {
        listener.unregister();
    }
    setEventListenerState({
        listeners: eventListenerState.listeners.filter(listener => !eventListeners.includes(listener)),
    });
    return getSdkInstance();
};
/**
 * Function that registers corvid keyboard event handler by forwarding callback prop to component.
 * 1. Validating user callback.
 * 2. Returning sdk instance.
 * 3. Passing $w selector as second argument of consumers callback.
 * 4. Includes platform metadata for consumers event object: target, context.
 * 5. Extracts required keyboard event fields from the React synthetic event.
 * @param eventName - the name of the callback that will be passed to component.
 * @param api - corvid sdk api object.
 * @param cb - consumers callback function.
 * @param payloadProjection - transformation for provided custom payload.
 */
export const registerCorvidKeyboardEvent = (eventName, api, cb, payloadProjection) => registerCorvidEvent(eventName, api, cb, ({
    componentEvent,
    eventPayload
}) => (Object.assign(Object.assign({}, convertToCorvidKeyboardEvent(componentEvent)), (eventPayload && (payloadProjection === null || payloadProjection === void 0 ? void 0 : payloadProjection(eventPayload))))));
/**
 * Function that registers corvid mouse event handler by forwarding callback prop to component.
 * 1. Validating user callback.
 * 2. Returning sdk instance.
 * 3. Passing $w selector as second argument of consumers callback.
 * 4. Includes platform metadata for consumers event object: target, context.
 * 5. Extracts required mouse event fields from the React synthetic event.
 * @param eventName - the name of the callback that will be passed to component.
 * @param api - corvid sdk api object.
 * @param cb - consumers callback function.
 * @param payloadProjection - transformation for provided custom payload.
 */
export const registerCorvidMouseEvent = (eventName, api, cb, payloadProjection) => registerCorvidEvent(eventName, api, cb, ({
    componentEvent,
    eventPayload
}) => (Object.assign(Object.assign({}, convertToCorvidMouseEvent(componentEvent)), (eventPayload && (payloadProjection === null || payloadProjection === void 0 ? void 0 : payloadProjection(eventPayload))))));
/**
 * Function that registers corvid event only once per sdk initialization.
 * This is function is used to sync the corvid state with the component state
 * synchronously.
 * @param {EventParameters} Object {
 *   @property {string} eventName - the name of the callback that will be passed to component.
 *   @property {CorvidSDKApi} api - corvid sdk api object.
 *   @property {Function} cb - callback function.
 *   @property {string} namespace - (optional) - state identifier used to make id unique by prop-factory.
 * }
 */
export const registerEventOnce = ({
    eventName,
    api,
    cb,
    namespace,
}) => {
    const {
        registerEvent,
        createSdkState
    } = api;
    const [state, setState] = createSdkState({
        wasInvoked: false
    }, namespace);
    if (!state.wasInvoked) {
        registerEvent(eventName, cb);
        setState({
            wasInvoked: true
        });
    }
};
//# sourceMappingURL=corvidEvents.js.map