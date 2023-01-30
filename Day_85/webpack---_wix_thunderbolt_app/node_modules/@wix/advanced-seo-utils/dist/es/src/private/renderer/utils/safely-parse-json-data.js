import {
    clone
} from './clone';
export function safelyParseJsonData(data) {
    var result = {
        tags: [],
    };
    try {
        result = clone(JSON.parse(data));
    } catch (error) {}
    return result;
}