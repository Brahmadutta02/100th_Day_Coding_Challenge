import {
    withValidation
} from '../validations';
import {
    registerCorvidEvent
} from '../corvidEvents';
const _playablePropsSDKFactory = api => {
    return {
        get isPlaying() {
            return api.props.isPlaying;
        },
        play() {
            api.compRef.play();
            return api.getSdkInstance();
        },
        pause() {
            api.compRef.pause();
            return api.getSdkInstance();
        },
        onPlay: handler => registerCorvidEvent('onPlay', api, handler),
        onPause: handler => registerCorvidEvent('onPause', api, handler),
        next() {
            return new Promise((resolve, reject) => {
                reject(new Error('sdk method not implemented'));
            });
        },
        previous() {
            return new Promise((resolve, reject) => {
                reject(new Error('sdk method not implemented'));
            });
        },
    };
};
export const playablePropsSDKFactory = withValidation(_playablePropsSDKFactory, {
    type: ['object'],
    properties: {},
});
//# sourceMappingURL=playablePropsSDKFactory.js.map