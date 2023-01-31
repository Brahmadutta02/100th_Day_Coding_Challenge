import {
    safelyParseJsonData
} from '../renderer/utils/safely-parse-json-data';
export function convertSeoModel(data) {
    return safelyParseJsonData(data);
}