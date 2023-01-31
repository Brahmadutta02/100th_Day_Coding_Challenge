import {
    withValidation,
    assert
} from '@wix/editor-elements-corvid-utils';
var GALLERY_CLICK_ACTIONS;
(function(GALLERY_CLICK_ACTIONS) {
    GALLERY_CLICK_ACTIONS["none"] = "disabled";
    GALLERY_CLICK_ACTIONS["expand"] = "zoomMode";
    GALLERY_CLICK_ACTIONS["link"] = "goToLink";
})(GALLERY_CLICK_ACTIONS || (GALLERY_CLICK_ACTIONS = {}));
const _clickActionSDKFactory = ({
    setProps,
    props
}) => {
    return {
        get clickAction() {
            const {
                imageOnClickAction: action
            } = props;
            switch (action) {
                case 'disabled':
                    return 'none';
                case 'goToLink':
                    return 'link';
                default:
                case 'zoomMode':
                    return 'expand';
            }
        },
        set clickAction(action) {
            const galleryImageClickAction = assert.isNil(action) ?
                GALLERY_CLICK_ACTIONS.none :
                GALLERY_CLICK_ACTIONS[action];
            setProps({
                imageOnClickAction: galleryImageClickAction,
            });
        },
    };
};
export const clickActionSDKFactory = withValidation(_clickActionSDKFactory, {
    type: ['object'],
    properties: {
        clickAction: {
            warnIfNil: true,
            type: ['string'],
            enum: Object.keys(GALLERY_CLICK_ACTIONS),
        },
    },
});
//# sourceMappingURL=clickActionSDKFactory.js.map