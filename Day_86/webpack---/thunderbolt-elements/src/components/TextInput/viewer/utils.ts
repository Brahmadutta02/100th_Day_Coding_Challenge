import type { TranslationGetter } from '@wix/editor-elements-types/thunderbolt';
import { HtmlValidationMessageOverrideObject } from '../../../core/corvid/inputUtils/inputValidationTypes';
import { TranslationKeys as translations } from './constants';

export const formatPhoneNumber = (
  unformattedValue: string,
  phoneFormat: string,
) => {
  const spaceInfo = getSpaceIndexesForPhoneFormat(
    unformattedValue,
    phoneFormat,
    false,
  );
  const newValueAsArray = Array.from(unformattedValue);

  spaceInfo.forEach(spaceIdx => {
    if (spaceIdx < newValueAsArray.length) {
      newValueAsArray.splice(spaceIdx, 0, ' ');
    }
  });

  return newValueAsArray.join('');
};

const getSpaceIndexesForPhoneFormat = (
  val: string,
  phoneFormat: string,
  isValueFormatted = true,
) => {
  const updatedSpaceInfo = Array.from(phoneFormat)
    .reduce((agg: Array<number>, curr, idx) => {
      return curr === '-' ? [...agg, idx] : agg;
    }, [])
    .filter((spaceIdx, index) => {
      return isValueFormatted
        ? spaceIdx <= val.length
        : spaceIdx <= val.length + index;
    });

  return updatedSpaceInfo;
};

export const getUnformattedNumber = (
  val: string,
  phoneFormat: string,
  didDeleteChars: boolean,
) => {
  const updatedSpaceInfo = getSpaceIndexesForPhoneFormat(val, phoneFormat);

  return updatedSpaceInfo
    .reduce((agg, curr, idx) => {
      if (val[curr] === ' ') {
        agg.splice(curr - idx, 1);
      } else if (val[curr + 1] === ' ' && !didDeleteChars) {
        const offset = 1 - idx;

        agg.splice(curr + offset, 1);
      } else if (val[curr - 1] === ' ' && didDeleteChars) {
        const didDeleteSpace =
          val.split(' ').length - 1 < updatedSpaceInfo.length;

        if (didDeleteSpace) {
          agg.splice(curr - idx, 1);
        } else {
          agg.splice(curr - idx - 1, 1);
        }
      }

      return agg;
    }, Array.from(val))
    .join('');
};

export const hasNonNumericChar = (str: string) => !!str.match(/[^\d]/);

export const translateHtmlValidationMessage = (
  message: HtmlValidationMessageOverrideObject,
  {
    translate,
    phoneFormat,
  }: { translate?: TranslationGetter; phoneFormat?: string },
): string => {
  if (translate) {
    switch (message.key) {
      case 'PHONE_FORMAT_LENGTH_VALIDATION_ERROR':
        return translatePhoneFormatLengthValidationError(
          phoneFormat,
          translate,
        );

      case 'PHONE_FORMAT_DEFAULT_VALIDATION_ERROR':
        return translatePhoneFormatDefaultValidationError(translate);

      case 'PHONE_FORMAT_COMPLEX_PHONE_DEFAULT_VALIDATION_ERROR':
        return translatePhoneFormatComplexPhoneDefaultValidationError(
          translate,
        );

      default:
        return message.key;
    }
  } else {
    return message.key;
  }
};

const translatePhoneFormatLengthValidationError = (
  phoneFormat: string | undefined,
  translate: TranslationGetter,
): string =>
  translate(
    translations.NAMESPACE,
    translations.PHONE_FORMAT_LENGTH_VALIDATION_ERROR,
    translations.PHONE_FORMAT_LENGTH_VALIDATION_ERROR_DEFAULT,
  ).replace(
    '{digits}',
    `${phoneFormat ? phoneFormat.replace(/-/g, '').length : 0}`,
  );

const translatePhoneFormatDefaultValidationError = (
  translate: TranslationGetter,
): string =>
  translate(
    translations.NAMESPACE,
    translations.PHONE_FORMAT_DEFAULT_VALIDATION_ERROR,
    translations.PHONE_FORMAT_DEFAULT_VALIDATION_ERROR_DEFAULT,
  );

const translatePhoneFormatComplexPhoneDefaultValidationError = (
  translate: TranslationGetter,
): string =>
  translate(
    translations.NAMESPACE,
    translations.PHONE_FORMAT_COMPLEX_PHONE_DEFAULT_VALIDATION_ERROR,
    translations.PHONE_FORMAT_COMPLEX_PHONE_DEFAULT_VALIDATION_ERROR_DEFAULT,
  );
