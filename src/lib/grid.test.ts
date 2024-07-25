import { describe, it, expect } from "vitest";
import {
  generateGridPuzzle,
  generateCandidateGrids,
  generateGridPuzzleFromSeed,
  getGridId,
  fromGridId,
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

describe("getGridId and fromGridId", () => {
  it("should generate a valid grid ID", () => {
    const grid = generateGridPuzzle();
    const gridId = getGridId(grid);
    expect(gridId).toMatch(/^v1-[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+$/);
  });

  it("should reconstruct the same grid from its ID", () => {
    const originalGrid = generateGridPuzzle();
    const gridId = getGridId(originalGrid);
    const reconstructedGrid = fromGridId(gridId);
    expect(reconstructedGrid).toEqual(originalGrid);
  });

  it("should throw an error for an invalid grid ID", () => {
    expect(() => fromGridId("invalid-grid-id")).toThrow(
      "Unsupported gridId version",
    );
    expect(() => fromGridId("v1-rule1,rule2,rule3,rule4,rule5")).toThrow(
      "Invalid serialized grid format",
    );
  });

  it("should throw an error for a grid ID with unknown rules", () => {
    expect(() =>
      fromGridId("v1-unknown1,unknown2,unknown3,unknown4,unknown5,unknown6"),
    ).toThrow(/not found/i);
  });

  it("should throw an error for a grid ID with duplicate rules", () => {
    const grid = generateGridPuzzle();
    const gridId = getGridId(grid);
    const duplicateRuleId = gridId.replace(
      /^v1-([^,]+).*$/,
      "v1-$1,$1,$1,$1,$1,$1",
    );
    expect(() => fromGridId(duplicateRuleId)).toThrow(
      "Invalid grid: contains duplicate rules",
    );
  });
});
