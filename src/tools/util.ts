 /**
  * Copyright (c) 2019 Jonathan Andersen
  * Copyright (c) 2019 William R. Sullivan
  *
  * This software is proprietary and owned by Jonathan Andersen.
  *
  * This software was based on https://github.com/wrsulliv/ReactNativeStarter,
  * licensed under the MIT license.
  */

 export const stripTimeFromDate = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const dayOfWeekToEnglish: any = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

export const renderLocalDate = (date: Date, simplifyWeek?: boolean) => {
  if (simplifyWeek) {

    const currentDate = new Date();
    const today = stripTimeFromDate(currentDate);
    const yesterday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1);
    const day3 = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 2);
    const day4 = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 3);
    const day5 = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 4);
    const day6 = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 5);
    const day7 = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 6);

    const weekDates = {
      [today.toISOString()]: 'Today',
      [yesterday.toISOString()]: 'Yesterday',
      [day3.toISOString()]: dayOfWeekToEnglish[new Date(day3).getDay()],
      [day4.toISOString()]: dayOfWeekToEnglish[new Date(day4).getDay()],
      [day5.toISOString()]: dayOfWeekToEnglish[new Date(day5).getDay()],
      [day6.toISOString()]: dayOfWeekToEnglish[new Date(day6).getDay()],
      [day7.toISOString()]: dayOfWeekToEnglish[new Date(day7).getDay()],
    };

    const weekDate = weekDates[stripTimeFromDate(date).toISOString()];
    if (weekDate !== undefined) {
      return weekDate;
    }
  }
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

export const renderLocalTime = (date: Date) => {
  return date.toLocaleString('en-US', { hour: 'numeric',  minute: 'numeric', hour12: true });
};

//  Displays as 2 digits.
export const render2Digits = (num: number) => {
  if (num >= 100) { throw new Error('A number greater than 100 cannot be rendered using 2 digits.'); }
  if (num < 0) { throw new Error('2 digit rendering is not supported for negative numbers.'); }
  if (num < 10) {
    return `0${num}`;
  } else {
    return num;
  }
};

export const capitalizeAllWords = (text: string): string => {
  const words = text.split(' ');
  const capitalizedWords = words.map((word: string) => capitalizeFirstWord(word));
  const reconstructedText = capitalizedWords.join(' ');
  return reconstructedText;
};

export const capitalizeFirstWord = (text: string): string => {
  //  REFERENCE:  https://paulund.co.uk/how-to-capitalize-the-first-letter-of-a-string-in-javascript
  return text.charAt(0).toUpperCase().concat(text.slice(1));
};

export const getWeekStartDate = (selectedDate: Date) => {
  const day = selectedDate.getDay();
  const startDate = new Date(selectedDate);
  startDate.setDate(selectedDate.getDate() - day);
  return startDate;
};

export const getDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${render2Digits(month)}-${render2Digits(day)}`;
};
