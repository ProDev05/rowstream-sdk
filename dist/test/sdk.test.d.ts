/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/SDKLibrary,
 * licensed under the MIT license.
 */
import { GeneralStatus, AdditionalStatus1, AdditionalStatus2, RowingStrokeData } from "../src/tools/pm5-sdk";
export declare const sessionGeneralStatParamsStart: GeneralStatus;
export declare const sessionGeneralStatParamsEnd: GeneralStatus;
export declare const sessionAdditional1StatParamsStart: AdditionalStatus1;
export declare const sessionAdditional1StatParamsEnd: AdditionalStatus1;
export declare const sessionAdditional2StatParamsStart: AdditionalStatus2;
export declare const sessionAdditional2StatParamsEnd: AdditionalStatus2;
export declare const rowingStrokeDataStatParamsStart: RowingStrokeData;
interface TestData {
    [key: string]: number | Date;
}
export declare enum TestDataGenerator {
    Linear = 0,
    RandomBezier = 1
}
export declare const generateTestData: (initial: TestData, final: TestData, count: number, method: TestDataGenerator, multiplier?: number) => TestData[];
export {};
