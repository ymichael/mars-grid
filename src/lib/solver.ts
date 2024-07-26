import { Card, getEligibleCards, getCardById, isValidCardId } from "./allCards";
import { Grid } from "./grid";
import {
  RandomFunction,
  defaultRandom,
  randomFactory,
  shuffleInPlace,
} from "./random";
import { getRuleById } from "./rules";

// Array of Card["id"]
type Solution = string[];

export function getSolutionWithSeed(grid: Grid, seed: string): Solution {
  for (const solution of getSolutions(grid, randomFactory(seed))) {
    return solution;
  }
  throw new Error("No solution found");
}

export function getRandomSolution(grid: Grid): Solution {
  for (const solution of getSolutions(grid)) {
    return solution;
  }
  throw new Error("No solution found");
}

export function* getSolutions(
  grid: Grid,
  rand: RandomFunction = defaultRandom,
): Generator<Solution> {
  const eligibleCards = shuffleInPlace([...getEligibleCards()], rand);
  const matchingCardsByCell: Card[][] = Array.from({ length: 9 }, () => []);
  for (let rowIdx = 0; rowIdx < 3; rowIdx++) {
    const ruleRow = getRuleById(grid.ruleRows[rowIdx]);
    const matchingCardsForRow = eligibleCards.filter((card) =>
      ruleRow.matches(card),
    );
    for (let colIdx = 0; colIdx < 3; colIdx++) {
      const ruleColumn = getRuleById(grid.ruleColumns[colIdx]);
      const cellIdx = rowIdx * 3 + colIdx;
      const matchingCardsForCell = matchingCardsForRow.filter((card) =>
        ruleColumn.matches(card),
      );
      matchingCardsByCell[cellIdx] = matchingCardsForCell;
    }
  }
  for (const candidateSolution of permuteUnique(matchingCardsByCell)) {
    yield candidateSolution.map((card) => card.id);
  }
}

export function* permuteUnique<T>(arr: T[][]): Generator<T[]> {
  const sortedIndices = arr
    .map((_, index) => index)
    .sort((a, b) => arr[a].length - arr[b].length);
  for (const solution of permuteUniqueHelper(arr, sortedIndices, [])) {
    const sortedSolution: T[] = new Array(arr.length);
    solution.forEach((value, index) => {
      sortedSolution[sortedIndices[index]] = value;
    });
    yield sortedSolution;
  }
}

function* permuteUniqueHelper<T>(
  arr: T[][],
  sortedIndices: number[],
  result: T[],
): Generator<T[]> {
  if (result.length === arr.length) {
    yield result;
    return;
  }
  const currentIndex = result.length;
  const currentSortedIndex = sortedIndices[currentIndex];
  const choices = arr[currentSortedIndex];

  const seen = new Set<T>(result);
  for (const choice of choices) {
    if (seen.has(choice)) {
      continue;
    }
    yield* permuteUniqueHelper(arr, sortedIndices, result.concat([choice]));
  }
}

export function isSolution(grid: Grid, solution: unknown): boolean {
  // Check that the solution is an array of 9 strings
  if (typeof solution !== "object" || solution === null) {
    return false;
  }
  if (!Array.isArray(solution)) {
    return false;
  }
  if (solution.length !== 9) {
    return false;
  }
  // Check that the solution contains only unique values
  if (new Set(solution).size !== solution.length) {
    return false;
  }
  if (solution.some((cardId) => !cardId)) {
    return false;
  }
  // Check that the solution contains only valid card ids
  if (!solution.every((cardId) => isValidCardId(cardId))) {
    return false;
  }
  // Check that the solution satisfies the rules
  for (let rowIdx = 0; rowIdx < 3; rowIdx++) {
    const ruleRow = getRuleById(grid.ruleRows[rowIdx]);
    for (let colIdx = 0; colIdx < 3; colIdx++) {
      const ruleColumn = getRuleById(grid.ruleColumns[colIdx]);
      const cellIdx = rowIdx * 3 + colIdx;
      const cardId = solution[cellIdx];
      if (
        !ruleRow.matches(getCardById(cardId)) ||
        !ruleColumn.matches(getCardById(cardId))
      ) {
        return false;
      }
    }
  }
  return true;
}

export function isValidCardForCell(
  grid: Grid,
  cellIdx: number,
  cardId: unknown,
): boolean {
  if (typeof cardId !== "string" || !cardId) {
    return false;
  }
  try {
    const card = getCardById(cardId);
    const ruleRow = getRuleById(grid.ruleRows[Math.floor(cellIdx / 3)]);
    const ruleColumn = getRuleById(grid.ruleColumns[cellIdx % 3]);
    return ruleRow.matches(card) && ruleColumn.matches(card);
  } catch {
    return false;
  }
}
