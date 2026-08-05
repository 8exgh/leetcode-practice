import { twoSum } from "./exercise";

describe("exercise", () => {

  test.each([
      [
          [9, 7, 2,3,4,1], 7, [3,4],
          [1, 3], 4, [0,1],
          [0, 7, 9, 3, -1], -1, [0, 4]
      ]
  ])("indices should match",
      (nums: number[], target: number, expected: number[]) => {
      const actual = twoSum(nums, target);
      expect(expected.sort()).toEqual(actual.sort());
  });

  it.todo("handles edge cases");
});
