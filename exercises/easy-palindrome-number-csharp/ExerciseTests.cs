using FluentAssertions;
using Xunit;

namespace LeetCode.Exercise;

public class ExerciseTests
{
    [Theory]
    [InlineData(0, true)]
    [InlineData(1, true)]
    [InlineData(5, true)]
    [InlineData(9, true)]
    [InlineData(10, false)]
    [InlineData(11, true)]
    [InlineData(12, false)]
    [InlineData(22, true)]
    [InlineData(99, true)]
    [InlineData(100, false)]
    [InlineData(101, true)]
    [InlineData(110, false)]
    [InlineData(111, true)]
    [InlineData(121, true)]
    [InlineData(123, false)]
    [InlineData(131, true)]
    [InlineData(202, true)]
    [InlineData(424, true)]
    [InlineData(999, true)]
    [InlineData(1000, false)]
    [InlineData(1001, true)]
    [InlineData(1111, true)]
    [InlineData(1221, true)]
    [InlineData(1231, false)]
    [InlineData(2002, true)]
    [InlineData(10001, true)]
    [InlineData(12321, true)]
    [InlineData(12345, false)]
    [InlineData(123321, true)]
    [InlineData(123421, false)]
    [InlineData(1000001, true)]
    [InlineData(1234321, true)]
    [InlineData(10000001, true)]
    [InlineData(12344321, true)]
    [InlineData(100000001, true)]
    [InlineData(123454321, true)]
    [InlineData(1000000001, true)]
    [InlineData(2000000002, true)]
    [InlineData(2147447412, true)]
    [InlineData(2147483647, false)]
    [InlineData(-1, false)]
    [InlineData(-9, false)]
    [InlineData(-11, false)]
    [InlineData(-121, false)]
    [InlineData(-131, false)]
    [InlineData(-1001, false)]
    public void IsPalindromeShouldMatchExpected(int input, bool expected)
    {
        var solution = new Solution();

        var result = solution.IsPalindrome(input);

        result.Should().Be(expected);
    }
}
