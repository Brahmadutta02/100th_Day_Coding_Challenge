import {
    FetchError
} from '@wix/wixstores-client-core';
export function getTranslations(path) {
    return fetch(path, {
            method: 'get',
        })
        .then(function(response) {
            return response.json();
        })
        .catch(function(e) {
            throw new FetchError('Could not fetch translation', {
                originalError: e.message,
                path: path
            });
        });
}
export function isWorker() {
    /* istanbul ignore next: todo: test */
    return typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
}
export function stripGraphql(query) {
    return (query
        //eslint-disable-next-line prefer-named-capture-group
        .replace(/(\r\n|\n|\r)/g, '')
        //eslint-disable-next-line prefer-named-capture-group
        .replace(/ +(?= )/g, '')
        .replace(/: /g, ':')
        .replace(/, \$/g, ',$')
        .replace(/\{ /g, '{')
        .replace(/ {/g, '{')
        .replace(/ }/g, '}')
        .replace(/} /g, '}')
        .replace(/, /g, ',')
        .replace(/ /g, ','));
}
//# sourceMappingURL=utils.js.map