import { getEligibleCards } from "./allCards";
import { Rule, allRules, getRuleById } from "./rules";
import {
  RandomFunction,
  defaultRandom,
  shuffleInPlace,
  randomFactory,
} from "./random";
import { isSolvable } from "./solver";
import { format } from "date-fns";
import storedGrids from "../grids.json";

const storedGridsBySeed = storedGrids as Record<string, string>;

export type Grid = {
  ruleColumns: [string, string, string];
  ruleRows: [string, string, string];
};

export const DEFAULT_MIN_MATCHES = 5;
export const DEFAULT_MAX_MATCHES = 20;

interface GenerateOptions {
  rand?: RandomFunction;
  // A lower number will make the puzzle more difficult
  minMatches?: number;
  // A higher number will make the puzzle easier
  maxMatches?: number;
}

export function getGridId(grid: Grid): string {
  const { ruleColumns, ruleRows } = grid;
  const serializedRules = [...ruleColumns, ...ruleRows].join(",");
  return `v1-${serializedRules}`;
}

export function fromGridId(gridId: string): Grid {
  const match = gridId.match(/^v1-(.+)$/);
  if (!match) {
    throw new Error("Unsupported gridId version");
  }
  const rules = match[1].split(",");
  if (rules.length !== 6) {
    throw new Error("Invalid serialized grid format");
  }
  for (const rule of rules) {
    if (!getRuleById(rule)) {
      throw new Error(`Unknown rule '${rule}'`);
    }
  }
  // 6 unique rules
  const uniqueRules = new Set(rules);
  if (uniqueRules.size !== 6) {
    throw new Error("Invalid grid: contains duplicate rules");
  }
  return {
    ruleColumns: [rules[0], rules[1], rules[2]],
    ruleRows: [rules[3], rules[4], rules[5]],
  };
}

function* generateGridPuzzles(options: GenerateOptions = {}): Generator<Grid> {
  const {
    rand = defaultRandom,
    minMatches = DEFAULT_MIN_MATCHES,
    maxMatches = DEFAULT_MAX_MATCHES,
  } = options;
  const rules = shuffleInPlace([...allRules], rand);
  for (const candidate of generateCandidateGrids(rules, {
    rand,
    minMatches,
    maxMatches,
  })) {
    // Make sure the candidate is solvable
    if (isSolvable(candidate)) {
      yield candidate;
    }
  }
}

export function generateGridPuzzle(options: GenerateOptions = {}): Grid {
  for (const grid of generateGridPuzzles(options)) {
    return grid;
  }
  throw new Error("Failed to generate puzzle");
}

export function* generateGridPuzzlesFromSeed(
  seed: string,
  options: Omit<GenerateOptions, "rand"> = {},
): Generator<Grid> {
  yield* generateGridPuzzles({ ...options, rand: randomFactory(seed) });
}

export function generateGridPuzzleFromSeed(
  seed: string,
  options: Omit<GenerateOptions, "rand"> = {},
): Grid {
  if (seed in storedGridsBySeed && storedGridsBySeed[seed]) {
    return fromGridId(storedGridsBySeed[seed]);
  }
  for (const grid of generateGridPuzzlesFromSeed(seed, options)) {
    return grid;
  }
  throw new Error("Failed to generate puzzle");
}

export function getSeedForDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function validRulesForRules(
  existingRules: Rule[],
  allRules: Rule[],
  minMatches: number,
  maxMatches: number,
): Rule[] {
  const matchingCards = getEligibleCards().filter((card) =>
    existingRules.every((rule) => rule.matches(card)),
  );
  return allRules.filter((otherRule) => {
    if (existingRules.includes(otherRule)) {
      return false;
    }
    const numMatchingCards = matchingCards.filter((card) =>
      otherRule.matches(card),
    ).length;
    return numMatchingCards >= minMatches && numMatchingCards <= maxMatches;
  });
}

function* permute<T>(arr: T[], n: number): Generator<T[]> {
  const generate = function* (arr: T[], n: number): Generator<T[]> {
    if (n === 1) {
      for (let i = 0; i < arr.length; i++) {
        yield [arr[i]];
      }
    } else {
      for (let i = 0; i < arr.length; i++) {
        const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
        for (const perm of generate(remaining, n - 1)) {
          yield [arr[i], ...perm];
        }
      }
    }
  };
  yield* generate(arr, n);
}

export function* generateCandidateGrids(
  rules: Rule[],
  options: GenerateOptions = {},
): Generator<Grid> {
  const {
    rand = defaultRandom,
    minMatches = DEFAULT_MIN_MATCHES,
    maxMatches = DEFAULT_MAX_MATCHES,
  } = options;
  for (const ruleCol1 of shuffleInPlace([...rules], rand)) {
    const validRulesForRuleCol1 = validRulesForRules(
      [ruleCol1],
      rules,
      minMatches,
      maxMatches,
    );
    for (const validRuleRow of permute(validRulesForRuleCol1, 3)) {
      const currentRules = [ruleCol1, ...validRuleRow];
      const restRules = rules.filter((rule) => !currentRules.includes(rule));
      const restCandidates = validRulesForRules(
        validRuleRow,
        restRules,
        minMatches,
        maxMatches,
      );
      for (const [ruleCol2, ruleCol3] of permute(restCandidates, 2)) {
        yield {
          ruleColumns: [ruleCol1.id, ruleCol2.id, ruleCol3.id],
          ruleRows: [
            validRuleRow[0].id,
            validRuleRow[1].id,
            validRuleRow[2].id,
          ],
        };
      }
    }
  }
}
