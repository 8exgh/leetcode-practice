/**
 * 14. Longest Common Prefix
 * Difficulty: Easy
 * https://leetcode.com/problems/longest-common-prefix/
 *
 * Write a function to find the longest common prefix string amongst an array of strings.
 *
 * If there is no common prefix, return an empty string "".
 *
 * Example 1:
 *
 * Input: strs = ["flower","flow","flight"]
 * Output: "fl"
 *
 * Example 2:
 *
 * Input: strs = ["dog","racecar","car"]
 * Output: ""
 * Explanation: There is no common prefix among the input strings.
 *
 * Constraints:
 *
 * 	- 1 <= strs.length <= 200
 *
 * 	- 0 <= strs[i].length <= 200
 *
 * 	- strs[i] consists of only lowercase English letters if it is non-empty.
 *
 * Starter signature from LeetCode:
 *
 * function longestCommonPrefix(strs: string[]): string {
 *     
 * };
 */

/**
 * System under test — implement your solution here.
 *
 * Rename `solve` (and adjust its signature) to match the LeetCode problem,
 * then update the import in exercise.test.ts accordingly.
 */
export function longestCommonPrefix(strs: string[]): string {
  let commonPrefix = "";
  let hasCommon = true;
  let i = 0;
  let currentChar = "";
  do {
    currentChar = strs[0][i] || "-1";
    for(let j = 0;j < strs.length; j++) {
      if(strs[j][i] != currentChar) {
        hasCommon = false;
      }
    }
    if(hasCommon) {
      commonPrefix += currentChar;
    }
    i++;
  } while(hasCommon);
  return commonPrefix;
}