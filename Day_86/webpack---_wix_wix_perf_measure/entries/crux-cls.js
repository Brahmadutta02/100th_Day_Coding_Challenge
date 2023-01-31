import config from '../utils/config.js';
import {
    addEventListener
} from '../utils/windowEvents.js';
import sequence from '../utils/sequence.js';
import cls from './cls.js';
import hidden, {
    isHidden
} from './hidden.js';

const subEntryType = 'crux-cls';
const entryType = `${subEntryType}-s`;

/**
 * Get page transition duration
 * @param {import('../utils/utils.js').State} state
 * @param {Promise} crux
 */
export default function crux_cls(state, crux) {
    return crux.then(({
        cls: prevCls
    }) => {
        let count = 0;
        const window = state[0];
        const {
            report,
            result
        } = sequence(window, entryType, config.clsEvent);
        addEventListener(window, 'visibilitychange', _report, false);
        return result;

        function _report() {
            if (!isHidden(window)) {
                hidden(state).then(({
                    startTime
                }) => {
                    const result = cls(state);
                    if (result && result.cls !== prevCls) {
                        prevCls = result.cls;
                        report({
                            ...result,
                            entryType: subEntryType,
                            startTime,
                            count: ++count,
                        });
                    }
                });
            }
        }
    });
}