import { describe, it, expect } from "vitest";
import {
  generateGridPuzzle,
  generateCandidateGrids,
  generateGridPuzzleFromSeed,
} from "./grid";
import { allRules } from "./rules";

describe("generateGridPuzzle", () => {
  it("should generate a 3x3 puzzle grid", () => {
    const grid = generateGridPuzzle();
    expect(grid).toBeDefined();
    expect(grid.ruleColumns.length).toBe(3);
    expect(grid.ruleRows.length).toBe(3);
  });
});

describe.skip("generateCandidateGrids", () => {
  it("should print out the number of grids generated", () => {
    const grids = Array.from(generateCandidateGrids(allRules));
    console.log(`Total number of valid grids: ${grids.length}`);
    expect(grids.length).toBeGreaterThan(0);
  });
});

describe("generateGridPuzzleFromSeed", () => {
  it("should generate the same grid for the same seed", () => {
    const seed = "consistent-seed";
    const grid1 = generateGridPuzzleFromSeed(seed);
    const grid2 = generateGridPuzzleFromSeed(seed);
    expect(grid1).toEqual(grid2);
  });

  it("should generate different grids for different seeds", () => {
    const seed1 = "seed-one";
    const seed2 = "seed-two";
    const grid1 = generateGridPuzzleFromSeed(seed1);
    const grid2 = generateGridPuzzleFromSeed(seed2);
    expect(grid1).not.toEqual(grid2);
  });
});
