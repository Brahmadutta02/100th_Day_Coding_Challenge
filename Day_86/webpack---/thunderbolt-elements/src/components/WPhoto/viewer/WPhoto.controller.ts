import { withCompController } from '@wix/editor-elements-integrations';
import type {
  IWPhotoProps,
  IWPhotoControllerProps,
  IWPhotoStateValues,
} from '../WPhoto.types';

export default withCompController<
  Record<string, any>,
  IWPhotoControllerProps,
  IWPhotoProps,
  IWPhotoStateValues
>(({ controllerUtils, stateValues, mapperProps }) => {
  const { experiments } = stateValues;

  return {
    ...mapperProps,
    lazyLoadImgExperimentOpen:
      !!experiments?.['specs.thunderbolt.lazyLoadImages'],
    onSizeChange: (width, height) => {
      controllerUtils.updateProps({ width, height });
    },
  };
});
