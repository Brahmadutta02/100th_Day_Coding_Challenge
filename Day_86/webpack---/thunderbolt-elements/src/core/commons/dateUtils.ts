import { assert } from '@wix/editor-elements-corvid-utils';

const cloneDate = (date: Date) => new Date(date);

export const getStartOfDay = (date: Date): Date => {
  const newDate = cloneDate(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

export const areDatesEqual = (date1: Date, date2: Date): boolean =>
  getStartOfDay(date1).getTime() === getStartOfDay(date2).getTime();

export const getGridOfDaysInMonth = (
  year: number,
  month: number,
  weekStartDay: number,
): Array<Array<number | undefined>> => {
  const firstDayInMonth = new Date(year, month);
  const lastDayInMonth = new Date(year, month + 1, 0).getDate();

  const firstDayInMonthWeekDay = firstDayInMonth.getDay();

  // We need to shift the days in the first week of the month relative to the starting day of the week. For example:
  // 1st of month is Tuesday and the week starts with Sunday (no shift):
  // [undefined, undefined, 1, 2, 3, 4, 5]
  // 1st of month is Tuesday and the week starts with Monday (shift by one):
  // [undefined, 1, 2, 3, 4, 5, 6]
  // 1st of month is Monday and the week starts with Tuesday (Monday is the last day of the week):
  // [undefined, undefined, undefined, undefined, undefined, undefined, 1]
  // 1st of month is Tuesday and the week starts with Tuesday (shift by two):
  // [1, 2, 3, 4, 5, 6, 7]
  const shiftedFirstDayInMonthWeekDay =
    firstDayInMonthWeekDay -
    weekStartDay +
    (firstDayInMonthWeekDay < weekStartDay ? 7 : 0);

  const daysInFirstWeek = 7 - shiftedFirstDayInMonthWeekDay;

  const firstWeek = [
    ...Array(shiftedFirstDayInMonthWeekDay),
    ...Array(daysInFirstWeek)
      .fill(0)
      .map((_, index) => index + 1),
  ];

  const weeks = [firstWeek];

  const addWeek = (traversedDaysInMonth: number) => {
    const remainingDaysInMonth = lastDayInMonth - traversedDaysInMonth;
    if (remainingDaysInMonth > 7) {
      const week = Array(7)
        .fill(0)
        .map((_, index) => traversedDaysInMonth + index + 1);
      weeks.push(week);
      addWeek(traversedDaysInMonth + 7);
    } else {
      const week = [
        ...Array(remainingDaysInMonth)
          .fill(0)
          .map((_, index) => traversedDaysInMonth + index + 1),
        ...Array(7 - remainingDaysInMonth),
      ];
      weeks.push(week);
    }
  };

  addWeek(daysInFirstWeek);

  return weeks;
};

const isDisabledByEnabledDateRanges = ({
  enabledDateRanges,
  date,
}: {
  date: Date;
  enabledDateRanges: Array<DateRange<Date>>;
}) => {
  for (const { startDate, endDate } of enabledDateRanges) {
    if (startDate <= date && date <= endDate) {
      return false;
    }
  }

  return true;
};

export type DateRange<T> = {
  startDate: T;
  endDate: T;
};

const isDisabledByDisabledDateRanges = ({
  disabledDateRanges,
  date,
}: {
  date: Date;
  disabledDateRanges: Array<DateRange<Date>>;
}) => {
  for (const { startDate, endDate } of disabledDateRanges) {
    if (startDate <= date && date <= endDate) {
      return true;
    }
  }

  return false;
};

const isDisabledByDisabledDates = ({
  disabledDates,
  date,
}: {
  date: Date;
  disabledDates: Array<Date>;
}) => disabledDates.some(disabledDate => areDatesEqual(disabledDate, date));

const isDisabledByDisabledDaysOfWeek = ({
  disabledDaysOfWeek,
  dayOfWeek,
}: {
  dayOfWeek: number;
  disabledDaysOfWeek: Array<number>;
}) => disabledDaysOfWeek.some(disabledDay => disabledDay === dayOfWeek);

export const isDateDisabled = (
  date: Date,
  {
    timeZone,
    dayOfWeek,
    todayDate,
    enabledDateRanges,
    disabledDateRanges,
    disabledDates,
    disabledDaysOfWeek,
    minDate,
    maxDate,
    allowPastDates,
    allowFutureDates,
  }: {
    timeZone?: string | null;
    dayOfWeek?: number | null;
    todayDate?: Date | null;
    enabledDateRanges?: Array<DateRange<Date>> | null;
    disabledDateRanges?: Array<DateRange<Date>> | null;
    disabledDates?: Array<Date> | null;
    disabledDaysOfWeek?: Array<number> | null;
    minDate?: Date | null;
    maxDate?: Date | null;
    allowPastDates?: boolean | null;
    allowFutureDates?: boolean | null;
  },
): boolean => {
  if (
    !assert.isNil(enabledDateRanges) &&
    isDisabledByEnabledDateRanges({ date, enabledDateRanges })
  ) {
    return true;
  }

  if (
    !assert.isNil(disabledDateRanges) &&
    isDisabledByDisabledDateRanges({ date, disabledDateRanges })
  ) {
    return true;
  }

  if (
    !assert.isNil(disabledDates) &&
    isDisabledByDisabledDates({ date, disabledDates })
  ) {
    return true;
  }

  if (!assert.isNil(minDate) && date < new Date(minDate)) {
    return true;
  }

  if (!assert.isNil(maxDate) && date > new Date(maxDate)) {
    return true;
  }

  if (!assert.isNil(allowPastDates) || !assert.isNil(allowFutureDates)) {
    todayDate = !assert.isNil(todayDate)
      ? todayDate
      : timeZone
      ? new Date(new Date(Date.now()).toLocaleDateString('en-US', { timeZone }))
      : new Date(Date.now());
    todayDate = getStartOfDay(todayDate);

    if (!assert.isNil(allowPastDates) && !allowPastDates && date < todayDate) {
      return true;
    }

    if (
      !assert.isNil(allowFutureDates) &&
      !allowFutureDates &&
      date > todayDate
    ) {
      return true;
    }
  }

  if (disabledDaysOfWeek) {
    dayOfWeek = !assert.isNil(dayOfWeek) ? dayOfWeek : date.getDay();
    if (isDisabledByDisabledDaysOfWeek({ dayOfWeek, disabledDaysOfWeek })) {
      return true;
    }
  }

  return false;
};

export const convertDateRangesArray = <T, U>(
  dateRanges: Array<DateRange<T>>,
  converter: (date: T) => U,
): Array<DateRange<U>> =>
  dateRanges.map(({ startDate, endDate }) => ({
    startDate: converter(startDate),
    endDate: converter(endDate),
  }));

export const convertDateStringToDate = (dateStr: string) =>
  getStartOfDay(new Date(dateStr));
