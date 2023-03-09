"use strict";
/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/ReactNativeStarter,
 * licensed under the MIT license.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripTimeFromDate = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};
exports.dayOfWeekToEnglish = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
};
exports.renderLocalDate = (date, simplifyWeek) => {
    if (simplifyWeek) {
        const currentDate = new Date();
        const today = exports.stripTimeFromDate(currentDate);
        const yesterday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1);
        const day3 = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 2);
        const day4 = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 3);
        const day5 = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 4);
        const day6 = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 5);
        const day7 = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 6);
        const weekDates = {
            [today.toISOString()]: 'Today',
            [yesterday.toISOString()]: 'Yesterday',
            [day3.toISOString()]: exports.dayOfWeekToEnglish[new Date(day3).getDay()],
            [day4.toISOString()]: exports.dayOfWeekToEnglish[new Date(day4).getDay()],
            [day5.toISOString()]: exports.dayOfWeekToEnglish[new Date(day5).getDay()],
            [day6.toISOString()]: exports.dayOfWeekToEnglish[new Date(day6).getDay()],
            [day7.toISOString()]: exports.dayOfWeekToEnglish[new Date(day7).getDay()],
        };
        const weekDate = weekDates[exports.stripTimeFromDate(date).toISOString()];
        if (weekDate !== undefined) {
            return weekDate;
        }
    }
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};
exports.renderLocalTime = (date) => {
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
};
//  Displays as 2 digits.
exports.render2Digits = (num) => {
    if (num >= 100) {
        throw new Error('A number greater than 100 cannot be rendered using 2 digits.');
    }
    if (num < 0) {
        throw new Error('2 digit rendering is not supported for negative numbers.');
    }
    if (num < 10) {
        return `0${num}`;
    }
    else {
        return num;
    }
};
exports.capitalizeAllWords = (text) => {
    const words = text.split(' ');
    const capitalizedWords = words.map((word) => exports.capitalizeFirstWord(word));
    const reconstructedText = capitalizedWords.join(' ');
    return reconstructedText;
};
exports.capitalizeFirstWord = (text) => {
    //  REFERENCE:  https://paulund.co.uk/how-to-capitalize-the-first-letter-of-a-string-in-javascript
    return text.charAt(0).toUpperCase().concat(text.slice(1));
};
exports.getWeekStartDate = (selectedDate) => {
    const day = selectedDate.getDay();
    const startDate = new Date(selectedDate);
    startDate.setDate(selectedDate.getDate() - day);
    return startDate;
};
exports.getDateString = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${exports.render2Digits(month)}-${exports.render2Digits(day)}`;
};
//# sourceMappingURL=util.js.map