export function isEmpty(object) {
    switch (typeof object) {
        case 'string':
            return object.length === 0;
        case 'object':
            return object === null ?
                true :
                Array.isArray(object) ?
                object.length === 0 :
                Object.keys(object).length === 0;
        default:
            return true;
    }
}