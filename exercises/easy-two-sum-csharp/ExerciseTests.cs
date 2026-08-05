using FluentAssertions;
using Xunit;

namespace LeetCode.Exercise;

public class ExerciseTests
{
    [Theory]
    [InlineData(new int[] { 9, 3, 8, 4, 9}, 7, new int[] {1,3})]
    [InlineData(new int[] { 1, 1}, 2, new int[] {0,1})]
    [InlineData(new int[] { 1, 2, 0}, 1, new int[] {0,2})]
    [InlineData(new int[] { 0, 0 }, 0, new int[] {0,1})]
    [InlineData(new int[] { 2, 0, -1 }, -1, new int[] {1,2})]
    [InlineData(new int[] { -1, 0, -1 }, -2, new int[] {0,2})]
    public void Indices_should_match_target_sum(int[] nums, int target, int[] expected)
    {
        var actual = Exercise.TwoSum(nums, target);

        actual.Should().BeEquivalentTo(expected);
    }
}
