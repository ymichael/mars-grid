import { describe, test } from "vitest";
import { getEligibleCards } from "./allCards";
import { allRules } from "./rules";

describe.skip("Rules and Cards", () => {
  test("Log each rule and its matching cards", () => {
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
