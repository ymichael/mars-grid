import { describe, expect, it } from "vitest";
import { getEligibleCards, getCardById } from "./allCards";
import { allRules, getRuleById } from "./rules";
import {
  validRulesForRules,
  DEFAULT_MAX_MATCHES,
  DEFAULT_MIN_MATCHES,
} from "./grid";

const IGNORED_RULES = ["gain_energy"];

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
    expect(rule!.matches(getCardById("ai-central"))).toBe(true);
    expect(rule!.matches(getCardById("earth-catapult"))).toBe(true);
    expect(rule!.matches(getCardById("cartel"))).toBe(false);
  });

  it("cost_le_10", () => {
    const rule = getRuleById("cost_le_10");
    expect(rule).toBeDefined();
    expect(rule!.matches(getCardById("cartel"))).toBe(true);
    expect(rule!.matches(getCardById("advanced-alloys"))).toBe(true);
    expect(rule!.matches(getCardById("gyropolis"))).toBe(false);
  });

  it("tag_space", () => {
    const rule = getRuleById("tag_space");
    expect(rule).toBeDefined();
    expect(rule!.matches(getCardById("asteroid"))).toBe(true);
    expect(rule!.matches(getCardById("cartel"))).toBe(false);
  });

  it("tag_building", () => {
    const rule = getRuleById("tag_building");
    expect(rule).toBeDefined();
    expect(rule!.matches(getCardById("rover-construction"))).toBe(true);
    expect(rule!.matches(getCardById("cartel"))).toBe(false);
  });

  it("tag_city", () => {
    const rule = getRuleById("tag_city");
    expect(rule).toBeDefined();
    expect(rule!.matches(getCardById("capital"))).toBe(true);
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
    expect(rule!.matches(getCardById("algae"))).toBe(true);
    expect(rule!.matches(getCardById("asteroid"))).toBe(false);
  });

  it("prod_inc_megacredits", () => {
    const rule = getRuleById("prod_inc_megacredits");
    expect(rule).toBeDefined();
    expect(rule!.matches(getCardById("asteroid"))).toBe(false);
    expect(rule!.matches(getCardById("cartel"))).toBe(true);
    expect(rule!.matches(getCardById("livestock"))).toBe(true);
    expect(rule!.matches(getCardById("gyropolis"))).toBe(true);
    expect(rule!.matches(getCardById("interplanetary-trade"))).toBe(true);
  });

  it("prod_dec_megacredits", () => {
    const rule = getRuleById("prod_dec_megacredits");
    expect(rule).toBeDefined();
    expect(rule!.matches(getCardById("asteroid"))).toBe(false);
    expect(rule!.matches(getCardById("fueled-generators"))).toBe(true);
    expect(rule!.matches(getCardById("loan"))).toBe(true);
    expect(rule!.matches(getCardById("hackers"))).toBe(true);
    expect(rule!.matches(getCardById("pioneer-settlement"))).toBe(true);
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

  it("raise_tr", () => {
    const rule = getRuleById("raise_tr");
    expect(rule).toBeDefined();
    expect(rule!.matches(getCardById("bribed-committee"))).toBe(true);
    expect(rule!.matches(getCardById("terraforming-ganymede"))).toBe(true);
    expect(rule!.matches(getCardById("asteroid"))).toBe(false);
  });
});
