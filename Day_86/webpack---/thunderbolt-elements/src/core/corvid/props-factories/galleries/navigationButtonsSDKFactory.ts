import { withValidation } from '@wix/editor-elements-corvid-utils';
import type { CorvidTypes } from '@wix/editor-elements-types/corvid';

export interface INavigationButtonsPropsSDKProps {
  showNavigation: boolean;
}

export interface INavigationButtonsPropsSDK {
  showNavigationButtons: boolean;
}

const _navigationButtonsSDKFactory: CorvidTypes.CorvidSDKFactory<
  INavigationButtonsPropsSDKProps,
  INavigationButtonsPropsSDK
> = ({ props, setProps }) => {
  return {
    get showNavigationButtons() {
      return props.showNavigation;
    },

    set showNavigationButtons(val) {
      setProps({
        showNavigation: val,
      });
    },
  };
};

export const navigationButtonsSDKFactory = withValidation(
  _navigationButtonsSDKFactory,
  {
    type: ['object'],
    properties: {
      showNavigationButtons: { type: ['boolean'] },
    },
  },
);
