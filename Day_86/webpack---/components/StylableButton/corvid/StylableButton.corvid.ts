import {
  assert,
  composeSDKFactories,
  createSvgWixMediaUrl,
  messages,
  reportError,
  resolveAndFetchSvg,
  withValidation,
  clickPropsSDKFactory,
  focusPropsSDKFactory,
  createStylePropsSDKFactory,
  disablePropsSDKFactory,
  createElementPropsSDKFactory,
  labelPropsSDKFactory,
  createAccessibilityPropSDKFactory,
  toJSONBase,
  linkPropsSDKFactory,
} from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations/corvid';
import type { IPlatformHandlers } from '@wix/editor-elements-types/corvid';

import {
  IStylableButtonOwnSDKFactory,
  IStylableButtonProps,
  IStylableButtonSDK,
} from '../StylableButton.types';

const stylePropsSDKFactory = createStylePropsSDKFactory({
  BackgroundColor: { withoutDefaultValue: true, supportOpacity: true },
  BorderColor: { withoutDefaultValue: true, supportOpacity: false },
  BorderRadius: { withoutDefaultValue: true },
  BorderWidth: { withoutDefaultValue: true },
  TextColor: { withoutDefaultValue: true },
});

const fetchIconSvgString = async (
  value: string,
  mediaSvgUrl: string,
  corvidProps: any,
  sanitizeSVG: IPlatformHandlers['sanitizeSVG'],
) => {
  const svg = await resolveAndFetchSvg(value, mediaSvgUrl, sanitizeSVG);
  return { corvid: { ...corvidProps, iconSvgString: svg } };
};

const _stylableButtonSDKFactory: IStylableButtonOwnSDKFactory = api => {
  const labelSDK = labelPropsSDKFactory(api);
  const styleSDK = stylePropsSDKFactory(api);
  const { props, setProps, sdkData, createSdkState, handlers } = api;
  const [state, setState] = createSdkState<{
    iconMediaUrl?: string | null;
  }>({});

  return {
    get label() {
      return labelSDK.label;
    },
    set label(value) {
      labelSDK.label = value;
    },
    get style() {
      return {
        get backgroundColor() {
          return styleSDK.style.backgroundColor;
        },
        set backgroundColor(backgroundColor: string | undefined) {
          styleSDK.style.backgroundColor = backgroundColor;
          api.setProps({
            corvid: { ...api.props.corvid, hasBackgroundColor: true },
          });
        },
        get borderColor() {
          return styleSDK.style.borderColor;
        },
        set borderColor(borderColor: string | undefined) {
          styleSDK.style.borderColor = borderColor;
          api.setProps({
            corvid: { ...api.props.corvid, hasBorderColor: true },
          });
        },
        get borderRadius() {
          return styleSDK.style.borderRadius;
        },
        set borderRadius(borderRadius: string | undefined) {
          styleSDK.style.borderRadius = borderRadius;
          api.setProps({
            corvid: { ...api.props.corvid, hasBorderRadius: true },
          });
        },
        get borderWidth() {
          return styleSDK.style.borderWidth;
        },
        set borderWidth(borderWidth: string | undefined) {
          styleSDK.style.borderWidth = borderWidth;
          api.setProps({
            corvid: { ...api.props.corvid, hasBorderWidth: true },
          });
        },
        get color() {
          return styleSDK.style.color;
        },
        set color(color: string | undefined) {
          styleSDK.style.color = color;
          api.setProps({
            corvid: { ...api.props.corvid, hasColor: true },
          });
        },
        removeProperty(
          propertyName:
            | 'backgroundColor'
            | 'borderColor'
            | 'foregroundColor'
            | 'borderRadius'
            | 'borderWidth'
            | 'color',
        ) {
          const mapPropertyNameToCorvidPropertyName: Record<string, string> = {
            backgroundColor: 'hasBackgroundColor',
            borderWidth: 'hasBorderWidth',
            borderRadius: 'hasBorderRadius',
            borderColor: 'hasBorderColor',
            textColor: 'hasColor',
          };

          if (!mapPropertyNameToCorvidPropertyName[propertyName]) {
            return;
          }

          const propsToCorvid = {
            ...api.props.corvid,
            [mapPropertyNameToCorvidPropertyName[propertyName]]: false,
          };

          styleSDK.style.removeProperty(propertyName);
          api.setProps({
            corvid: propsToCorvid,
          });
        },
      };
    },
    get icon() {
      return state.iconMediaUrl || createSvgWixMediaUrl(sdkData.svgId, '');
    },
    set icon(value: string | null | undefined) {
      setState({ iconMediaUrl: value });
      if (value) {
        setProps(
          fetchIconSvgString(
            value,
            sdkData.mediaSvgUrl,
            props.corvid,
            handlers.sanitizeSVG,
          ),
        );
      } else {
        setProps({ corvid: { ...props.corvid, iconSvgString: null } });
      }
    },
    get iconCollapsed() {
      return !!props.corvid?.iconCollapsed;
    },
    set iconCollapsed(value: boolean) {
      setProps({ corvid: { ...props.corvid, iconCollapsed: value } });
    },
    collapseIcon() {
      setProps({ corvid: { ...props.corvid, iconCollapsed: true } });
    },
    expandIcon() {
      setProps({ corvid: { ...props.corvid, iconCollapsed: false } });
    },
    get type() {
      return '$w.Button';
    },
    toJSON() {
      const { label } = labelSDK;
      const { style } = styleSDK;

      return {
        ...toJSONBase(api.metaData),
        label,
        style: { ...style },
        type: '$w.Button',
      };
    },
  };
};

const elementPropsSDKFactory = createElementPropsSDKFactory();

const stylableButtonSDKFactory = withValidation(
  _stylableButtonSDKFactory,
  {
    type: ['object'],
    properties: { icon: { type: ['string', 'nil'] } },
  },
  {
    icon: [
      (value: string | null | undefined) => {
        if (value) {
          const isValid = assert.isSVG(value);
          if (!isValid) {
            reportError(messages.invalidSvgValue(value));
          }
        }
        return true;
      },
    ],
  },
);

export const accessibilityPropsSDKFactory = createAccessibilityPropSDKFactory({
  enableAriaLabel: true,
  enableAriaLabelledBy: true,
  enableAriaDescribedBy: true,
  enableAriaControls: true,
  enableAriaExpanded: true,
  enableAriaPressed: true,
  enableAriaOwns: true,
  enableAriaLive: true,
  enableAriaAtomic: true,
  enableAriaRelevant: true,
  enableAriaHaspopup: true,
  enableTabIndex: true,
  enableScreenReader: true,
});

export const sdk = composeSDKFactories<
  IStylableButtonProps,
  IStylableButtonSDK
>(
  elementPropsSDKFactory,
  clickPropsSDKFactory,
  focusPropsSDKFactory,
  disablePropsSDKFactory,
  linkPropsSDKFactory,
  accessibilityPropsSDKFactory,
  stylableButtonSDKFactory,
);

export default createComponentSDKModel(sdk);
