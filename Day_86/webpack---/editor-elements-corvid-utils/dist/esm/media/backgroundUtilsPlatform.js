import {
    parseVideoFileInfo
} from '@wix/editor-elements-common-utils';
import {
    isValidMediaSrc,
    parseMediaSrc
} from './mediaSrcHandler';
export const CORVID_BG_VIDEO_DEFAULTS = {
    loop: true,
    preload: 'auto',
    muted: true,
    isVideoEnabled: true,
};
const getVideoPosterObject = ({
    mediaId,
    posterId,
    width,
    height,
    title,
}) => {
    return {
        type: 'WixVideo',
        videoId: mediaId,
        posterImageRef: {
            type: 'Image',
            uri: posterId,
            width,
            height,
            title,
        },
    };
};
export const getScrollEffect = (fillLayers = {}) => {
    const {
        bgEffectName = ''
    } = fillLayers.backgroundMedia || {};
    return {
        hasBgScrollEffect: bgEffectName ? 'true' : '',
        bgEffectName,
    };
};
export const hasVideo = (props) => {
    var _a, _b;
    const {
        fillLayers = {}
    } = props;
    return (_b = (_a = fillLayers === null || fillLayers === void 0 ? void 0 : fillLayers.video) === null || _a === void 0 ? void 0 : _a.videoInfo) === null || _b === void 0 ? void 0 : _b.videoId;
};
const getVideoId = (videoId) => {
    return videoId.replace('video/', '');
};
const getFullVideoObject = (fileInfo, info) => {
    const MEDIA_OBJECT_DEFAULTS = {
        animatePoster: 'none',
        autoPlay: true,
        playbackRate: 1,
        fittingType: 'fill',
        hasBgScrollEffect: '',
        bgEffectName: '',
        isVideoDataExists: '1',
        alignType: 'center',
        videoFormat: 'mp4',
        playerType: 'html5',
        isEditorMode: false,
        isViewerMode: true,
        videoHeight: fileInfo.file_input.height,
        videoWidth: fileInfo.file_input.width,
    };
    const mediaObject = parseVideoFileInfo(fileInfo, info);
    return Object.assign({
        mediaObject: Object.assign(Object.assign({}, MEDIA_OBJECT_DEFAULTS), mediaObject)
    }, CORVID_BG_VIDEO_DEFAULTS);
};
const getFullVideoData = (videoId, callback) => {
    videoId = getVideoId(videoId);
    const VIDEO_INFO_END_POINT = `https://files.wix.com/site/media/files/${videoId}/info`;
    fetch(VIDEO_INFO_END_POINT)
        .then(response => response.json())
        .then(response => {
            const fullVideoMediaRef = getFullVideoObject(response, {});
            callback(fullVideoMediaRef);
        });
};
export const getMediaDataFromSrc = (value) => {
    if (isValidMediaSrc(value, 'video')) {
        const parseMediaItem = parseMediaSrc(value, 'video');
        if (parseMediaItem.error) {
            return null;
        }
        return Object.assign(Object.assign({}, getVideoPosterObject(parseMediaItem)), {
            name: parseMediaItem.title,
            fileName: parseMediaItem.title,
            type: 'WixVideo',
        });
    } else {
        const parseMediaItem = parseMediaSrc(value, 'image');
        if (parseMediaItem.error) {
            return null;
        }
        return Object.assign(Object.assign({}, parseMediaItem), {
            name: parseMediaItem.title,
            type: 'Image',
        });
    }
};
export const getFullMediaData = (mediaData, callback) => {
    if (mediaData.videoId) {
        getFullVideoData(mediaData.videoId, callback);
        return;
    }
    callback();
};
//# sourceMappingURL=backgroundUtilsPlatform.js.map