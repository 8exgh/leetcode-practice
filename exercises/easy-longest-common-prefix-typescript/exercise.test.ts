import { longestCommonPrefix } from "./exercise";

describe("exercise", () => {
  test.each([
    [["prefix", "prevent", "preemptive", "preexisting"], "pre"],
    [["flower", "flow", "flight"], "fl"],
    [["dog", "racecar", "car"], ""],
    [["interspecies", "interstellar", "interstate"], "inters"],
    [["throne", "throne"], "throne"],
    [["throne", "dungeon"], ""],
    [["cheese"], "cheese"],
    [["a"], "a"],
    [["a", "a", "a"], "a"],
    [["a", "ab", "abc"], "a"],
    [["abc", "ab", "a"], "a"],
    [["abc", "abc", "abc"], "abc"],
    [["abc", "abd", "abe"], "ab"],
    [["abc", "xbc", "ybc"], ""],
    [["apple", "application", "apply"], "appl"],
    [["car", "carbon", "card"], "car"],
    [["test", "testing", "tester"], "test"],
    [["hello", "hell", "helmet"], "hel"],
    [["javascript", "java", "javelin"], "jav"],
    [["typescript", "type", "typing"], "typ"],
    [["computer", "compact", "company"], "comp"],
    [["replay", "replace", "reply"], "repl"],
    [["prefix", "pre"], "pre"],
    [["pre", "prefix"], "pre"],
    [["same", "same", "same"], "same"],
    [["same", "sam", "sample"], "sam"],
    [["foo", "foobar", "foobaz"], "foo"],
    [["foo", "fo", "f"], "f"],
    [["abc", "abcd", "abcde"], "abc"],
    [["abcd", "abc", "ab"], "ab"],
    [["", "abc", "abcd"], ""],
    [["abc", "", "abcd"], ""],
    [["", ""], ""],
    [["x", "y"], ""],
    [["zebra", "zen", "zero"], "ze"],
    [["mountain", "mouse", "mouth"], "mou"],
    [["international", "internet", "internal"], "intern"],
    [["transport", "translate", "transmit"], "trans"],
    [["configuration", "conflict", "conference"], "conf"],
    [["database", "data", "datum"], "dat"],
  ])(
      "longestCommonPrefix(%p) returns %s",
      (input, expected) => {
        const actual = longestCommonPrefix(input);

        expect(actual).toBe(expected);
      }
  );
});
