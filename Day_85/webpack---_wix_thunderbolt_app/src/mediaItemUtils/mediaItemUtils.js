/*
 * Media Item Utils
 * April 2018
 * tombigel@wix.com
 */

import _ from 'lodash'

const templates = {
    vector: (svgId, filename) => `wix:vector://v1/${svgId}/${filename}`,
    image: (uri, filename, width, height, watermark) => `wix:image://v1/${uri}/${filename}#originWidth=${width}&originHeight=${height}${watermark ? `&watermark=${watermark}` : ''}`,
    document: (uri, filename) => `wix:document://v1/${uri}/${filename}`,
    video: (videoId, posterId, filename, width, height) => `wix:video://v1/${videoId}/${filename}#posterUri=${posterId}&posterWidth=${width}&posterHeight=${height}`,
    audio: (uri, filename, duration) => `wix:audio://v1/${uri}/${filename}#duration=${duration}`
}

const matchers = {
    vector: /^wix:vector:\/\/v1\/([^\/]+)\/([^\/]*)$/,
    image: /^wix:image:\/\/v1\/([^\/]+)\/([^\/]+)#originWidth=([0-9]+)&originHeight=([0-9]+)(?:&watermark=([^\/]+))?$/,
    document: /^wix:document:\/\/v1\/([^\/]+(?:\/[^\/]+)?)\/([^\/]+)$/,
    video: /^wix:video:\/\/v1\/([^\/]+)\/([^\/]+)#posterUri=([^\/]+)&posterWidth=([0-9]+)&posterHeight=([0-9]+)$/,
    audio: /^wix:audio:\/\/v1\/([^\/]+)\/([^\/]+)#duration=([0-9]+)$/,
    deprecated_video: /^wix:video:\/\/v1\/([^\/]+)\/([^\/]+)\/#posterUri=([^\/]+)&posterWidth=([0-9]+)&posterHeight=([0-9]+)$/,
    deprecated_image: /^image:\/\/v1\/([^\/]+)\/([0-9]+)_([0-9]+)\/([^\/]*)$/,
    deprecated_type: /^(image):/,
    type: /^wix:(\w+):/,
    splitExtension: /\.(?=[^.]+$)/,
    emptyTitle: /^_\./
}

const matchersByType = {
    vector: [matchers.vector],
    image: [matchers.image, matchers.deprecated_image],
    document: [matchers.document],
    video: [matchers.video, matchers.deprecated_video],
    audio: [matchers.audio]
}

/**
 * @typedef {string} MediaType
 */
/**
 * @public
 * @type {{IMAGE: MediaType, DOCUMENT: MediaType, VIDEO: MediaType, AUDIO: MediaType, VECTOR: MediaType}}
 */
const types = {
    IMAGE: 'image',
    DOCUMENT: 'document',
    VIDEO: 'video',
    AUDIO: 'audio',
    VECTOR: 'vector'
}

/**
 * @public
 * @type {{empty_media_id: string, empty_poster_id: string, bad_media_id: string, unknown_media_type: string, missing_width_height: string}}
 */
const errors = {
    empty_media_id: 'empty_media_id',
    empty_poster_id: 'empty_poster_id',
    bad_media_id: 'bad_media_id',
    unknown_media_type: 'unknown_media_type',
    missing_width_height: 'missing_width_height',
    non_string_media_id: 'non_string_media_id'
}

/**
 * Return a file name, use the extension from uri if the title has none
 * @param {string} type
 * @param {string} [title]
 * @param {string} uri
 * @returns {string}
 */
function convertTitleToFilename(type, title = '', uri) {
    const [uriName, uriExtension] = uri.split(matchers.splitExtension)
    const [titleName, titleExtension] = title.split(matchers.splitExtension)

    let filename = ''

    switch (type) {
        case types.IMAGE:
            filename = `${titleName || '_'}.${titleExtension || uriExtension}`
            break
        case types.DOCUMENT:
            filename = `${titleName || uriName}.${titleExtension || uriExtension}`
            break
        case types.VIDEO:
            filename = `${titleName || '_'}${titleExtension ? `.${titleExtension}` : ''}`
            break
        case types.AUDIO:
            filename = `${titleName || uriName}.${titleExtension || uriExtension}`
            break
        case types.VECTOR:
            filename = `${titleName || uriName}.${titleExtension || uriExtension}`
            break
    }
    return encodeURI(filename)
}

/**
 * return filename or an empty string
 * @param {string} filename
 * @returns {string}
 */
function convertFilenameToTitle(filename) {
    if (matchers.emptyTitle.test(filename)) {
        return ''
    }

    try {
        return decodeURI(filename)
    } catch (e) {
        return filename
    }
}

/**
 * Create a MediaItem for an image, width and height are mandatory numbers
 * @param {string} uri
 * @param {string} [title]
 * @param {number} width
 * @param {number} height
 * @param {string} [watermark]
 * @returns {{item: string}|{error: string}}
 */
function createImageItem(uri, title, width, height, watermark) {
    if (!uri) {
        return {
            error: errors.empty_media_id
        }
    }

    if (isNaN(height) || isNaN(width)) {
        return {
            error: errors.missing_width_height
        }
    }

    const filename = convertTitleToFilename(types.IMAGE, title, uri)
    return {
        item: templates.image(uri, filename, width, height, watermark)
    }
}

/**
 * Create a MediaItem for a document
 * @param {string} uri
 * @param {string} [title]
 * @returns {{item: string}|{error: string}}
 */
function createDocumentItem(uri, title) {
    if (!uri) {
        return {
            error: errors.empty_media_id
        }
    }
    const filename = convertTitleToFilename(types.DOCUMENT, title, uri)
    return {
        item: templates.document(uri, filename)
    }
}

/**
 * Create a MediaItem for a vector image
 * @param {string} svgId
 * @param {string} [title]
 * @returns {{item: string}|{error: string}}
 */
function createVectorItem(svgId, title) {
    if (!svgId) {
        return {
            error: errors.empty_media_id
        }
    }
    const filename = convertTitleToFilename(types.VECTOR, title, svgId)
    return {
        item: templates.vector(svgId, filename)
    }
}

/**
 * Create a MediaItem for a video, posterId is a mandatory image uri, width and height are mandatory numbers
 * @param {string} videoId
 * @param {string} [title]
 * @param {number} width
 * @param {number} height
 * @param {string} posterId
 * @returns {{item: string}|{error: string}}
 */
function createVideoItem(videoId, title, width, height, posterId) {
    if (!videoId) {
        return {
            error: errors.empty_media_id
        }
    }
    if (!posterId) {
        return {
            error: errors.empty_poster_id
        }
    }
    if (isNaN(height) || isNaN(width)) {
        return {
            error: errors.missing_width_height
        }
    }
    videoId = videoId.replace('video/', '')

    const filename = convertTitleToFilename(types.VIDEO, title, videoId)
    return {
        item: templates.video(videoId, posterId, filename, width, height)
    }
}

/**
 * Create a MediaItem for a audio
 * @param {string} uri
 * @param {string} [title]
 * @param {number} [duration]
 * @returns {{item: string}|{error: string}}
 */
function createAudioItem(uri, title, duration) {
    if (!uri) {
        return {
            error: errors.empty_media_id
        }
    }
    const filename = convertTitleToFilename(types.AUDIO, title, uri)
    return {
        item: templates.audio(uri, filename, duration)
    }
}

/**
 * Parse an image MediaItem
 * @param {string} item
 * @returns {{type: MediaType, mediaId: string, title: string, width: number, height: number, watermark?: string}|{error: string}}
 */
function parseImageItem(item) {
    const [, mediaId, filename, width, height, watermark] = item.match(matchers.image) || []
    const title = convertFilenameToTitle(filename)

    if (mediaId) {
        const parsed = {
            type: types.IMAGE,
            mediaId,
            title,
            width: parseInt(width, 10),
            height: parseInt(height, 10)
        }
        if (watermark) {
            parsed.watermark = watermark
        }
        return parsed
    }
    return {
        error: errors.bad_media_id
    }
}

function parseDeprecatedImageItem(item) {
    const [, mediaId, width, height, filename] = item.match(matchers.deprecated_image) || []
    const title = convertFilenameToTitle(filename)

    if (mediaId) {
        return {
            type: types.IMAGE,
            mediaId,
            title,
            width: parseInt(width, 10),
            height: parseInt(height, 10)
        }
    }
    return {
        error: errors.bad_media_id
    }
}

/**
 * Parse a document MediaItem
 * @param {string} item
 * @returns {{type: MediaType, mediaId: string, title: string}|{error: string}}
 */
function parseDocumentItem(item) {
    const [, mediaId, filename] = item.match(matchers.document) || []
    const title = convertFilenameToTitle(filename)

    if (mediaId) {
        return {
            type: types.DOCUMENT,
            mediaId,
            title
        }
    }
    return {
        error: errors.bad_media_id
    }
}

/**
 * Parse a vector MediaItem
 * @param {string} item
 * @returns {{type: MediaType, mediaId: string, title: string}|{error: string}}
 */
function parseVectorItem(item) {
    const [, mediaId, filename] = item.match(matchers.vector) || []
    const title = convertFilenameToTitle(filename)

    if (mediaId) {
        return {
            type: types.VECTOR,
            mediaId,
            title
        }
    }
    return {
        error: errors.bad_media_id
    }
}

/**
 * Parse a video MediaItem
 * @param {string} item
 * @returns {{type: MediaType, mediaId: string, posterId: string, width: number, height: number, title: string}|{error: string}}
 */
function parseVideoItem(item) {
    const videoMatcher = matchers.deprecated_video.test(item) ? matchers.deprecated_video : matchers.video
    const [, mediaId, filename, posterId, width, height] = item.match(videoMatcher) || []
    const title = convertFilenameToTitle(filename)

    if (mediaId && posterId) {
        return {
            type: types.VIDEO,
            mediaId,
            posterId,
            width: parseInt(width, 10),
            height: parseInt(height, 10),
            title
        }
    }
    return {
        error: errors.bad_media_id
    }
}

/**
 * Parse a audio MediaItem
 * @param {string} item
 * @returns {{type: MediaType, mediaId: string, title: string, duration: number}|{error: string}}
 */
function parseAudioItem(item) {
    const [, mediaId, filename, duration] = item.match(matchers.audio) || []
    const title = convertFilenameToTitle(filename)

    if (mediaId) {
        return {
            type: types.AUDIO,
            mediaId,
            title,
            duration: parseInt(duration, 10)
        }
    }
    return {
        error: errors.bad_media_id
    }
}

/**
 * @public
 * Create a MediaItem in the form of 'wix:<media_type>:<uri>/...' of one of the supported type
 * @param {string} mediaId required for all types
 * @param {MediaType} type required, one of the supported types
 * @param {string} [title] optional for all types
 * @param {number} [width] required for video and image
 * @param {number} [height] required for video and image
 * @param {string} [posterId] required for video
 * @param {string} [watermark] optional for image
 * @param {number} [duration] optional for audio
 * @returns {{item: string}|{error: string}}
 */
function createMediaItemUri({
    mediaId,
    type,
    title,
    width,
    height,
    posterId,
    watermark,
    duration
}) {
    switch (type) {
        case types.IMAGE:
            return createImageItem(mediaId, title, width, height, watermark)
        case types.DOCUMENT:
            return createDocumentItem(mediaId, title)
        case types.VECTOR:
            return createVectorItem(mediaId, title)
        case types.VIDEO:
            return createVideoItem(mediaId, title, width, height, posterId)
        case types.AUDIO:
            return createAudioItem(mediaId, title, duration)
        default:
            return {
                error: errors.unknown_media_type
            }
    }
}

/**
 * @public
 * Parse a media item url of one of the supported types
 * @param {string} mediaItemUri
 * @returns {{}|{error: string}}
 */
function parseMediaItemUri(mediaItemUri = '') {
    if (!_.isString(mediaItemUri)) {
        return {
            error: errors.non_string_media_id
        }
    }

    const [, type] = mediaItemUri.match(matchers.type) || []
    switch (type) {
        case types.IMAGE:
            return parseImageItem(mediaItemUri)
        case types.DOCUMENT:
            return parseDocumentItem(mediaItemUri)
        case types.VECTOR:
            return parseVectorItem(mediaItemUri)
        case types.VIDEO:
            return parseVideoItem(mediaItemUri)
        case types.AUDIO:
            return parseAudioItem(mediaItemUri)
        default:
            const [, deprecatedType] = mediaItemUri.match(matchers.deprecated_type) || []
            if (deprecatedType) {
                return parseDeprecatedImageItem(mediaItemUri)
            }
            return {
                error: errors.unknown_media_type
            }
    }
}

/**
 * @public
 * Checks if a given url is a valid media item url
 * @param {string} mediaItemUri
 * @param {string} type
 * @returns {boolean}
 */
function isValidMediaItemUri(mediaItemUri = '', type) {
    const matchers = matchersByType[type]
    return _.some(matchers, matcher => matcher.test(mediaItemUri))
}

export {
    isValidMediaItemUri,
    createMediaItemUri,
    parseMediaItemUri,
    errors,
    types
}