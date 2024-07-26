import { describe, expect, it } from "vitest";
import { getEligibleCards, getCardById } from "./allCards";
import { allRules, getRuleById } from "./rules";
import {
  validRulesForRules,
  DEFAULT_MAX_MATCHES,
  DEFAULT_MIN_MATCHES,
} from "./grid";
import { Truculenta } from "next/font/google";

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

describe("Specific Rule Tests", () => {
  it("cost_ge_20", () => {
    const rule = getRuleById("cost_ge_20");
    expect(rule).toBeDefined();
    expect(rule!.matches(getCardById("gyropolis"))).toBe(true);
    expect(rule!.matches(getCardById("cartel"))).toBe(false);
  });

  it("cost_le_10", () => {
    const rule = getRuleById("cost_le_10");
    expect(rule).toBeDefined();
    expect(rule!.matches(getCardById("cartel"))).toBe(true);
    expect(rule!.matches(getCardById("gyropolis"))).toBe(false);
  });

  it("tag_space", () => {
    const rule = getRuleById("tag_space");
    expect(rule).toBeDefined();
    expect(rule!.matches(getCardById("asteroid"))).toBe(true);
    expect(rule!.matches(getCardById("cartel"))).toBe(false);
  });

  it("green_card", () => {
    const rule = getRuleById("green_card");
    expect(rule).toBeDefined();
    expect(rule!.matches(getCardById("artificial-photosynthesis"))).toBe(true);
    expect(rule!.matches(getCardById("asteroid"))).toBe(false);
  });

  it("event_card", () => {
    const rule = getRuleById("event_card");
    expect(rule).toBeDefined();
    expect(rule!.matches(getCardById("asteroid"))).toBe(true);
    expect(rule!.matches(getCardById("artificial-photosynthesis"))).toBe(false);
  });

  it("active_card", () => {
    const rule = getRuleById("active_card");
    expect(rule).toBeDefined();
    expect(rule!.matches(getCardById("asteroid-deflection-system"))).toBe(true);
    expect(rule!.matches(getCardById("asteroid"))).toBe(false);
  });

  it("prod_inc_plants", () => {
    const rule = getRuleById("prod_inc_plants");
    expect(rule).toBeDefined();
    expect(rule!.matches(getCardById("artificial-photosynthesis"))).toBe(true);
    expect(rule!.matches(getCardById("asteroid"))).toBe(false);
  });

  it("gain_titanium", () => {
    const rule = getRuleById("gain_titanium");
    expect(rule).toBeDefined();
    expect(rule!.matches(getCardById("asteroid"))).toBe(true);
    expect(rule!.matches(getCardById("artificial-photosynthesis"))).toBe(false);
  });

  it("rm_plants", () => {
    const rule = getRuleById("rm_plants");
    expect(rule).toBeDefined();
    expect(rule!.matches(getCardById("asteroid"))).toBe(true);
    expect(rule!.matches(getCardById("artificial-photosynthesis"))).toBe(false);
  });

  it("vp", () => {
    const rule = getRuleById("vp");
    expect(rule).toBeDefined();
    expect(rule!.matches(getCardById("artificial-lake"))).toBe(true);
    expect(rule!.matches(getCardById("asteroid"))).toBe(false);
  });

  it("place_city", () => {
    const rule = getRuleById("place_city");
    expect(rule).toBeDefined();
    expect(rule!.matches(getCardById("capital"))).toBe(true);
    expect(rule!.matches(getCardById("asteroid"))).toBe(false);
  });

  it("place_ocean", () => {
    const rule = getRuleById("place_ocean");
    expect(rule).toBeDefined();
    expect(rule!.matches(getCardById("artificial-lake"))).toBe(true);
    expect(rule!.matches(getCardById("asteroid"))).toBe(false);
  });

  it("draw_card", () => {
    const rule = getRuleById("draw_card");
    expect(rule).toBeDefined();
    expect(rule!.matches(getCardById("business-contacts"))).toBe(true);
    expect(rule!.matches(getCardById("business-network"))).toBe(false);
    expect(rule!.matches(getCardById("asteroid"))).toBe(false);
  });

  it("global_req", () => {
    const rule = getRuleById("global_req");
    expect(rule).toBeDefined();
    expect(rule!.matches(getCardById("artificial-lake"))).toBe(true);
    expect(rule!.matches(getCardById("asteroid"))).toBe(false);
  });
});
