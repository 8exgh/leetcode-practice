/**
 * 9. Palindrome Number
 * Difficulty: Easy
 * https://leetcode.com/problems/palindrome-number/
 *
 * Given an integer x, return true if x is a palindrome, and false otherwise.
 *
 * Example 1:
 *
 * Input: x = 121
 * Output: true
 * Explanation: 121 reads as 121 from left to right and from right to left.
 *
 * Example 2:
 *
 * Input: x = -121
 * Output: false
 * Explanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore
 * it is not a palindrome.
 *
 * Example 3:
 *
 * Input: x = 10
 * Output: false
 * Explanation: Reads 01 from right to left. Therefore it is not a palindrome.
 *
 * Constraints:
 *
 * 	- -2^31 <= x <= 2^31 - 1
 *
 * Follow up: Could you solve it without converting the integer to a string?
 *
 * Starter signature from LeetCode:
 *
 * public class Solution {
 *     public bool IsPalindrome(int x) {
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
    public bool IsPalindrome(int x)
    {
        var xAsString = x.ToString();
        for (var i = 0; i < xAsString.Length / 2; i++)
        {
            if (xAsString[i] != xAsString[xAsString.Length - i - 1])
            {
                return false;
            }
        }

        return true;
    }
}
