import {
    createUnsupportedAPIReporter
} from '../../galleries/GallerySDKUtils';
export const unsupportedCurrentItemPropsSDKFactory = ({
    metaData
}) => {
    const galleryType = metaData.compType;
    const reportUnsupportedAPI = createUnsupportedAPIReporter(galleryType);
    return {
        get currentIndex() {
            return reportUnsupportedAPI('currentIndex');
        },
        get currentItem() {
            return reportUnsupportedAPI('currentItem');
        },
        onCurrentItemChanged() {
            return reportUnsupportedAPI('onCurrentItemChanged');
        },
    };
};
//# sourceMappingURL=unsupportedCurrentItemPropsSDKFactory.js.map