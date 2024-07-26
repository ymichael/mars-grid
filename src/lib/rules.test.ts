import { describe, expect, it } from "vitest";
import { getEligibleCards } from "./allCards";
import { allRules } from "./rules";
import {
  validRulesForRules,
  DEFAULT_MAX_MATCHES,
  DEFAULT_MIN_MATCHES,
} from "./grid";

const IGNORED_RULES = [
  "gain_energy",
  "req_tag_space",
  "req_tag_building",
  "req_tag_city",
  "req_tag_wild",
];

describe("Rules", () => {
  const allCards = getEligibleCards();
  for (const rule of allRules) {
    if (IGNORED_RULES.includes(rule.id)) {
      continue;
    }
    it(`should match non-zero cards for ${rule.id}`, () => {
      const matchingCards = allCards.filter((card) => rule.matches(card));
      expect(matchingCards.length).toBeGreaterThan(0);
    });
  }

  it.skip("should enumerate all rules and count valid rules for each", () => {
    for (const rule of allRules) {
      const validRules = validRulesForRules(
        [rule],
        allRules,
        DEFAULT_MIN_MATCHES,
        DEFAULT_MAX_MATCHES,
      );
      console.log(`Rule: ${rule.id}, Valid rules: ${validRules.length}`);
    }
  });
});
