using FluentAssertions;
using Xunit;

namespace LeetCode.Exercise;

public class ExerciseTests
{
    [Theory]
    [InlineData(new[] { "preemptive", "preliminary", "premadona", "precise", "pretend" }, "pre")]
    [InlineData(new[] { "flower", "flow", "flight" }, "fl")]
    [InlineData(new[] { "dog", "racecar", "car" }, "")]
    [InlineData(new[] { "interspecies", "interstellar", "interstate" }, "inters")]
    [InlineData(new[] { "throne", "throne" }, "throne")]
    [InlineData(new[] { "throne", "dungeon" }, "")]
    [InlineData(new[] { "prefix" }, "prefix")]
    [InlineData(new[] { "" }, "")]
    [InlineData(new[] { "", "abc" }, "")]
    [InlineData(new[] { "abc", "" }, "")]
    [InlineData(new[] { "a", "a", "a" }, "a")]
    [InlineData(new[] { "a", "ab", "abc" }, "a")]
    [InlineData(new[] { "abc", "ab", "a" }, "a")]
    [InlineData(new[] { "abc", "abc", "abc" }, "abc")]
    [InlineData(new[] { "abc", "abd", "abe" }, "ab")]
    [InlineData(new[] { "abc", "xbc", "ybc" }, "")]
    [InlineData(new[] { "apple", "application", "apply" }, "appl")]
    [InlineData(new[] { "car", "carbon", "card" }, "car")]
    [InlineData(new[] { "test", "testing", "tester" }, "test")]
    [InlineData(new[] { "test", "toast", "team" }, "t")]
    [InlineData(new[] { "hello", "hell", "helium" }, "hel")]
    [InlineData(new[] { "same", "same", "sam" }, "sam")]
    [InlineData(new[] { "longest", "longer", "long" }, "long")]
    [InlineData(new[] { "short", "shore", "show" }, "sho")]
    [InlineData(new[] { "prefix", "pre", "prevent" }, "pre")]
    [InlineData(new[] { "aa", "ab" }, "a")]
    [InlineData(new[] { "ab", "ac", "ad", "ae" }, "a")]
    [InlineData(new[] { "x", "y", "z" }, "")]
    [InlineData(new[] { "cat", "catalog", "catch" }, "cat")]
    [InlineData(new[] { "do", "dog", "done" }, "do")]
    [InlineData(new[] { "sun", "sunday", "sunrise" }, "sun")]
    [InlineData(new[] { "moon", "moose", "mood" }, "moo")]
    [InlineData(new[] { "alpha", "alphabet", "alphanumeric" }, "alpha")]
    [InlineData(new[] { "binary", "bind", "bingo" }, "bin")]
    [InlineData(new[] { "code", "coder", "coding" }, "cod")]
    [InlineData(new[] { "javascript", "java", "javadoc" }, "java")]
    [InlineData(new[] { "typescript", "type", "typing" }, "typ")]
    [InlineData(new[] { "dotnet", "docker", "document" }, "do")]
    [InlineData(new[] { "microservice", "Microsoft", "microscope" }, "micros")]
    [InlineData(new[] { "abcdef", "abcxyz", "abc123" }, "abc")]
    [InlineData(new[] { "12345", "12399", "123" }, "123")]
    [InlineData(new[] { "!!!abc", "!!!xyz", "!!!" }, "!!!")]
    public void LongestCommonPrefixShouldMatchExpected(
        string[] input,
        string expected)
    {
        var sut = new Solution();

        var actual = sut.LongestCommonPrefix(input);

        actual.Should().Be(expected);
    }
}
