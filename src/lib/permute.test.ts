import { describe, it, expect } from "vitest";
import { permuteArr, permuteBinsUnique } from "./permute";

describe("permuteArr", () => {
  it("should generate all permutations of the given arrays", () => {
    const input = [1, 2, 3];
    const result = Array.from(permuteArr(input, 2));
    expect(result).toEqual([
      [1, 2],
      [1, 3],
      [2, 1],
      [2, 3],
      [3, 1],
      [3, 2],
    ]);
  });
});

describe("permuteBinsUnique", () => {
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
    const result = Array.from(permuteBinsUnique(input));
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
    const result = Array.from(permuteBinsUnique(input));
    expect(result).toEqual(expectedPermutations);
  });
});
