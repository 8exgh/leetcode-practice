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
 * public class Solution {
 *     public string LongestCommonPrefix(string[] strs) {
 *         
 *     }
 * }
 */

namespace LeetCode.Exercise;

/// <summary>
/// System under test — implement your solution here.
/// Rename <c>Solve</c> (and adjust its signature) to match the LeetCode problem,
/// then update the calls in ExerciseTests.cs accordingly.
/// </summary>
public class Solution {
     public string LongestCommonPrefix(string[] strs)
     {
         if (strs.Length == 0 || strs[0].Length == 0)
         {
             return "";
         }
         
         var commonPrefix = "";
         char currentChar;
         var i = 0;
         var hasCommonChar = true;
         do
         {
             currentChar = strs[0][i];
             for (var j = 0; j < strs.Length; j++)
             {
                 if (i >= strs[j].Length || char.ToUpper(currentChar) != char.ToUpper(strs[j][i]))
                 {
                     hasCommonChar = false;
                     break;
                 }
             }
             i++;
             if (hasCommonChar)
             {
                 commonPrefix += currentChar;
             }
         } while (hasCommonChar && i < strs[0].Length);
         
         return commonPrefix;
     }
}