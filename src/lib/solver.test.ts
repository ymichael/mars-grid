import { describe, it, expect } from "vitest";
import { permuteUnique, getSolutionWithSeed } from "./solver";
import { generateGridPuzzleFromSeed } from "./grid";

describe("permuteUnique", () => {
  it("should generate all permutations of the given arrays", () => {
    const input = [
      [1, 2],
      [3, 4, 5],
      [6, 7],
    ];
    const expectedPermutations = [
      [1, 3, 6],
      [1, 4, 6],
      [1, 5, 6],
      [1, 3, 7],
      [1, 4, 7],
      [1, 5, 7],
      [2, 3, 6],
      [2, 4, 6],
      [2, 5, 6],
      [2, 3, 7],
      [2, 4, 7],
      [2, 5, 7],
    ];
    const result = Array.from(permuteUnique(input));
    expect(result).toEqual(expectedPermutations);
  });

  it("should skip non unique options", () => {
    const input = [
      [1, 2],
      [3, 4, 5, 2, 1],
      [1, 2],
    ];
    const expectedPermutations = [
      [1, 3, 2],
      [1, 4, 2],
      [1, 5, 2],
      [2, 3, 1],
      [2, 4, 1],
      [2, 5, 1],
    ];
    const result = Array.from(permuteUnique(input));
    expect(result).toEqual(expectedPermutations);
  });
});

describe("getSolutionWithSeed", () => {
  it("should generate a valid solution for a given grid and seed", () => {
    const seed = "test-seed";
    const grid = generateGridPuzzleFromSeed(seed);
    const solution = getSolutionWithSeed(grid, seed);
    expect(solution).toHaveLength(9);

    // Check that every cell matches both row and col rules
    expect(grid.ruleRows[0].matches(solution[0])).toBe(true);
    expect(grid.ruleColumns[0].matches(solution[0])).toBe(true);
    expect(grid.ruleRows[0].matches(solution[1])).toBe(true);
    expect(grid.ruleColumns[1].matches(solution[1])).toBe(true);
    expect(grid.ruleRows[0].matches(solution[2])).toBe(true);
    expect(grid.ruleColumns[2].matches(solution[2])).toBe(true);

    expect(grid.ruleRows[1].matches(solution[3])).toBe(true);
    expect(grid.ruleColumns[0].matches(solution[3])).toBe(true);
    expect(grid.ruleRows[1].matches(solution[4])).toBe(true);
    expect(grid.ruleColumns[1].matches(solution[4])).toBe(true);
    expect(grid.ruleRows[1].matches(solution[5])).toBe(true);
    expect(grid.ruleColumns[2].matches(solution[5])).toBe(true);

    expect(grid.ruleRows[2].matches(solution[6])).toBe(true);
    expect(grid.ruleColumns[0].matches(solution[6])).toBe(true);
    expect(grid.ruleRows[2].matches(solution[7])).toBe(true);
    expect(grid.ruleColumns[1].matches(solution[7])).toBe(true);
    expect(grid.ruleRows[2].matches(solution[8])).toBe(true);
    expect(grid.ruleColumns[2].matches(solution[8])).toBe(true);
  });
});
