export function composeSDKFactories(...sources) {
    return api => {
        const target = {};
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let sourceIdx = 0; sourceIdx < sources.length; sourceIdx++) {
            const source = sources[sourceIdx](api);
            const sourceKeys = Object.keys(source);
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let sourceKeyIdx = 0; sourceKeyIdx < sourceKeys.length; sourceKeyIdx++) {
                const sourceKey = sourceKeys[sourceKeyIdx];
                const sourceProp = Object.getOwnPropertyDescriptor(source, sourceKey);
                Object.defineProperty(target, sourceKey, sourceProp);
            }
        }
        return target;
    };
}
//# sourceMappingURL=composeSDKFactories.js.map