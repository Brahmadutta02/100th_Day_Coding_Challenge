import {
    reportError
} from '../reporters';
import {
    withValidation
} from '../validations';
import {
    createMediaSrc,
    getScrollEffect,
    getFullMediaData,
    getMediaDataFromSrc,
    hasVideo,
    CORVID_BG_VIDEO_DEFAULTS as BG_VIDEO_DEFAULTS,
} from '../media';
import * as mediaItemUtils from '../media/mediaItemUtils';
/**
 * sort qualities ASC , remove 'storyboard' quality
 * @param qualities
 */
const normalizeQualities = (qualities) => {
    return qualities
        .filter((item) => item.quality !== 'storyboard')
        .sort((item1, item2) => parseInt(item1.quality, 10) - parseInt(item2.quality, 10));
};
const _backgroundPropsSDKFactory = ({
    setProps,
    props,
    metaData,
    compRef
}) => {
    const isVideo = hasVideo(props);
    return {
        get background() {
            return {
                get src() {
                    var _a, _b;
                    const {
                        fillLayers = {}
                    } = props;
                    if ((_b = (_a = fillLayers === null || fillLayers === void 0 ? void 0 : fillLayers.video) === null || _a === void 0 ? void 0 : _a.videoInfo) === null || _b === void 0 ? void 0 : _b.videoId) {
                        const {
                            videoInfo
                        } = fillLayers.video;
                        const mediaItemUri = createMediaSrc({
                            mediaId: videoInfo.videoId,
                            type: mediaItemUtils.types.VIDEO,
                            title: fillLayers.video.posterImageInfo.title,
                            width: videoInfo.videoWidth,
                            height: videoInfo.videoHeight,
                            posterId: fillLayers.video.posterImageInfo.uri,
                        });
                        if (mediaItemUri.error) {
                            return '';
                        }
                        return mediaItemUri.item || '';
                    }
                    const image = fillLayers.image || fillLayers.backgroundImage;
                    if (image) {
                        const mediaItemUri = createMediaSrc({
                            mediaId: image.uri,
                            type: mediaItemUtils.types.IMAGE,
                            width: image.width,
                            height: image.height,
                            title: image.title,
                        });
                        if (mediaItemUri.error) {
                            return '';
                        }
                        return mediaItemUri.item || '';
                    }
                    return '';
                },
                set src(newSrc) {
                    var _a, _b;
                    const {
                        fillLayers = {}
                    } = props;
                    if (!newSrc) {
                        // clear the background fillLayers
                        setProps({
                            fillLayers: {
                                containerId: metaData.compId,
                            },
                        });
                        return;
                    }
                    const mediaData = getMediaDataFromSrc(newSrc);
                    if (!mediaData) {
                        reportError(`The "src" property cannot be set to "${newSrc}". It must be a valid URL starting with "http://", "https://", or "wix:image://, or a valid video URL starting with "wix:video://".`);
                        return;
                    }
                    const {
                        hasBgScrollEffect,
                        bgEffectName
                    } = getScrollEffect(fillLayers);
                    if (mediaData.type === 'WixVideo') {
                        getFullMediaData(mediaData, fullMediaRefData => {
                            if (!fullMediaRefData) {
                                return;
                            }
                            const propsFull = {
                                fillLayers: {
                                    containerId: metaData.compId,
                                    backgroundMedia: hasBgScrollEffect ?
                                        Object.assign({
                                            containerId: metaData.compId
                                        }, fillLayers.backgroundMedia) : undefined,
                                    hasBgFullscreenScrollEffect: fillLayers.hasBgFullscreenScrollEffect,
                                    video: Object.assign(Object.assign({}, BG_VIDEO_DEFAULTS), {
                                        alt: '',
                                        posterImageInfo: Object.assign({
                                            containerId: metaData.compId,
                                            hasBgScrollEffect,
                                            bgEffectName
                                        }, mediaData.posterImageRef),
                                        videoInfo: {
                                            containerId: metaData.compId,
                                            videoId: fullMediaRefData.mediaObject.videoId,
                                            videoWidth: fullMediaRefData.mediaObject.videoWidth,
                                            videoHeight: fullMediaRefData.mediaObject.videoHeight,
                                            qualities: normalizeQualities(fullMediaRefData.mediaObject.qualities),
                                            isVideoDataExists: '1',
                                            videoFormat: fullMediaRefData.mediaObject.videoFormat,
                                            playbackRate: fullMediaRefData.mediaObject.playbackRate,
                                            autoPlay: fullMediaRefData.mediaObject.autoPlay,
                                            hasBgScrollEffect,
                                            bgEffectName,
                                        }
                                    }),
                                },
                            };
                            setProps(propsFull);
                        });
                        // change to poster (video partial props)
                        setProps({
                            fillLayers: {
                                containerId: metaData.compId,
                                hasBgFullscreenScrollEffect: fillLayers.hasBgFullscreenScrollEffect,
                                backgroundMedia: hasBgScrollEffect ?
                                    Object.assign({
                                        containerId: metaData.compId
                                    }, fillLayers.backgroundMedia) : undefined,
                                video: Object.assign(Object.assign({}, BG_VIDEO_DEFAULTS), {
                                    alt: '',
                                    posterImageInfo: Object.assign({
                                        containerId: metaData.compId,
                                        hasBgScrollEffect,
                                        bgEffectName
                                    }, mediaData.posterImageRef),
                                    videoInfo: {
                                        containerId: metaData.compId,
                                        videoId: mediaData.videoId,
                                        isVideoDataExists: false,
                                    }
                                }),
                            },
                        });
                    } else {
                        // change to Image
                        setProps({
                            fillLayers: {
                                containerId: metaData.compId,
                                hasBgFullscreenScrollEffect: fillLayers.hasBgFullscreenScrollEffect,
                                backgroundMedia: hasBgScrollEffect ?
                                    Object.assign({
                                        containerId: metaData.compId
                                    }, fillLayers.backgroundMedia) : undefined,
                                image: !fillLayers.backgroundImage ?
                                    Object.assign(Object.assign({}, mediaData), {
                                        uri: mediaData.mediaId || '',
                                        displayMode: (_a = fillLayers === null || fillLayers === void 0 ? void 0 : fillLayers.image) === null || _a === void 0 ? void 0 : _a.displayMode,
                                        containerId: metaData.compId,
                                        name: '',
                                        width: mediaData.width || 0,
                                        height: mediaData.height || 0,
                                        alt: '',
                                        hasBgScrollEffect,
                                        bgEffectName
                                    }) : null,
                                backgroundImage: fillLayers.backgroundImage ?
                                    Object.assign(Object.assign({}, mediaData), {
                                        uri: mediaData.mediaId || '',
                                        name: mediaData.name || '',
                                        width: mediaData.width || 0,
                                        height: mediaData.height || 0,
                                        alt: mediaData.name || '',
                                        displayMode: (_b = fillLayers === null || fillLayers === void 0 ? void 0 : fillLayers.backgroundImage) === null || _b === void 0 ? void 0 : _b.displayMode
                                    }) : null,
                            },
                        });
                    }
                },
                get alt() {
                    var _a, _b, _c, _d;
                    return (((_b = (_a = props.fillLayers) === null || _a === void 0 ? void 0 : _a.image) === null || _b === void 0 ? void 0 : _b.alt) || ((_d = (_c = props.fillLayers) === null || _c === void 0 ? void 0 : _c.video) === null || _d === void 0 ? void 0 : _d.alt) || '');
                },
                set alt(newAlt) {
                    if (!props.fillLayers) {
                        return;
                    }
                    const {
                        image,
                        video
                    } = props.fillLayers;
                    const videoAttributes = video ?
                        {
                            video: Object.assign(Object.assign({}, video), {
                                alt: newAlt
                            })
                        } :
                        {};
                    const imageAttributes = image ?
                        {
                            image: Object.assign(Object.assign({}, image), {
                                alt: newAlt
                            })
                        } :
                        {};
                    setProps({
                        fillLayers: Object.assign(Object.assign(Object.assign({}, props.fillLayers), videoAttributes), imageAttributes),
                    });
                },
                play() {
                    if (isVideo) {
                        return compRef.play(true);
                    }
                },
                pause() {
                    if (isVideo) {
                        return compRef.pause();
                    }
                },
                stop() {
                    if (isVideo) {
                        return compRef.stop();
                    }
                },
            };
        },
    };
};
export const backgroundPropsSDKFactory = withValidation(_backgroundPropsSDKFactory, {
    type: ['object'],
    properties: {
        background: {
            type: ['object'],
            properties: {
                src: {
                    type: ['string', 'nil'],
                    warnIfNil: true,
                },
                alt: {
                    type: ['string', 'nil'],
                    warnIfNil: true,
                },
            },
        },
    },
});
//# sourceMappingURL=backgroundPropsSDKFactory.js.map