import {
    addADayToDate
} from '..';
export class DatePickerDate {
    /**
     * Create DatePickerDate
     * @description
     * Calculates the year, month and day and store it internly
     * @param {DatePickerDateConstructorParam} date -
     * - date.type = 'Specific': Give specificly the year, month and day
     * - date.type = 'Date' : Give a date object and a timezone by which to
     * read the year, month and day.
     * - date.type = 'Now' : get the local or timezone current year, month and day.
     */
    constructor(date) {
        switch (date.type) {
            case 'Specific':
                this.year = date.year;
                this.month = date.month;
                this.day = date.day;
                break;
            case 'Date':
                const dateInTimeZone = date.timeZone === 'Local' ?
                    date.date :
                    new Date(new TimeZone(date.timeZone).retrieveDateString(date.date));
                this.year = dateInTimeZone.getFullYear();
                this.month = dateInTimeZone.getMonth() + 1;
                this.day = dateInTimeZone.getDate();
                break;
            case 'Now':
            default:
                let nowDate;
                if (date.timeZone !== 'Local') {
                    nowDate = new Date(new TimeZone(date.timeZone).retrieveDateString(new Date(Date.now())));
                } else {
                    nowDate = new Date(Date.now());
                }
                this.year = nowDate.getFullYear();
                this.month = nowDate.getMonth() + 1;
                this.day = nowDate.getDate();
        }
    }
    getYear() {
        return this.year;
    }
    getMonth() {
        return this.month;
    }
    getDay() {
        return this.day;
    }
    /**
     * @function getAsDate
     * @description
     * Returns a date object at the year, month and day calculated in the
     * constructor at start of day in the given time zone.
     * @returns {Date}
     */
    getAsDate(timeZone) {
        return new Date(timeZone === 'Local' ?
            `${this.year}/${this.month}/${this.day} 00:00:00` :
            new TimeZone(timeZone).format({
                year: this.year,
                month: this.month,
                day: this.day,
            }));
    }
    eq(other) {
        return this.equality(other) === 0;
    }
    gt(other) {
        return this.equality(other) > 0;
    }
    lt(other) {
        return this.equality(other) < 0;
    }
    equality(other) {
        if (this.year - other.year !== 0) {
            return this.year - other.year;
        } else if (this.month - other.month !== 0) {
            return this.month - other.month;
        } else {
            return this.day - other.day;
        }
    }
}
export class TimeZone {
    constructor(timeZone) {
        if (TimeZone.isTimeZoneValid(timeZone)) {
            this.timeZone = timeZone;
        } else {
            throw new TimeZoneError();
        }
    }
    static isTimeZoneValid(timeZone) {
        try {
            new Intl.DateTimeFormat('en-US', {
                timeZone,
            });
            return true;
        } catch (err) {
            return false;
        }
    }
    /**
     * @function format
     * @description
     * Returns a string representing the date at the year, month and day given
     * at start of day in the time zone specified in the constructor
     * @returns {String}
     */
    format({
        year,
        month,
        day,
        time,
    }) {
        const timeString = time ? time : '00:00:00';
        return `${year}/${month}/${day} ${time ? time : '00:00:00'} ${this.calculateGMT({
            year,
            month,
            day,
            time: timeString,
        })}`;
    }
    /**
     * @function retrieveDateString
     * @description
     * Returns a string representing only the year, month and day of the given date at the
     * time zone specified in the constructor
     * @returns {String}
     */
    retrieveDateString(date) {
        return new Intl.DateTimeFormat('en-US', {
            timeZone: this.timeZone,
        }).format(date);
    }
    /**
     * @function parseGMT
     * @description
     * Extracting the GMT string from the given date according to
     * the time zone specified in the constructor, i.e, if the given
     * date is 8/15/2020 00:00:00 GMT+3 and the timzeone is Asia/Jerusalem
     * GMT+3 will be returned, but if the timzeone is Pacific/Auckland
     * GMT+12 will be returned
     * @returns {String}
     */
    parseGMT(date) {
        const verboseFormat = (dateParam, timeZone) => new Intl.DateTimeFormat('en-US', {
            timeZone,
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        }).format(dateParam);
        const dateInUTC = new Date(`${verboseFormat(date, 'UTC')} UTC`);
        const dateInTimeZone = new Date(`${verboseFormat(date, this.timeZone)} UTC`);
        const gmtOffset = (dateInTimeZone.getTime() - dateInUTC.getTime()) / 3600000;
        const gmtOffsetString = Math.floor(gmtOffset) !== gmtOffset ?
            `${Math.floor(gmtOffset)}:${(gmtOffset - Math.floor(gmtOffset)) * 60}` :
            `${gmtOffset}`;
        return `GMT${gmtOffset < 0 ? `${gmtOffsetString}` : `+${gmtOffsetString}`}`;
    }
    /**
     * @function getDayAtTimeDate
     * @description
     * Returning a date which is at the time of day specified at the
     * time zone specified in the constructor, i.e, if the given
     * date is 8/15/2020 16:00:00 GMT+3 and the timzeone is Asia/Jerusalem,
     * the return date will be 8/15/2020 00:00:00 GMT+3 if the time given is
     * 00:00:00
     * @returns {Date}
     */
    getDayAtTimeDate(date, time) {
        return new Date(`${this.retrieveDateString(date)} ${time} ${this.parseGMT(date)}`);
    }
    /**
     * @function calculateGMT
     * @description
     * Returning the GMT string that if used in a string representation of a date
     * with the year, month and day given, it will yield a string that represent the
     * date at the year, month and day given at the time zone specified in the
     * constructor, i.e, if given year=2020, month=10 and day=15, and the timzeone is
     * Asia/Jerusalem, the returned string will be GMT+3 since the date
     * "new Date('2020/10/15 GMT+3')" represents 10/15/2020 in Asia/Jerusalem
     * @returns {String}
     */
    calculateGMT({
        year,
        month,
        day,
        time,
    }) {
        /**
         * Were trying to find the date which is at the year, month and day
         * given at the the time zone specified in the constructor, so we can know
         * which GMT was active at that date. For that, were starting to iterate 2 days
         * before the given date at local time(were also resetting it to the start of day at
         * the time zone) and with each iteration(max 4 if we don't find)
         * we add one day and ask if the current date is the date at year, month and day
         * given at the the time zone specified in the constructor, if so, we can use
         * this date to calcualte the GMT
         */
        let date = new Date(`${year}/${month}/${day}`);
        date.setDate(date.getDate() - 2);
        date = this.getDayAtTimeDate(date, time);
        for (let idx = 0; idx < 4 && this.retrieveDateString(date) !== `${month}/${day}/${year}`; idx++) {
            date = addADayToDate(date);
        }
        const parsedGMT = this.parseGMT(date);
        if (parsedGMT) {
            return parsedGMT;
        } else {
            return '';
        }
    }
    toString() {
        return this.timeZone;
    }
}
export const isValidDate = (val) => {
    return val instanceof Date && !isNaN(val.getTime());
};
export class TimeZoneError extends Error {
    constructor(msg) {
        super(`Bad time zone${msg ? `: ${msg}` : ''}`);
    }
}
//# sourceMappingURL=DatePickerDate.js.map