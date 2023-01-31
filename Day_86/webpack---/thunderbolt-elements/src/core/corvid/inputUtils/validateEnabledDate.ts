import { DatePickerDate } from '@wix/editor-elements-corvid-utils';
import {
  convertDateRangesArray,
  convertDateStringToDate,
  DateRange,
  isDateDisabled,
} from '../../commons/dateUtils';
import { ValidationData } from './inputValidationTypes';
import { addErrorToValidationDataAndKeepHtmlMessage } from '.';

const getCurrentDatePickerValue = ({
  value: valueFromProps,
  useTodayAsDefaultValue,
  timeZone,
}: {
  value?: string | Date;
  useTodayAsDefaultValue?: boolean;
  timeZone?: string | null;
}) => {
  if (useTodayAsDefaultValue && !valueFromProps) {
    return new DatePickerDate({
      type: 'Now',
      timeZone: timeZone || 'Local',
    }).getAsDate('Local');
  }

  return typeof valueFromProps === 'string'
    ? convertDateStringToDate(valueFromProps)
    : valueFromProps;
};

export const validateEnabledDate = (
  props: {
    value?: string | Date;
    timeZone?: string | null;
    enabledDateRanges?: Array<DateRange<string>> | null;
    disabledDateRanges?: Array<DateRange<string>>;
    disabledDates?: Array<string>;
    disabledDaysOfWeek?: Array<number>;
    minDate?: string;
    maxDate?: string;
    allowPastDates?: boolean;
    allowFutureDates?: boolean;
    useTodayAsDefaultValue?: boolean;
  },
  validationData: ValidationData,
): ValidationData => {
  const {
    timeZone,
    disabledDaysOfWeek,
    allowPastDates,
    allowFutureDates,
    useTodayAsDefaultValue,
  } = props;

  const value = getCurrentDatePickerValue({
    value: props.value,
    useTodayAsDefaultValue,
    timeZone,
  });

  if (!value) {
    return validationData;
  }

  const enabledDateRanges = props.enabledDateRanges
    ? convertDateRangesArray(props.enabledDateRanges, date =>
        convertDateStringToDate(date),
      )
    : null;
  const disabledDateRanges = props.disabledDateRanges
    ? convertDateRangesArray(props.disabledDateRanges, date =>
        convertDateStringToDate(date),
      )
    : null;
  const disabledDates = props.disabledDates
    ? props.disabledDates.map(date => convertDateStringToDate(date))
    : null;
  const minDate = props.minDate ? convertDateStringToDate(props.minDate) : null;
  const maxDate = props.maxDate ? convertDateStringToDate(props.maxDate) : null;

  if (
    isDateDisabled(value, {
      enabledDateRanges,
      disabledDateRanges,
      disabledDates,
      minDate,
      maxDate,
      disabledDaysOfWeek,
      allowPastDates,
      allowFutureDates,
      timeZone,
    })
  ) {
    return addErrorToValidationDataAndKeepHtmlMessage(
      validationData,
      'invalidDate',
      {
        key: 'DATE_PICKER_INVALID_DATE',
      },
    );
  }
  return validationData;
};
