import {
  withValidation,
  composeSDKFactories,
  assert,
  keyUpPropsSDKFactory,
  createElementPropsSDKFactory,
  createAccessibilityPropSDKFactory,
  clickPropsSDKFactory,
  toJSONBase,
  focusPropsSDKFactory,
} from '@wix/editor-elements-corvid-utils';
import type { WRichTextSdkData } from '@wix/thunderbolt-components';
import { createComponentSDKModel } from '@wix/editor-elements-integrations/corvid';
import { sanitizeHTML } from '../../../core/commons/htmlUtils';
import type {
  IWRichTextProps,
  IWRichTextSDK,
  IWRichTextOwnSDKFactory,
} from '../WRichText.types';
import {
  wixGuard,
  endBlockTagRegex,
  endTagRegex,
  startTagRegex,
  wixCodeName as type,
} from '../constants';

import { flow } from '../../../core/utils';
import {
  applyTransformationForGetHtml,
  applyTransformationForSetHtml,
  convertLinkProperties,
  removeWixGuard,
  decode,
  insertContentInHtml,
  insertContentInMarker,
  getMarkerContent,
  wrapWithRichTextMarker,
  hasRichTextMarker,
  escape,
  unescape,
  stripImpliedLinks,
  replaceFirstTagWith,
  SetHTMLTransformConfig,
} from './utils';

const endBlockTagPattern = new RegExp(endBlockTagRegex, 'mg');
const endTagPattern = new RegExp(endTagRegex, 'mg');
const startTagPattern = new RegExp(startTagRegex, 'mg');

const isUndefined = (str: string) => (assert.isNil(str) ? '' : str);

export const _wRichTextSdkFactory: IWRichTextOwnSDKFactory = ({
  setProps,
  props,
  platformUtils: { linkUtils },
  metaData,
  sdkData,
  createSdkState,
}) => {
  const [sdkState, setSDKState] = createSdkState<WRichTextSdkData>(sdkData);

  const getLinkProps = (url: string) => {
    if (!sdkState.linkPropsByHref || !sdkState.linkPropsByHref[url]) {
      const linkProperties = linkUtils.getLinkProps(url); // Properties
      setSDKState({
        linkPropsByHref: {
          ...(sdkState.linkPropsByHref || {}),
          [url]: linkProperties,
        },
      });
    }
    return sdkState.linkPropsByHref[url];
  };

  const convertLinksForSetter = (str: string) =>
    convertLinkProperties(str, getLinkProps);

  const convertLinksForGetter = (str: string) =>
    convertLinkProperties(str, getLinkProps, linkUtils.getLink);

  const getHtml = () =>
    flow(
      removeWixGuard,
      stripImpliedLinks,
      applyTransformationForGetHtml,
      convertLinksForGetter,
    )(props.html);

  const getPreparedHTML = (html: string, config?: SetHTMLTransformConfig) => {
    return flow(
      isUndefined,
      _html => applyTransformationForSetHtml(_html, config),
      convertLinksForSetter,
      linkUtils.getImpliedLinks,
      sanitizeHTML,
    )(html);
  };

  const getText = () =>
    props.html
      ? decode(
          unescape(
            stripImpliedLinks(removeWixGuard(props.html))
              .replace(/\n/g, '')
              .replace(/<br>/g, '\n')
              .replace(/<br><\/br>/g, '\n')
              .replace(/<br\s*\/?>/g, '\n')
              .replace(endBlockTagPattern, '\n')
              .replace(endTagPattern, '')
              .replace(startTagPattern, '')
              .trim(),
          ),
        )
      : '';

  const getRichText = () => flow(isUndefined, getMarkerContent)(props.html);

  return {
    get type() {
      return type;
    },

    get html() {
      return getHtml();
    },

    set html(value) {
      setProps({
        html: getPreparedHTML(value, { addDefaultClasses: true }),
      });
    },

    get text() {
      return getText();
    },

    set text(value) {
      const escapedHTML = value
        ? escape(value).replace(/\n/g, '<br>')
        : wixGuard;

      const html = linkUtils.getImpliedLinks(
        insertContentInHtml(stripImpliedLinks(props.html), escapedHTML),
        { parseEscaped: true },
      );

      setProps({
        html,
      });
    },

    get richText() {
      return getRichText();
    },
    set richText(value) {
      // If the first tag is p it should be replaced with a div
      // Bugfix for: https://jira.wixpress.com/browse/EE-36818
      const currentHtml = replaceFirstTagWith(props.html, 'p', 'div');

      if (hasRichTextMarker(currentHtml)) {
        setProps({
          html: insertContentInMarker(currentHtml, getPreparedHTML(value)),
        });
      } else {
        const html = getPreparedHTML(value);
        const withMarker = wrapWithRichTextMarker(html);
        setProps({
          html: insertContentInHtml(currentHtml, withMarker),
        });
      }
    },

    toJSON() {
      return {
        ...toJSONBase(metaData),
        type,
        html: getHtml(),
        text: getText(),
        richText: getRichText(),
      };
    },
  };
};

const wRichTextSDKFactory = withValidation(_wRichTextSdkFactory, {
  type: ['object'],
  properties: {
    html: { type: ['string', 'nil'], warnIfNil: true },
    text: { type: ['string', 'nil'], warnIfNil: true },
  },
});

const elementPropsSDKFactory = createElementPropsSDKFactory();

export const accessibilityPropsSDKFactory = createAccessibilityPropSDKFactory({
  enableRole: true,
  enableAriaHidden: true,
  enableAriaLabel: true,
  enableAriaLabelledBy: true,
  enableAriaDescribedBy: true,
  enableAriaRoleDescription: true,
  enableAriaLive: true,
  enableAriaAtomic: true,
  enableAriaRelevant: true,
  enableAriaBusy: true,
  enableTabIndex: true,
  enableScreenReader: true,
});

export const sdk = composeSDKFactories<IWRichTextProps, any, IWRichTextSDK>(
  elementPropsSDKFactory,
  clickPropsSDKFactory,
  accessibilityPropsSDKFactory,
  wRichTextSDKFactory,
  focusPropsSDKFactory,
  keyUpPropsSDKFactory,
);

export default createComponentSDKModel(sdk);
