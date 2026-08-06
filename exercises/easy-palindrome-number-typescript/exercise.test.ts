import { isPalindrome } from "./exercise";

describe("exercise", () => {
  describe("isPalindrome", () => {
    test.each([
      [0, true],
      [1, true],
      [5, true],
      [9, true],
      [11, true],
      [22, true],
      [99, true],
      [101, true],
      [111, true],
      [121, true],
      [202, true],
      [424, true],
      [1001, true],
      [1221, true],
      [12321, true],
      [123321, true],
      [1000001, true],
      [1234321, true],
      [2147447412, true],
      [10, false],
      [12, false],
      [100, false],
      [123, false],
      [120, false],
      [1000, false],
      [1231, false],
      [12341, false],
      [123456, false],
      [2147483647, false],
      [-1, false],
      [-11, false],
      [-121, false],
      [-424, false],
    ])("%s is a palnidrome is %s", (input, expected) => {
      const actual = isPalindrome(input);

      expect(actual).toBe(expected);
    });
  });

});
