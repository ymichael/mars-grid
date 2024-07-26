import { describe, it } from "vitest";
import { getEligibleCards } from "./allCards";
import { allRules } from "./rules";
import {
  validRulesForRules,
  DEFAULT_MAX_MATCHES,
  DEFAULT_MIN_MATCHES,
} from "./grid";

describe.skip("Rules and Cards", () => {
  it("should og each rule and its matching cards", () => {
    const allCards = getEligibleCards();
    allRules.forEach((rule) => {
      const matchingCards = allCards.filter((card) => rule.matches(card));
      console.log(`Rule: ${rule.description}`);
      console.log("Matching cards:");
      matchingCards.forEach((card) => {
        console.log(`- ${card.name}`);
      });
      console.log("---");
    });
  });
});

describe.skip("validRulesForRules", () => {
  it("should enumerate all rules and count valid rules for each", () => {
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
