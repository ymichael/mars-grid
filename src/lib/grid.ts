import { Card, getEligibleCards } from "./allCards";
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
import { permuteArr, permuteBins } from "./permute";

const storedGridsBySeed = storedGrids as Record<string, string>;

export type Grid = {
  ruleColumns: [string, string, string];
  ruleRows: [string, string, string];
};

const DEFAULT_VERSION = "v2";
export const DEFAULT_MIN_MATCHES = 5;
export const DEFAULT_MAX_MATCHES = 20;

interface GenerateOptions {
  rand?: RandomFunction;
  // A lower number will make the puzzle more difficult
  minMatches?: number;
  // A higher number will make the puzzle easier
  maxMatches?: number;
  version?: "v1" | "v2";
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
    version = DEFAULT_VERSION,
    rand = defaultRandom,
    minMatches = DEFAULT_MIN_MATCHES,
    maxMatches = DEFAULT_MAX_MATCHES,
  } = options;
  const generateCandidateGrids =
    version === "v1" ? generateCandidateGridsV1 : generateCandidateGridsV2;
  for (const candidate of generateCandidateGrids(allRules, {
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

export function* generateCandidateGridsV2(
  rules: Rule[],
  options: GenerateOptions = {},
): Generator<Grid> {
  const {
    rand = defaultRandom,
    minMatches = DEFAULT_MIN_MATCHES,
    maxMatches = DEFAULT_MAX_MATCHES,
  } = options;
  const shuffledRules = shuffleInPlace([...rules], rand);
  const eligibleCards = getEligibleCards();
  const ruleBins: Rule[][] = [
    [...shuffledRules],
    [...shuffledRules],
    [...shuffledRules],
    [...shuffledRules],
    [...shuffledRules],
    [...shuffledRules],
  ];

  const matchingCardsCached: Record<string, Card[]> = {};
  const numCardsByRuleIdPairCached: Record<string, number> = {};
  const getMatchingCards = (rule: Rule) => {
    if (rule.id in matchingCardsCached) {
      return matchingCardsCached[rule.id];
    }
    const matchingCards = eligibleCards.filter((card) => rule.matches(card));
    matchingCardsCached[rule.id] = matchingCards;
    return matchingCards;
  };
  const getNumCardsByRuleIdPair = (ruleA: Rule, ruleB: Rule) => {
    const key = `${ruleA.id},${ruleB.id}`;
    if (key in numCardsByRuleIdPairCached) {
      return numCardsByRuleIdPairCached[key];
    }
    const cardsMatchingBoth = getMatchingCards(ruleA).filter((card) => {
      return ruleB.matches(card);
    });
    numCardsByRuleIdPairCached[key] = cardsMatchingBoth.length;
    return cardsMatchingBoth.length;
  };

  // The `result` array in the permutation function represents the selected rules
  // for each position in the grid. The order of rules in the array is as follows:
  // [row1, col1, col2, col3, row2, row3]
  //
  // This arrangement allows for efficient checking of rule compatibility:
  // - The first rule (index 0) is always valid as it's the first selection.
  // - Rules at indices 1-3 only need to be checked against the first rule (row1).
  // - Rules at indices 4-5 need to be checked against rules 1, 2, and 3 (col1, col2, col3).
  //
  // This ordering optimizes the generation process by reducing the number of
  // compatibility checks needed for each candidate rule.
  for (const candidate of permuteBins(ruleBins, function* (choices, result) {
    const resultSet = new Set(result);
    for (const rule of choices) {
      if (result.length === 0) {
        yield rule;
        continue;
      }
      if (resultSet.has(rule)) {
        continue;
      }
      if (result.length <= 3) {
        // Just check against the 0 rule
        const numMatchRuleAndRule1 = getNumCardsByRuleIdPair(rule, result[0]);
        if (
          numMatchRuleAndRule1 >= minMatches &&
          numMatchRuleAndRule1 <= maxMatches
        ) {
          yield rule;
        }
        continue;
      }
      // Otherwise check against the 1, 2 and 3
      const numMatchRuleAndRule1 = getNumCardsByRuleIdPair(rule, result[1]);
      if (
        numMatchRuleAndRule1 < minMatches ||
        numMatchRuleAndRule1 > maxMatches
      ) {
        continue;
      }
      const numMatchRuleAndRule2 = getNumCardsByRuleIdPair(rule, result[2]);
      if (
        numMatchRuleAndRule2 < minMatches ||
        numMatchRuleAndRule2 > maxMatches
      ) {
        continue;
      }
      const numMatchRuleAndRule3 = getNumCardsByRuleIdPair(rule, result[3]);
      if (
        numMatchRuleAndRule3 < minMatches ||
        numMatchRuleAndRule3 > maxMatches
      ) {
        continue;
      }
      yield rule;
    }
  })) {
    yield {
      ruleColumns: [candidate[0].id, candidate[4].id, candidate[5].id],
      ruleRows: [candidate[1].id, candidate[2].id, candidate[3].id],
    };
  }
}

// Deprecated and no longer used since it is much slower than v2
export function* generateCandidateGridsV1(
  rules: Rule[],
  options: GenerateOptions = {},
): Generator<Grid> {
  const {
    rand = defaultRandom,
    minMatches = DEFAULT_MIN_MATCHES,
    maxMatches = DEFAULT_MAX_MATCHES,
  } = options;
  const shuffledRules = shuffleInPlace([...rules], rand);
  for (const ruleCol1 of shuffledRules) {
    const validRulesForRuleCol1 = validRulesForRules(
      [ruleCol1],
      rules,
      minMatches,
      maxMatches,
    );
    for (const validRuleRow of permuteArr(validRulesForRuleCol1, 3)) {
      const currentRules = [ruleCol1, ...validRuleRow];
      const restRules = rules.filter((rule) => !currentRules.includes(rule));
      const restCandidates = validRulesForRules(
        validRuleRow,
        restRules,
        minMatches,
        maxMatches,
      );
      for (const [ruleCol2, ruleCol3] of permuteArr(restCandidates, 2)) {
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
