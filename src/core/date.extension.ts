import moment from 'moment';

export {};
declare global {
  interface DateConstructor {
    /**
     * Converts a given value to a formatted date string using Moment.js.
     * If the input value is falsy, an empty string is returned.
     *
     * @param v - The value to be converted. It can be a string, number, Date object, or any other valid input for Moment.js.
     * @returns A formatted date string in the format 'DD/MM/YYYY'.
     *
     * @example
     * ```typescript
     * const dateString = dateString('2022-01-01');
     * console.log(dateString); // Output: '01/01/2022'
     * ```
     */
    dateString(v: any): string;
    /**
     * Converts a given value to a formatted date and time string using Moment.js.
     * If the input value is falsy, an empty string is returned.
     *
     * @param v - The value to be converted. It can be a string, number, Date object, or any other valid input for Moment.js.
     * @returns A formatted date and time string in the format 'DD/MM/YYYY HH:mm'.
     *
     * @example
     * ```typescript
     * const dateTimeString = Date.dateTimeString('2022-01-01 12:30:00');
     * console.log(dateTimeString); // Output: '01/01/2022 12:30'
     * ```
     */
    dateTimeString(v: any): string;
    /**
     * Validates if a given string represents a valid date in the format 'YYYY-MM-DD'.
     *
     * @param str - The string to be validated.
     * @returns `true` if the string represents a valid date, `false` otherwise.
     *
     * @example
     * ```typescript
     * const isValidDate = Date.isDate('2022-01-01');
     * console.log(isValidDate); // Output: true
     *
     * const isValidDate2 = Date.isDate('2022-13-01');
     * console.log(isValidDate2); // Output: false
     * ```
     */
    isDate(str: string): boolean;
    today(format: string): string;
  }
  interface Date {
    /**
     * Formats the date object into a string using Moment.js.
     *
     * @param format - An optional string that specifies the desired format of the date string. Defaults to 'YYYY-MM-DD'.
     * @returns A string representation of the date in the specified format or the default format if none is provided.
     */
    format(this: Date, format?: string): string;
  }
}
//#region static methods
Date.dateString = function (v: any): string {
  if (!v) return '';
  return moment(v).format('DD/MM/YYYY');
};
Date.dateTimeString = function (v: any): string {
  if (!v) return '';
  return moment(v).format('DD/MM/YYYY HH:mm');
};
Date.isDate = function (str: string): boolean {
  const dateParts = str.split('-');

  if (dateParts.length !== 3) {
    return false;
  }

  const [year, month, day] = dateParts.map(Number);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return false;
  }

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }

  const dateObject = new Date(year, month - 1, day);

  return (
    dateObject.getFullYear() === year &&
    dateObject.getMonth() === month - 1 &&
    dateObject.getDate() === day
  );
};
Date.today = (format: string = 'yyyy-mm-dd') => new Date().format(format);
//#endregion

//#region prototype methods
Date.prototype.format = function (
  this: Date,
  format: string = 'YYYY-MM-DD',
): string {
  return moment(this).format(format);
};
//#endregion
