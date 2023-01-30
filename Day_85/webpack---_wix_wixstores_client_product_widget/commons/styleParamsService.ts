import {FormFactor, FormFactorType} from '../constants';
import {getStyleParamsWithDefaults} from '@wix/wixstores-client-common-components/dist/es/src/outOfIframes/defaultStyleParams/getStyleParamsWithDefaults';
import {IWixStyleParams} from '@wix/wixstores-client-core/dist/src/types/wix-sdk';
import {IWixWindowFormFactor} from '@wix/native-components-infra/dist/src/types/types';
import {IProductWidgetSettings} from '../types/app-types';
import {
  ImageScaling,
  WidgetActionEnum,
  WidgetAlignmentEnum,
  WidgetAreaEnum,
  WidgetDirectionEnum,
  WidgetPresetIdEnum,
} from './enums';

const isMobile = (formFactor: string) => formFactor === FormFactor.Mobile;

export const createTextParam = (value: string) => ({
  value,
  fontStyleParam: false,
});

export interface IRequiredSettingsForDefaultStyleParams {
  isMobile: boolean;
  orientation: WidgetPresetIdEnum;
}

export const getDefaultStyleParams = (settings: IRequiredSettingsForDefaultStyleParams): Partial<IWixStyleParams> => ({
  booleans: {
    titleToggle: true,
    priceToggle: true,
    discountNameToggle: true,
    separatorToggle: settings.orientation === WidgetPresetIdEnum.HORIZONTAL,
    extendOnHoverToggle: true,
    extendOnHolidayToggle: false,
    extendFullImageOnHoverToggle: false,
    hoverButtonToggle: !settings.isMobile && settings.orientation === WidgetPresetIdEnum.VERTICAL,
    widgetButtonToggle: !(settings.isMobile && settings.orientation === WidgetPresetIdEnum.VERTICAL),
  },
  numbers: {
    hoverBackgroundColorOpacity: 0,
    hoverBorderSize: 0,
    actionButton_borderSize: 0,
    actionButton_cornersRadius: 0,
  },
  fonts: {
    imageScaling: createTextParam(ImageScaling.CROP),
    widgetAction: createTextParam(WidgetActionEnum.NAVIGATE),
    layout: createTextParam(''),
    alignment: createTextParam(
      settings.orientation === WidgetPresetIdEnum.HORIZONTAL ? WidgetAlignmentEnum.CENTER : WidgetAlignmentEnum.LEFT
    ),
    widgetDirection: createTextParam(WidgetDirectionEnum.LEFT),
    hoverArea: createTextParam(WidgetAreaEnum.CONTENT),
    hoverBorderArea: createTextParam(WidgetAreaEnum.CONTENT),
    hoverButtonArea: createTextParam(WidgetAreaEnum.CONTENT),
    visualWidth: createTextParam('50%'),
    hoverState: createTextParam('zoom'),
  },
});

export function getRuntimeStyleParams(
  styleParams: Partial<IWixStyleParams>,
  {formFactor, widgetPreset}: {formFactor: FormFactorType | IWixWindowFormFactor; widgetPreset: WidgetPresetIdEnum}
) {
  return getStyleParamsWithDefaults(styleParams as IWixStyleParams, () => ({
    defaults: getDefaultStyleParams({isMobile: isMobile(formFactor), orientation: widgetPreset}),
  }));
}

const textKeys = [
  'alignment',
  'widgetAction',
  'imageScaling',
  'visualWidth',
  'widgetDirection',
  'hoverArea',
  'hoverBorderArea',
  'hoverButtonArea',
  'hoverState',
  'layout',
];

const extractFontParams = (fontStyleParams: IWixStyleParams['fonts']): {fonts: Record<string, any>} => {
  const fonts = {};
  textKeys.forEach((key) => {
    fonts[key] = fontStyleParams[key].value;
  });
  return {
    fonts,
  };
};

export function getProductWidgetSettings(styleParams: IWixStyleParams): IProductWidgetSettings {
  const {
    numbers: {hoverBackgroundColorOpacity, hoverBorderSize, actionButton_cornersRadius},
    booleans: {
      widgetButtonToggle,
      titleToggle,
      full_width: fullWidth,
      priceToggle,
      discountNameToggle,
      separatorToggle,
      hoverButtonToggle,
      extendOnHoverToggle,
      extendOnHolidayToggle,
      extendFullImageOnHoverToggle,
    },
  } = styleParams;
  const {fonts: fontParams} = extractFontParams(styleParams.fonts);

  return {
    ...(fontParams as any),
    fullWidth,
    hoverBackgroundColorOpacity,
    hoverBorderSize,
    actionButton_cornersRadius,
    widgetButtonToggle,
    titleToggle,
    priceToggle,
    discountNameToggle,
    separatorToggle,
    hoverButtonToggle,
    extendOnHoverToggle,
    extendOnHolidayToggle,
    extendFullImageOnHoverToggle,
  };
}

export function getProductWidgetSettingsFromProps(props: any): IProductWidgetSettings {
  return getProductWidgetSettings(props.globals.style.styleParams);
}
