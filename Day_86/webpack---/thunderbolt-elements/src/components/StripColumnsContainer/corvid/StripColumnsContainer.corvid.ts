import {
  composeSDKFactories,
  backgroundPropsSDKFactory,
  childrenPropsSDKFactory,
  clickPropsSDKFactory,
  createElementPropsSDKFactory,
  toJSONBase,
  createAccessibilityPropSDKFactory,
  focusPropsSDKFactory,
  keyUpPropsSDKFactory,
  keyDownPropsSDKFactory,
} from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations/corvid';
import type { SdkInstance } from '@wix/editor-elements-types/corvid';
import type { IMediaContainerSDK } from '../../MediaContainers/MediaContainer/MediaContainer.types';
import { corvidName as type } from '../constants';
import type {
  IStripColumnsContainerOwnSDKFactory,
  IStripColumnsContainerSDK,
  IStripColumnsContainerSDKFactory,
  StripColumnsContainerProps,
} from '../StripColumnsContainer.types';

const stripColumnsContainerSDKFactory: IStripColumnsContainerOwnSDKFactory =
  sdkProps => {
    const { metaData, props } = sdkProps;

    const ownBackgroundSDK = backgroundPropsSDKFactory(sdkProps);

    const getColumns = (): Array<IMediaContainerSDK> =>
      metaData
        .getChildren()
        .filter((child: SdkInstance) => child.type === '$w.Column');
    const hasDividersDesign = () =>
      Boolean(
        props.dividers?.hasTopDivider || props.dividers?.hasBottomDivider,
      );
    return {
      get background() {
        const columns = getColumns();
        const hasDividers = hasDividersDesign();
        return {
          get src() {
            const ownSrc = ownBackgroundSDK.background.src;
            if (!ownSrc && columns.length === 1 && !hasDividers) {
              const [column] = columns;
              return column.background.src;
            }
            return ownSrc;
          },
          set src(newSrc: string) {
            if (columns.length === 1 && !hasDividers) {
              const [column] = columns;
              column.background.src = newSrc;
            } else {
              ownBackgroundSDK.background.src = newSrc;
            }
          },
        };
      },
      get columns() {
        return getColumns();
      },
      get type() {
        return type;
      },
      toJSON() {
        return {
          ...toJSONBase(metaData),
          type,
        };
      },
    };
  };

export const accessibilityPropsSDKFactory = createAccessibilityPropSDKFactory({
  enableRole: true,
  enableAriaHidden: true,
  enableAriaLabel: true,
  enableAriaLabelledBy: true,
  enableAriaDescribedBy: true,
  enableAriaLive: true,
  enableAriaAtomic: true,
  enableAriaRelevant: true,
  enableAriaBusy: true,
  enableTabIndex: true,
});

const elementPropsSDKFactory = createElementPropsSDKFactory();

export const sdk: IStripColumnsContainerSDKFactory = composeSDKFactories<
  StripColumnsContainerProps,
  IStripColumnsContainerSDK
>(
  elementPropsSDKFactory,
  stripColumnsContainerSDKFactory,
  childrenPropsSDKFactory,
  clickPropsSDKFactory,
  accessibilityPropsSDKFactory,
  focusPropsSDKFactory,
  keyUpPropsSDKFactory,
  keyDownPropsSDKFactory,
);

export default createComponentSDKModel(sdk);
