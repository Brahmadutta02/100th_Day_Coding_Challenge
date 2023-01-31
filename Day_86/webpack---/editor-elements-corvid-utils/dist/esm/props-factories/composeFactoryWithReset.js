/**
 * This function is a factory for a function that gets a collection of Objects that have the following structure:
 * {
 *  get someProp {...}
 *  set someProp {...}
 *  reset() {...} // reset here is configurable by "resetMethodName"
 * }
 *
 * note: `someProp` is unique for each object, and can NOT repeat on multiple objects.
 *
 * It composes said objects to a single object, that has the compbined props from all objects,
 * except the reset prop.
 * The new object will have a new reset(propName: string) method, which can be called with a prop name,
 * that will call the apropriate originalObject.reset(propName).
 *
 * @param resetMethodName the name of the reset method, i.e. reset
 * @returns object that has all props combined + reset method
 */
export const composeFactory = (resetMethodName) => (...objs) => {
    const resetMap = {};
    const result = {
        [resetMethodName](propName) {
            if (typeof resetMap[propName] === 'function') {
                return resetMap[propName](propName);
            }
        },
    };
    objs.forEach(obj => {
        Object.keys(obj)
            .filter(key => key !== resetMethodName) // copy all keys except the "reset" key
            .map(key => ({
                key,
                descriptor: Object.getOwnPropertyDescriptor(obj, key),
            }))
            .forEach(({
                key,
                descriptor
            }) => {
                if (typeof obj[resetMethodName] === 'function') {
                    resetMap[key] = obj[resetMethodName]; // keep in map the reset method for a given property
                }
                Object.defineProperty(result, key, descriptor);
            });
    });
    return result;
};
//# sourceMappingURL=composeFactoryWithReset.js.map