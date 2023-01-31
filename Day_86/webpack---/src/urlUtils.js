import _ from 'lodash'

function parseUrlParams(queryString) {
    const re = /([^&=]+)=([^&]*)/g
    let param
    const query = {}

    while ((param = re.exec(queryString)) !== null) {
        const key = decodeURIComponent(param[1])
        const val = decodeURIComponent(param[2])
        if (!query[key]) {
            // first value for key, keep as string
            query[key] = val
        } else if (_.isArray(query[key])) {
            // more than one value already, push to the array
            query[key].push(val)
        } else {
            // the 2nd value for the key, turn into an array
            query[key] = [query[key], val]
        }
    }

    return query
}

export function parseUrl(url) {
    if (!url) {
        return {}
    }
    const urlRe = /((https?)\:\/\/)?([^\?\:\/#]+)(\:([0-9]+))?(\/[^\?\#]*)?(\?([^#]*))?(#.*)?/i
    const match = url.match(urlRe)
    const port = match[5] || ''
    const search = match[8] ? `?${match[8]}` : ''
    const ret = {
        full: url,
        protocol: match[2] || 'http:',
        host: port ? `${match[3]}:${port}` : match[3],
        hostname: match[3],
        port,
        path: match[6] || '/',
        search,
        hash: match[9] || ''
    }

    // fix empty hash
    if (ret.hash === '#' || ret.hash === '#!') {
        ret.hash = ''
    }

    ret.query = parseUrlParams(match[8])
    return ret
}