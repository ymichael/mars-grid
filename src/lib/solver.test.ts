import { describe, it, expect } from "vitest";
import {
  permuteUnique,
  getSolutionWithSeed,
  getRandomSolution,
  isSolution,
} from "./solver";
import { addDays, format } from "date-fns";
import { generateGridPuzzleFromSeed, getGridId } from "./grid";

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
    expect(isSolution(grid, solution)).toBe(true);
  });

  it("should be fast (even for small min matches)", () => {
    const grid = generateGridPuzzleFromSeed("fixed-seed-for-test", {
      minMatches: 1,
    });
    const solution1 = getRandomSolution(grid);
    expect(solution1).toHaveLength(9);
    const solution2 = getRandomSolution(grid);
    expect(solution2).toHaveLength(9);
  });
});

describe("isSolution", () => {
  it("should return false for a invalid solutions", () => {
    const grid = generateGridPuzzleFromSeed("test-seed");
    const solution = [null, null];
    expect(isSolution(grid, solution)).toBe(false);
  });
});

describe.skip("Daily puzzle generation and solving", () => {
  it("should generate and solve daily puzzles for the next 3 months within a reasonable time", () => {
    const startDate = new Date();
    const endDate = addDays(startDate, 150); // 150 days
    let currentDate = startDate;
    while (currentDate <= endDate) {
      const seed = format(currentDate, "yyyy-MM-dd");
      const grid = generateGridPuzzleFromSeed(seed);
      const gridId = getGridId(grid);
      const startTime = performance.now();
      const solution = getSolutionWithSeed(grid, seed);
      const endTime = performance.now();
      const timeTaken = endTime - startTime;
      expect(solution).toHaveLength(9);
      expect(timeTaken).toBeLessThan(1000); // Assuming 1 second is a reasonable upper limit
      console.log(
        `Date: ${seed}, Grid ID: ${gridId}, Time taken: ${timeTaken.toFixed(2)}ms`,
      );
      currentDate = addDays(currentDate, 1);
    }
  });
});
