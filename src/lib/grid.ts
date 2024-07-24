import { Card, getEligibleCards } from "./allCards";
import { Rule, allRules, getRuleById } from "./rules";
import {
  RandomFunction,
  defaultRandom,
  shuffleInPlace,
  randomFactory,
} from "./random";

export type Grid = {
  ruleColumns: [Rule, Rule, Rule];
  ruleRows: [Rule, Rule, Rule];
};

export type SerializedGrid = {
  ruleColumns: string[];
  ruleRows: string[];
};

export function serializeGridForClient(grid: Grid): SerializedGrid {
  return {
    ruleColumns: grid.ruleColumns.map((rule) => rule.id),
    ruleRows: grid.ruleRows.map((rule) => rule.id),
  };
}

export function deserializeGridForClient(serializedGrid: SerializedGrid): Grid {
  return {
    ruleColumns: serializedGrid.ruleColumns.map((id) => getRuleById(id)) as [
      Rule,
      Rule,
      Rule,
    ],
    ruleRows: serializedGrid.ruleRows.map((id) => getRuleById(id)) as [
      Rule,
      Rule,
      Rule,
    ],
  };
}

const MIN_MATCHES = 10;

export function generateGridPuzzle(rand: RandomFunction = defaultRandom): Grid {
  const rules = shuffleInPlace([...allRules], rand);
  for (const candidate of generateCandidateGrids(rules, rand)) {
    return candidate;
  }
  throw new Error("Failed to generate puzzle");
}

export function generateGridPuzzleFromSeed(seed: string): Grid {
  return generateGridPuzzle(randomFactory(seed));
}

function validRulesForRules(existingRules: Rule[], allRules: Rule[]): Rule[] {
  const matchingCards = getEligibleCards().filter((card) =>
    existingRules.every((rule) => rule.matches(card))
  );
  return allRules.filter((otherRule) => {
    if (existingRules.includes(otherRule)) {
      return false;
    }
    return (
      matchingCards.filter((card) => otherRule.matches(card)).length >=
      MIN_MATCHES
    );
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
  rand: RandomFunction = defaultRandom
): Generator<Grid> {
  for (const ruleCol1 of shuffleInPlace([...rules], rand)) {
    const validRulesForRuleCol1 = validRulesForRules([ruleCol1], rules);
    for (const validRuleRow of permute(validRulesForRuleCol1, 3)) {
      const currentRules = [ruleCol1, ...validRuleRow];
      const restRules = rules.filter((rule) => !currentRules.includes(rule));
      const restCandidates = validRulesForRules(validRuleRow, restRules);
      for (const [ruleCol2, ruleCol3] of permute(restCandidates, 2)) {
        yield {
          ruleColumns: [ruleCol1, ruleCol2, ruleCol3],
          ruleRows: [validRuleRow[0], validRuleRow[1], validRuleRow[2]],
        };
      }
    }
  }
}
