import {
  withValidation,
  messages,
  reportError,
  reportWarning,
  assert,
} from '@wix/editor-elements-corvid-utils';
import { ComboBoxInputNavigationOption } from '@wix/thunderbolt-components';
import {
  composeSanitizers,
  emptyStringIfNotString,
  numberToString,
} from '../inputUtils';
import {
  IMenuSDKDataItem,
  IMenuSDKDataItems,
  IMenuSDKFactory,
  IMenuSDKDataOption,
  IMenuSDKDataOptions,
  MenuItem,
  MenuItems,
  MenuOptions,
  MenuOption,
} from './Menu.types';

const valueSanitizer = composeSanitizers([
  numberToString,
  emptyStringIfNotString,
]);

const externalRegex = /^(http|https):\/\/(.*)/;
const pageUrlRegex = /^\/([^ ?#]*)[?]?(.*)/;

const isExternalPage = (url: string) => externalRegex.test(url);
const isPageUrl = (url: string) => pageUrlRegex.test(url);

const _menuPropsSDKFactory: IMenuSDKFactory = ({
  setProps,
  props,
  platformUtils: { linkUtils },
  sdkData,
}) => {
  const getPageTitleFromUrl = (
    url: string,
    pageList: { [id: string]: { title: string } },
  ): string => {
    const key = url.slice(1);
    if (pageList.hasOwnProperty(key)) {
      return pageList[key].title;
    } else {
      return '';
    }
  };

  const removeInvalidLevels = (items: IMenuSDKDataItems) => {
    if (!assert.isNil(items)) {
      items.forEach(topItem => {
        if (!assert.isNil(topItem.items)) {
          topItem.items.forEach(subItem => (subItem.items = []));
        }
      });
    }
  };

  const convertSdkDataItemsToModelFormat = (
    items: IMenuSDKDataItems,
  ): MenuItems | undefined => {
    if (assert.isNil(items)) {
      return items;
    }
    return items.map((menuItem: IMenuSDKDataItem) =>
      convertSdkDataItemToModelFormat(menuItem),
    );
  };

  const convertSdkDataItemToModelFormat = (
    menuItem: IMenuSDKDataItem,
  ): MenuItem => {
    const menuItemModelFormat: MenuItem = {
      label: '',
      link: undefined,
    };
    const target = isExternalPage(menuItem.link) ? '_blank' : '_self';
    const link = linkUtils.getLinkProps(menuItem.link, target);
    if (link) {
      menuItemModelFormat.link = link;
    }
    if (menuItem.label) {
      menuItemModelFormat.label = menuItem.label;
    } else if (menuItem.link && isPageUrl(menuItem.link)) {
      menuItemModelFormat.label = getPageTitleFromUrl(
        menuItem.link,
        sdkData.pageList,
      );
    } else {
      reportWarning(
        'The label parameter that is passed to the set items method cannot be set to null or undefined.',
      );
    }

    if (assert.isBoolean(menuItem.visibleOnDesktop)) {
      menuItemModelFormat.isVisible = menuItem.visibleOnDesktop;
    }
    if (assert.isBoolean(menuItem.visibleOnMobile)) {
      menuItemModelFormat.isVisibleMobile = menuItem.visibleOnMobile;
    }
    if (assert.isArray(menuItem.items)) {
      if (menuItem.items.length) {
        menuItemModelFormat.items = convertSdkDataItemsToModelFormat(
          menuItem.items,
        );
      } else {
        menuItemModelFormat.items = [];
      }
    }
    if (assert.isNumber(menuItem.displayCount)) {
      menuItemModelFormat.displayCount = menuItem.displayCount;
    }
    const menuItemDefaults = {
      isVisible: true,
      isVisibleMobile: true,
      items: [],
    };
    return { ...menuItemDefaults, ...menuItemModelFormat };
  };

  const convertSdkOptionsToModelFormat = (
    options: IMenuSDKDataOptions,
  ): MenuOptions | undefined => {
    if (assert.isNil(options)) {
      return options;
    }
    return options.map(option => convertSdkOptionToModelFormat(option));
  };

  const convertSdkOptionToModelFormat = (
    option: IMenuSDKDataOption,
  ): ComboBoxInputNavigationOption => {
    const menuItemModelFormat = {
      text: '',
      link: undefined,
      key: '',
      value: '',
    } as unknown as ComboBoxInputNavigationOption;
    const target = isExternalPage(option.link) ? '_blank' : '_self';
    const link = linkUtils.getLinkProps(option.link, target);
    if (link) {
      menuItemModelFormat.link = link;
    }
    if (option.label) {
      menuItemModelFormat.text = option.label;
    }

    if (option.value) {
      menuItemModelFormat.value = option.value;
      menuItemModelFormat.key = option.value;
    } else {
      reportWarning(
        'The value parameter that is passed to the set options method cannot be set to null or undefined.',
      );
    }

    return menuItemModelFormat;
  };

  const convertModelDataItemsToSdkFormat = (
    items: MenuItems,
  ): IMenuSDKDataItems => {
    return assert.isNil(items)
      ? items
      : items.map(modelItem => convertModelDataItemToSdkFormat(modelItem));
  };

  const convertModelDataItemToSdkFormat = (
    item: MenuItem,
  ): IMenuSDKDataItem => {
    const link = item.link ? linkUtils.getLink(item.link) : '';
    const items = item.items
      ? convertModelDataItemsToSdkFormat(item.items)
      : [];
    const visibleOnDesktop = assert.isNil(item.isVisible)
      ? true
      : item.isVisible;
    const visibleOnMobile = assert.isNil(item.isVisibleMobile)
      ? true
      : item.isVisibleMobile;
    const { label, displayCount } = item;
    return {
      label,
      displayCount,
      items,
      link,
      visibleOnDesktop,
      visibleOnMobile,
    };
  };

  const convertModelOptionsToSdkFormat = (
    options: MenuOptions,
  ): IMenuSDKDataOptions => {
    return assert.isNil(options)
      ? options
      : options.map(option => convertModelOptionToSdkFormat(option));
  };

  const convertModelOptionToSdkFormat = (
    option: MenuOption,
  ): IMenuSDKDataOption => {
    const link = option.link ? linkUtils.getLink(option.link) : '';
    const { text, value } = option;
    return {
      label: text,
      value,
      link,
    };
  };

  return {
    get items(): IMenuSDKDataItems {
      return convertModelDataItemsToSdkFormat(props.items) as IMenuSDKDataItems;
    },
    set items(value: IMenuSDKDataItems) {
      try {
        removeInvalidLevels(value);
        setProps({
          items: convertSdkDataItemsToModelFormat(value) as MenuItems,
        });
      } catch (e: any) {
        if (!assert.isNil(e.name) && e.name === 'UnsupportedLinkTypeError') {
          reportError(
            `A link property that is passed to the link method cannot be set to that value, as this is not a supported link type.`,
          );
        }
      }
    },
    get options(): IMenuSDKDataOptions {
      return convertModelOptionsToSdkFormat(props.options);
    },
    set options(value: IMenuSDKDataOptions) {
      try {
        setProps({
          options: convertSdkOptionsToModelFormat(value) as MenuOptions,
        });
      } catch (e: any) {
        if (!assert.isNil(e.name) && e.name === 'UnsupportedLinkTypeError') {
          reportError(
            `A link property that is passed to the link method cannot be set to that value, as this is not a supported link type.`,
          );
        }
      }
    },
    get type() {
      return '$w.Menu';
    },
    get value() {
      let value = '';

      if (props.options) {
        const isCurrentValueInOptions = props.options.some(
          option => option.value === props.value,
        );

        if (isCurrentValueInOptions) {
          value = props.value as string;
        }
      }

      return value;
    },
    set value(value) {
      const sanitizedValue = valueSanitizer(value);

      if (props.options) {
        const isValueInOptions = props.options.some(
          option => option.value === sanitizedValue,
        );

        setProps({ value: isValueInOptions ? sanitizedValue : '' });
      }
    },

    get autoNavigation() {
      // We used to allow auto navigation - which was implemented by a feature which has been removed
      return false;
    },
  };
};

export const menuPropsSDKFactory = withValidation(
  _menuPropsSDKFactory,
  {
    type: ['object'],
    properties: {
      items: {
        type: ['array', 'nil'],
        warnIfNil: true,
      },
      options: {
        type: ['array', 'nil'],
        warnIfNil: true,
        items: {
          type: ['object'],
          properties: {
            value: {
              type: ['string', 'nil'],
              minLength: 0,
              maxLength: 400,
            },
            label: {
              type: ['string', 'nil'],
              minLength: 0,
              maxLength: 400,
            },
          },
        },
      },
    },
  },
  {
    items: [
      (value: IMenuSDKDataItems) => {
        const isValid = typeof value === 'undefined' || assert.isArray(value);
        if (!isValid) {
          reportError(
            messages.invalidTypeMessage({
              value,
              types: ['array', 'undefined'],
              propertyName: 'items',
              functionName: 'set items',
              index: undefined,
            }),
          );
        }
        return isValid;
      },
    ],
    options: [
      (value: IMenuSDKDataOptions) => {
        const isValid = typeof value === 'undefined' || assert.isArray(value);
        if (!isValid) {
          reportError(
            messages.invalidTypeMessage({
              value,
              types: ['array', 'undefined'],
              propertyName: 'options',
              functionName: 'set options',
              index: undefined,
            }),
          );
        }
        return isValid;
      },
    ],
    value: [
      (value: string) => {
        const sanitizedValue = valueSanitizer(value);
        const isValid =
          typeof value === 'undefined' || assert.isString(sanitizedValue);

        if (!isValid) {
          reportError(
            messages.invalidTypeMessage({
              value,
              types: ['string', 'undefined'],
              propertyName: 'value',
              functionName: 'set value',
              index: undefined,
            }),
          );
        }
        return isValid;
      },
    ],
  },
);
