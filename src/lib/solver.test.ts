import { describe, it, expect } from "vitest";
import { generateGridPuzzleFromSeed, getGridId } from "./grid";
import { getSolutionWithSeed, isSolution } from "./solver";
import storedGrids from "../grids.json";
const storedGridsBySeed = storedGrids as Record<string, string>;

describe.skip("performance", () => {
  const calculateStats = (times: number[]) => {
    const avg = times.reduce((sum, time) => sum + time, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);
    const variance =
      times.reduce((sum, time) => sum + Math.pow(time - avg, 2), 0) /
      times.length;
    const stddev = Math.sqrt(variance);
    return { avg, min, max, stddev };
  };

  for (const version of ["v1", "v2"] as const) {
    it(`generate a valid solution for a given grid and seed (${version})`, () => {
      const seed = "test-seed";
      const startTime = Date.now();
      const grid = generateGridPuzzleFromSeed(seed, { version });
      console.log(
        `[${version}] Time to generate grid: ${Date.now() - startTime}ms`,
      );
      const startTime2 = Date.now();
      const solution = getSolutionWithSeed(grid, seed);
      console.log(
        `[${version}] Time to generate solution: ${Date.now() - startTime2}ms`,
      );
      console.log(`gridId=${getGridId(grid)}`);
      expect(solution).toHaveLength(9);
      expect(isSolution(grid, solution)).toBe(true);
    });

    it(`output performance metrics for ${version}`, () => {
      const numPuzzles = 100;
      const times: number[] = [];
      for (let i = 0; i < numPuzzles; i++) {
        const seed = `test-seed-${i}`;
        const startTime = Date.now();
        generateGridPuzzleFromSeed(seed, { version });
        const endTime = Date.now();
        times.push(endTime - startTime);
      }
      const stats = calculateStats(times);
      console.log(`[${version}] Avg: ${stats.avg.toFixed(2)}ms`);
      console.log(`[${version}] Min: ${stats.min}ms`);
      console.log(`[${version}] Max: ${stats.max}ms`);
      console.log(`[${version}] StdDev: ${stats.stddev.toFixed(2)}ms`);
    });
  }
});

describe("isSolution", () => {
  it("should return false for a invalid solutions", () => {
    const grid = generateGridPuzzleFromSeed("test-seed");
    const solution = [null, null];
    expect(isSolution(grid, solution)).toBe(false);
  });
});

describe("Daily puzzles should be solvable", () => {
  it("should generate and solve daily puzzles for all grids in grids.json", () => {
    for (const seed in storedGridsBySeed) {
      const grid = generateGridPuzzleFromSeed(seed);
      const solution = getSolutionWithSeed(grid, seed);
      expect(solution).toHaveLength(9);
    }
  });
});
