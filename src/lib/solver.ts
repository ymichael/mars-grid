import { Card, getEligibleCards } from "./allCards";
import { Grid } from "./grid";
import {
  RandomFunction,
  defaultRandom,
  randomFactory,
  shuffleInPlace,
} from "./random";

type Solution = Card[];

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
  rand: RandomFunction = defaultRandom
): Generator<Solution> {
  const eligibleCards = shuffleInPlace([...getEligibleCards()], rand);
  const matchingCardsByCell: Card[][] = Array.from({ length: 9 }, () => []);
  for (let rowIdx = 0; rowIdx < 3; rowIdx++) {
    const ruleRow = grid.ruleRows[rowIdx];
    const matchingCardsForRow = eligibleCards.filter((card) =>
      ruleRow.matches(card)
    );
    for (let colIdx = 0; colIdx < 3; colIdx++) {
      const ruleColumn = grid.ruleColumns[colIdx];
      const cellIdx = rowIdx * 3 + colIdx;
      const matchingCardsForCell = matchingCardsForRow.filter((card) =>
        ruleColumn.matches(card)
      );
      matchingCardsByCell[cellIdx] = matchingCardsForCell;
    }
  }
  for (const candidateSolution of permuteUnique(matchingCardsByCell)) {
    yield candidateSolution;
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
  result: T[]
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
