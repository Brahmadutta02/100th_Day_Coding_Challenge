import {
    withValidation,
} from '@wix/editor-elements-corvid-utils';
import {
    createUnsupportedAPIReporter
} from '../../galleries/GallerySDKUtils';
const _unsupportedPlayablePropsSDKFactory = ({
    metaData
}) => {
    const galleryType = metaData.compType;
    const reportUnsupportedApi = createUnsupportedAPIReporter(galleryType);
    return {
        get isPlaying() {
            reportUnsupportedApi('isPlaying');
            return false;
        },
        play() {
            return reportUnsupportedApi('play');
        },
        pause() {
            return reportUnsupportedApi('pause');
        },
        onPlay() {
            return reportUnsupportedApi('onPlay');
        },
        onPause() {
            return reportUnsupportedApi('onPause');
        },
        next() {
            reportUnsupportedApi('next');
            return Promise.reject(new Error(`next is not supported for an element of type: ${galleryType}.`));
        },
        previous() {
            reportUnsupportedApi('previous');
            return Promise.reject(new Error(`previous is not supported for an element of type: ${galleryType}.`));
        },
    };
};
export const unsupportedPlayablePropsSDKFactory = withValidation(_unsupportedPlayablePropsSDKFactory, {
    type: ['object'],
    properties: {},
});
//# sourceMappingURL=unsupportedPlayablePropsSDKFactory.js.map