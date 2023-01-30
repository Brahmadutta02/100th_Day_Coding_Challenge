import {SPECS as SdkSpecs} from '@wix/wixstores-client-storefront-sdk/dist/es/src/constants';

export const translationPath = (baseUrl: string, locale: string) =>
  `${baseUrl}assets/locale/productWidget/productWidget_${locale}.json`;

export const FormFactor = {
  Desktop: 'Desktop',
  Mobile: 'Mobile',
  Tablet: 'Tablet',
} as const;

export type FormFactorType = typeof FormFactor[keyof typeof FormFactor];

export const origin = 'product-widget';

export const SPECS = {
  ...SdkSpecs,
  EDITOR_OOI: 'specs.stores.EditorOOI',
  SHOW_PRE_ORDER_PRICE: 'specs.stores.GalleryPreOrderWhenADCButtonDisabled',
  USE_NEW_QUERIES_WITH_DISCOUNT_ON_PRODUCT_WIDGET: 'specs.stores.useNewQueriesWithDiscountOnProductWidget',
  SHOW_AUTOMATIC_DISCOUNT_DATA_ON_PRODUCT_WIDGET: 'specs.stores.ShowAutomaticDiscountDataOnProductWidget',
};

export const MULTILINGUAL_TO_TRANSLATIONS_MAP = {
  NAVIGATE_TO_PRODUCT_PAGE_BUTTON: 'PRODUCT_WIDGET_BUTTON_TEXT',
  ADD_TO_CART_BUTTON: 'PRODUCT_WIDGET_BUTTON_TEXT',
  OUT_OF_STOCK: 'PRODUCT_WIDGET_BUTTON_OOS_TEXT',
};

export enum Experiments {}
