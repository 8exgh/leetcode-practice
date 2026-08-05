using FluentAssertions;
using Xunit;

namespace LeetCode.Exercise;

public class ExerciseTests
{
    [Fact]
    public void Solves_the_first_example_from_the_problem_description()
    {
        // Replace with the real example input/output from the LeetCode description.
        var result = Exercise.Solve();

        result.Should().NotBeNull();
    }

    [Fact(Skip = "TODO: handle edge cases")]
    public void Handles_edge_cases()
    {
    }
}
