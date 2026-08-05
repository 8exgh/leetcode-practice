import { romanToInt} from "./exercise";
import {twoSum} from "../easy-two-sum-typescript/exercise";

describe("exercise", () => {

  test.each([
    ["I", 1],
    ["II", 2],
    ["III", 3],
    ["IV", 4],
    ["V", 5],
    ["VI", 6],
    ["VIII", 8],
    ["IX", 9],
    ["X", 10],
    ["XI", 11],
    ["XIV", 14],
    ["XV", 15],
    ["XIX", 19],
    ["XX", 20],
    ["XXIV", 24],
    ["XXIX", 29],
    ["XL", 40],
    ["XLIV", 44],
    ["XLIX", 49],
    ["L", 50],
    ["LVIII", 58],
    ["XC", 90],
    ["XCIX", 99],
    ["C", 100],
    ["CD", 400],
    ["D", 500],
    ["CM", 900],
    ["M", 1000],
    ["MCM", 1900],
    ["MCMXCIV", 1994],
    ["MMXXVI", 2026],
    ["MMCDXXI", 2421],
    ["MMCMXCIX", 2999],
    ["MMMCMXCIX", 3999],
  ])("converts %s to %i",  (roman: string, expected: number) => {
    const actual = romanToInt(roman);
    expect(actual).toEqual(expected);
  });
});
