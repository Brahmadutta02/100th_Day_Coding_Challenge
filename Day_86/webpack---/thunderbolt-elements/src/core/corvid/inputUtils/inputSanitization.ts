import { assert } from '@wix/editor-elements-corvid-utils';

const removeLineBreaksRegex = /(\r\n|\n|\r)/gm;

const validFloatingPointNumberRegex = /^-?(\d+|\d+\.\d+|\.\d+)([eE][-+]?\d+)?$/;

export type Sanitizer = (value: any) => any;

export const numberToString = (value: unknown) => {
  return assert.isNumber(value) && isFinite(value) ? value.toString() : value;
};

export const emptyStringIfNotString = (value: unknown) => {
  return assert.isString(value) ? value : '';
};

export const removeLineBreaks = (value: string) =>
  value.replace(removeLineBreaksRegex, '');

export const forceMaxLength =
  (maxLength: number | null | undefined) => (value: string) =>
    maxLength ? value.substr(0, maxLength) : value;

export const removeLeadingAndTrailingWhitespace = (value: string) =>
  value.trim();

export const validFloatingPointNumber = (value: string) => {
  return validFloatingPointNumberRegex.test(value) ? value : '';
};

export const normalizePrecision =
  (step: number | null | undefined) => (value: string) => {
    if (!value || !value.length || !step) {
      return value;
    }
    const normalizedStep = Number(
      (Math.log(1 / step) / Math.log(10)).toFixed(),
    );
    return Number(value).toFixed(normalizedStep);
  };

export const composeSanitizers =
  (sanitizers: Array<Sanitizer>): Sanitizer =>
  (value: unknown) =>
    sanitizers.reduce((_value, sanitizer) => sanitizer(_value), value);
