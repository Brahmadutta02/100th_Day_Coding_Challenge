import {
  withValidation,
  composeSDKFactories,
  reportError,
  messageTemplates,
  assert,
  DatePickerDate,
  TimeZone,
  registerCorvidEvent,
  labelPropsSDKFactory,
  isNumber,
  createAccessibilityPropSDKFactory,
  readOnlyPropsSDKFactory,
  createValidationPropsSDKFactory,
  createRequiredPropsSDKFactory,
  focusPropsSDKFactory,
  disablePropsSDKFactory,
  clickPropsSDKFactory,
  changePropsSDKFactory,
  createElementPropsSDKFactory,
  toJSONBase,
} from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations/corvid';
import type {
  IDatePickerProps,
  IDatePickerOwnSDKFactory,
  IDatePickerSDK,
  IDatePickerImperativeActions,
  IDatePickerOnViewChangeComponentEvent,
  IDatePickerOnViewChangeCorvidEvent,
  OnViewChangeEvent,
  OnViewChangeHandler,
  IDateSlot,
} from '../DatePicker.types';
import {
  createInputValidator,
  InputValidator,
  composeValidators,
  validateRequired,
  validateEnabledDate,
} from '../../../core/corvid/inputUtils';
import {
  convertDateRangesArray,
  DateRange,
} from '../../../core/commons/dateUtils';

export const DEFAULT_TIMEOUT = 10000;

const datePickerValidator: InputValidator<
  IDatePickerProps,
  IDatePickerImperativeActions
> = createInputValidator(
  composeValidators<IDatePickerProps>([validateRequired, validateEnabledDate]),
);

const validationPropsSDKFactory = createValidationPropsSDKFactory<
  IDatePickerProps,
  IDatePickerImperativeActions
>(datePickerValidator);

const requiredPropsSDKFactory = createRequiredPropsSDKFactory<
  IDatePickerProps,
  IDatePickerImperativeActions
>(datePickerValidator);

const _ownSDKFactory: IDatePickerOwnSDKFactory = api => {
  const { props, setProps, metaData, createSdkState } = api;

  const [state, setState] = createSdkState({
    onViewChangeArgs: null as null | {
      operation?: ({ options }: { options: IDateSlot }) => Promise<any>;
      handler: (event: OnViewChangeEvent<any>) => void;
      timeout: number;
    },
    onViewChangeCbCounter: 1,
  });

  const handleOnViewChange = async (
    event: IDatePickerOnViewChangeCorvidEvent<any>,
  ) => {
    const cbCounter = state.onViewChangeCbCounter || 1;
    setState({ onViewChangeCbCounter: cbCounter + 1 });
    let localCounter = state.onViewChangeCbCounter;

    setProps({ calendarLoading: true, calendarError: false });

    try {
      const timeout = state.onViewChangeArgs?.timeout;

      const timeoutHandle = setTimeout(() => {
        if (localCounter === state.onViewChangeCbCounter) {
          localCounter = -1;
          setProps({ calendarLoading: false, calendarError: true });
        }
      }, timeout);

      const result = await state.onViewChangeArgs?.operation?.({
        options: {
          startDate: event.options.startDate,
          endDate: event.options.endDate,
        },
      });
      clearTimeout(timeoutHandle);

      if (localCounter === state.onViewChangeCbCounter) {
        state.onViewChangeArgs?.handler({
          ...event,
          options: {
            ...event.options,
            operationResult: result,
          },
        });
        setProps({ calendarLoading: false });
      }
    } catch (ex) {
      if (localCounter === state.onViewChangeCbCounter) {
        setProps({ calendarLoading: false, calendarError: true });
      }
    }
  };
  registerCorvidEvent<
    IDatePickerOnViewChangeComponentEvent<any>,
    IDatePickerOnViewChangeCorvidEvent<any>
  >(
    'onViewChange',
    api,
    async (event: IDatePickerOnViewChangeCorvidEvent<any>) => {
      if (state.onViewChangeArgs) {
        const { operation, handler } = state.onViewChangeArgs;

        if (operation) {
          handleOnViewChange({ ...event, type: 'onViewChange' });
        } else {
          handler({
            ...event,
            options: {
              ...event.options,
            },
          });
        }
      }
    },
    ({ componentEvent }: { componentEvent: any }) => {
      return componentEvent;
    },
  );

  function onViewChange<Type>(
    handler: OnViewChangeHandler<Type>,
    operation?: ({ options }: { options: IDateSlot }) => Promise<Type>,
    timeout?: number,
  ) {
    const shouldValidateOperation = !!operation;

    if (
      typeof handler === 'function' &&
      (!shouldValidateOperation || typeof operation === 'function')
    ) {
      setState({
        onViewChangeArgs: {
          handler,
          operation,
          timeout: isNumber(timeout) ? timeout : DEFAULT_TIMEOUT,
        },
      });
    } else {
      const propertyName =
        typeof handler !== 'function' ? 'handler' : 'operation';
      const value = typeof handler !== 'function' ? handler : operation;

      reportError(
        messageTemplates.error_type({
          functionName: 'onViewChange',
          propertyName,
          expectedType: 'function',
          value,
        }),
      );
    }
  }

  const sdkProps = {
    onViewChange,
    get timeZone() {
      return props.timeZone;
    },
    set timeZone(timeZoneIANA) {
      if (timeZoneIANA === null || TimeZone.isTimeZoneValid(timeZoneIANA)) {
        setProps({
          timeZone: timeZoneIANA,
        });
      } else {
        reportError(
          messageTemplates.error_bad_iana_timezone({
            timeZoneIANA: timeZoneIANA || '',
          }),
        );
      }
    },
    get value() {
      const timeZone = props.timeZone;

      // TODO: remove this if after TB-939 is fixed
      if (props.useTodayAsDefaultValue && !props.value) {
        return new DatePickerDate({
          type: 'Now',
          timeZone: timeZone || 'Local',
        }).getAsDate(timeZone || 'Local');
      }

      if (props.value && timeZone) {
        return new DatePickerDate({
          type: 'Date',
          date: props.value,
          timeZone: 'Local',
        }).getAsDate(timeZone);
      } else {
        return props.value || null;
      }
    },
    set value(value) {
      const timeZone = props.timeZone;

      if (value) {
        value = new DatePickerDate({
          type: 'Date',
          date: new Date(value),
          timeZone: timeZone || 'Local',
        }).getAsDate('Local');
      }

      setProps({
        value: value ? new Date(value) : value,
      });

      datePickerValidator.validate({
        viewerSdkAPI: api,
        showValidityIndication: true,
      });
    },
    get maxDate() {
      const timeZone = props.timeZone;
      let maxDate = props.maxDate ? new Date(props.maxDate) : null;

      if (maxDate && timeZone) {
        maxDate = new DatePickerDate({
          type: 'Date',
          date: maxDate,
          timeZone: 'Local',
        }).getAsDate(timeZone);
      }

      return maxDate;
    },
    set maxDate(maxDate) {
      const timeZone = props.timeZone;

      if (maxDate) {
        maxDate = new DatePickerDate({
          type: 'Date',
          date: maxDate,
          timeZone: timeZone || 'Local',
        }).getAsDate('Local');
      }

      setProps({
        maxDate: maxDate?.toISOString(),
      });

      datePickerValidator.validate({
        viewerSdkAPI: api,
        showValidityIndication: true,
      });
    },
    get minDate() {
      const timeZone = props.timeZone;
      let minDate = props.minDate ? new Date(props.minDate) : null;

      if (minDate && timeZone) {
        minDate = new DatePickerDate({
          type: 'Date',
          date: minDate,
          timeZone: 'Local',
        }).getAsDate(timeZone);
      }

      return minDate;
    },
    set minDate(minDate) {
      const timeZone = props.timeZone;

      if (minDate) {
        minDate = new DatePickerDate({
          type: 'Date',
          date: minDate,
          timeZone: timeZone || 'Local',
        }).getAsDate('Local');
      }

      setProps({
        minDate: minDate?.toISOString(),
      });

      datePickerValidator.validate({
        viewerSdkAPI: api,
        showValidityIndication: true,
      });
    },
    get disabledDates() {
      const timeZone = props.timeZone;
      let disabledDates = props.disabledDates.map(date => new Date(date));

      if (disabledDates && timeZone) {
        disabledDates = disabledDates.map(date =>
          new DatePickerDate({
            type: 'Date',
            date,
            timeZone: 'Local',
          }).getAsDate(timeZone),
        );
      }

      return disabledDates;
    },
    set disabledDates(disabledDates) {
      const timeZone = props.timeZone;

      if (disabledDates) {
        disabledDates = disabledDates.map(date =>
          new DatePickerDate({
            type: 'Date',
            date,
            timeZone: timeZone || 'Local',
          }).getAsDate('Local'),
        );
      }

      setProps({
        disabledDates: (disabledDates || []).map(date => date.toISOString()),
      });

      datePickerValidator.validate({
        viewerSdkAPI: api,
        showValidityIndication: true,
      });
    },
    get enabledDateRanges() {
      const timeZone = props.timeZone;
      let enabledDateRanges = props.enabledDateRanges
        ? convertDateRangesArray(
            props.enabledDateRanges,
            date => new Date(date),
          )
        : null;

      if (enabledDateRanges && timeZone) {
        enabledDateRanges = convertDateRangesArray(enabledDateRanges, date =>
          new DatePickerDate({
            type: 'Date',
            date,
            timeZone: 'Local',
          }).getAsDate(timeZone),
        );
      }

      return enabledDateRanges;
    },
    set enabledDateRanges(enabledDateRanges) {
      const timeZone = props.timeZone;

      if (enabledDateRanges) {
        enabledDateRanges = convertDateRangesArray(enabledDateRanges, date =>
          new DatePickerDate({
            type: 'Date',
            date,
            timeZone: timeZone || 'Local',
          }).getAsDate('Local'),
        );
      }

      setProps({
        enabledDateRanges: enabledDateRanges
          ? convertDateRangesArray(enabledDateRanges, date =>
              date.toISOString(),
            )
          : null,
      });

      datePickerValidator.validate({
        viewerSdkAPI: api,
        showValidityIndication: true,
      });
    },
    get disabledDateRanges() {
      const timeZone = props.timeZone;
      let disabledDateRanges = convertDateRangesArray(
        props.disabledDateRanges,
        date => new Date(date),
      );

      if (timeZone) {
        disabledDateRanges = convertDateRangesArray(disabledDateRanges, date =>
          new DatePickerDate({
            type: 'Date',
            date,
            timeZone: 'Local',
          }).getAsDate(timeZone),
        );
      }

      return disabledDateRanges;
    },
    set disabledDateRanges(disabledDateRanges) {
      const timeZone = props.timeZone;

      if (disabledDateRanges) {
        disabledDateRanges = convertDateRangesArray(disabledDateRanges, date =>
          new DatePickerDate({
            type: 'Date',
            date,
            timeZone: timeZone || 'Local',
          }).getAsDate('Local'),
        );
      }

      setProps({
        disabledDateRanges: disabledDateRanges
          ? convertDateRangesArray(disabledDateRanges, date =>
              date.toISOString(),
            )
          : [],
      });

      datePickerValidator.validate({
        viewerSdkAPI: api,
        showValidityIndication: true,
      });
    },
    get disabledDaysOfWeek() {
      return props.disabledDaysOfWeek;
    },
    set disabledDaysOfWeek(disabledDaysOfWeek) {
      setProps({
        disabledDaysOfWeek: disabledDaysOfWeek || [],
      });

      datePickerValidator.validate({
        viewerSdkAPI: api,
        showValidityIndication: true,
      });
    },
    get dateFormat() {
      return props.dateFormat;
    },
    set dateFormat(dateFormat) {
      setProps({
        dateFormat,
      });
    },
    toJSON() {
      const { readOnly, required } = props;
      const {
        value,
        maxDate,
        minDate,
        disabledDates,
        disabledDaysOfWeek,
        timeZone,
        dateFormat,
        enabledDateRanges,
        disabledDateRanges,
      } = sdkProps;
      return {
        ...toJSONBase(metaData),
        readOnly,
        required,
        value,
        maxDate,
        minDate,
        disabledDates,
        enabledDateRanges,
        disabledDateRanges,
        disabledDaysOfWeek,
        timeZone,
        dateFormat,
      };
    },
  };

  return sdkProps;
};

const ownSDKFactory = withValidation(
  _ownSDKFactory,
  {
    type: ['object'],
    properties: {
      timeZone: {
        type: ['string', 'nil'],
      },
      value: {
        type: ['date', 'nil'],
      },
      maxDate: {
        type: ['date', 'nil'],
      },
      minDate: {
        type: ['date', 'nil'],
      },
      disabledDates: {
        type: ['array', 'nil'],
        items: {
          type: ['date', 'nil'],
          warnIfNil: true,
        },
      },
      enabledDateRanges: {
        type: ['array', 'nil'],
        items: {
          type: ['object'],
          properties: {
            startDate: { type: ['date'] },
            endDate: { type: ['date'] },
          },
          required: ['startDate', 'endDate'],
        },
      },
      disabledDateRanges: {
        type: ['array', 'nil'],
        items: {
          type: ['object'],
          properties: {
            startDate: { type: ['date'] },
            endDate: { type: ['date'] },
          },
          required: ['startDate', 'endDate'],
        },
        warnIfNil: true,
      },
      disabledDaysOfWeek: {
        type: ['array', 'nil'],
        items: {
          type: ['number', 'nil'],
          enum: [0, 1, 2, 3, 4, 5, 6],
          warnIfNil: true,
        },
      },
      dateFormat: {
        type: ['string'],
        enum: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY/MM/DD', 'YYYY/M/D'],
      },
    },
  },
  {
    enabledDateRanges: [
      (
        enabledDateRanges: Array<DateRange<Date>> | null | undefined,
      ): boolean => {
        if (assert.isNil(enabledDateRanges)) {
          return true;
        }

        return validateDateRangeArray({
          rangeArray: enabledDateRanges,
          propertyName: 'enabledDateRanges',
        });
      },
    ],
    disabledDateRanges: [
      (
        disabledDateRanges: Array<DateRange<Date>> | null | undefined,
      ): boolean => {
        if (assert.isNil(disabledDateRanges)) {
          return true;
        }

        return validateDateRangeArray({
          rangeArray: disabledDateRanges,
          propertyName: 'disabledDateRanges',
        });
      },
    ],
  },
);

const validateDateRangeArray = ({
  rangeArray,
  propertyName,
}: {
  rangeArray: Array<DateRange<Date>>;
  propertyName: string;
}) => {
  for (let index = 0; index < rangeArray.length; index++) {
    const range = rangeArray[index];

    if (!(range.startDate <= range.endDate)) {
      reportError(
        messageTemplates.error_object_bad_format_with_index({
          keyName: 'startDate',
          propertyName,
          index,
          functionName: `set ${propertyName}`,
          wrongValue: `"${range.startDate}"`,
          message: `Start date can not be greater than the end date which is "${range.endDate}"`,
        }),
      );

      return false;
    }
  }

  return true;
};

const useHiddenCollapsed = true;
const hasPortal = true;
const elementPropsSDKFactory = createElementPropsSDKFactory({
  useHiddenCollapsed,
  hasPortal,
});

export const accessibilityPropsSDKFactory = createAccessibilityPropSDKFactory({
  enableAriaLabel: true,
  enableAriaDescribedBy: true,
  enableAriaLabelledBy: true,
});

export const sdk = composeSDKFactories<IDatePickerProps, IDatePickerSDK, any>(
  elementPropsSDKFactory,
  disablePropsSDKFactory,
  focusPropsSDKFactory,
  readOnlyPropsSDKFactory,
  clickPropsSDKFactory,
  requiredPropsSDKFactory,
  validationPropsSDKFactory,
  changePropsSDKFactory,
  labelPropsSDKFactory,
  accessibilityPropsSDKFactory,
  ownSDKFactory,
);

export default createComponentSDKModel(sdk);
