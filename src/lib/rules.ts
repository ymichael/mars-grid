import { Card, ProductionResource } from "./allCards";

function isProjectCard(card: Card): boolean {
  return (
    card.type === "active" || card.type === "automated" || card.type === "event"
  );
}

export interface Rule {
  id: string;
  description: string;
  matches(card: Card): boolean;
}
class CostAtLeastRule implements Rule {
  id: string;
  description: string;
  cost: number;

  constructor(cost: number) {
    this.id = `cost_ge_${cost}`;
    this.description = `Costs at least ${cost}`;
    this.cost = cost;
  }
  matches(card: Card): boolean {
    return isProjectCard(card) && card.cost >= this.cost;
  }
}

class CostAtMostRule implements Rule {
  id: string;
  description: string;
  cost: number;

  constructor(cost: number) {
    this.id = `cost_le_${cost}`;
    this.description = `Costs at most ${cost}`;
    this.cost = cost;
  }
  matches(card: Card): boolean {
    return isProjectCard(card) && card.cost <= this.cost;
  }
}

class HasTagRule implements Rule {
  id: string;
  description: string;
  tag: string;

  constructor(tag: string) {
    this.id = `tag_${tag}`;
    this.description = `Has ${tag} tag`;
    this.tag = tag;
  }

  matches(card: any): boolean {
    return card.tags.includes(this.tag);
  }
}

class HasNoTagsRule implements Rule {
  id: string;
  description: string;

  constructor() {
    this.id = `no_tags`;
    this.description = `Has no tags`;
  }

  matches(card: Card): boolean {
    return card.tags.length === 0;
  }
}

class IsGreenCardRule implements Rule {
  id: string;
  description: string;

  constructor() {
    this.id = `green_card`;
    this.description = "Is a green card";
  }

  matches(card: Card): boolean {
    return card.type === "automated";
  }
}

class IsEventCardRule implements Rule {
  id: string;
  description: string;

  constructor() {
    this.id = `event_card`;
    this.description = "Is an event card";
  }

  matches(card: Card): boolean {
    return card.type === "event";
  }
}

class IsActiveCardRule implements Rule {
  id: string;
  description: string;

  constructor() {
    this.id = `active_card`;
    this.description = "Is a blue card";
  }

  matches(card: Card): boolean {
    return card.type === "active";
  }
}

class IncreasesProductionForResourceRule implements Rule {
  id: string;
  description: string;
  resource: ProductionResource;

  constructor(resource: ProductionResource) {
    this.id = `prod_inc_${resource}`;
    this.description = `Increases production for ${resource} when played`;
    this.resource = resource;
  }

  matchesBehavior(behavior: Card["behavior"]): boolean {
    if (!behavior) {
      return false;
    }
    const production = behavior.production;
    if (production) {
      if (this.resource in production) {
        const productionValue = production[this.resource];
        if (typeof productionValue !== "number" || productionValue > 0) {
          return true;
        }
      }
    }
    return false;
  }

  matches(card: Card): boolean {
    if (this.matchesBehavior(card.behavior)) {
      return true;
    }
    if (
      card.behavior?.or?.behaviors.some((behavior) => {
        return this.matchesBehavior(behavior);
      })
    ) {
      return true;
    }
    return false;
  }
}

class DecreasesProductionForResourceRule implements Rule {
  id: string;
  description: string;
  resource: ProductionResource;

  constructor(resource: ProductionResource) {
    this.id = `prod_dec_${resource}`;
    this.description = `Decreases production of ${resource} when played`;
    this.resource = resource;
  }

  matchesBehavior(behavior: Card["behavior"]): boolean {
    if (!behavior) {
      return false;
    }
    const production = behavior.production;
    if (production) {
      if (this.resource in production) {
        const productionValue = production[this.resource];
        if (typeof productionValue === "number" && productionValue < 0) {
          return true;
        }
      }
    }
    if (behavior.decreaseAnyProduction?.type === this.resource) {
      return true;
    }
    return false;
  }

  matches(card: Card): boolean {
    if (this.matchesBehavior(card.behavior)) {
      return true;
    }
    if (
      card.behavior?.or?.behaviors.some((behavior) => {
        return this.matchesBehavior(behavior);
      })
    ) {
      return true;
    }
    return false;
  }
}

class HasGlobalRequirementRule implements Rule {
  id: string;
  description: string;

  constructor() {
    this.id = `global_req`;
    this.description = `Has global requirement`;
  }

  matches(card: Card): boolean {
    return (
      isProjectCard(card) &&
      !!card.requirements.find((req) => {
        return (
          req.oceans !== undefined ||
          req.oxygen !== undefined ||
          req.temperature !== undefined ||
          req.venus !== undefined
        );
      })
    );
  }
}

class HasTagRequirementRule implements Rule {
  id: string;
  description: string;
  tag: string;

  constructor(tag: string) {
    this.id = `req_tag_${tag}`;
    this.description = `Has ${tag} tag requirement`;
    this.tag = tag;
  }

  matches(card: Card): boolean {
    return card.requirements.some((req) => {
      if ("tag" in req) {
        return req.tag === this.tag;
      }
      return false;
    });
  }
}

class GainsResourceRule implements Rule {
  id: string;
  description: string;
  resource: ProductionResource;

  constructor(resource: ProductionResource) {
    this.id = `gain_${resource}`;
    this.description = `Gains ${resource}`;
    this.resource = resource;
  }

  matchesBehavior(behavior: Card["behavior"]): boolean {
    if (!behavior) {
      return false;
    }
    const stock = behavior.stock;
    if (stock) {
      if (this.resource in stock) {
        const stockValue = stock[this.resource];
        if (typeof stockValue !== "number" || stockValue > 0) {
          return true;
        }
      }
    }
    return false;
  }

  matches(card: Card): boolean {
    if (this.matchesBehavior(card.behavior)) {
      return true;
    }
    if (
      card.behavior?.or?.behaviors.some((behavior) => {
        return this.matchesBehavior(behavior);
      })
    ) {
      return true;
    }
    return false;
  }
}

class RemovesPlantsRule implements Rule {
  id: string;
  description: string;

  constructor() {
    this.id = `rm_plants`;
    this.description = `Removes Plants when played`;
  }

  matches(card: Card): boolean {
    if (card.behavior?.removeAnyPlants) {
      return true;
    }
    return false;
  }
}

class HasVictoryPointsRule implements Rule {
  id: string;
  description: string;

  constructor() {
    this.id = `vp`;
    this.description = "Has victory points";
  }

  matches(card: Card): boolean {
    return card.victoryPoints !== undefined;
  }
}

class DecreasesProductionRule implements Rule {
  id: string;
  description: string;

  constructor() {
    this.id = `prod_dec`;
    this.description = "Decreases any production when played";
  }

  matchesBehavior(behavior: Card["behavior"]): boolean {
    if (!behavior) {
      return false;
    }
    if (behavior.decreaseAnyProduction) {
      return true;
    }
    for (const value of Object.values(behavior.production ?? {})) {
      if (typeof value === "number" && value < 0) {
        return true;
      }
    }
    return false;
  }

  matches(card: Card): boolean {
    if (this.matchesBehavior(card.behavior)) {
      return true;
    }
    if (
      card.behavior?.or?.behaviors.some((behavior) => {
        return this.matchesBehavior(behavior);
      })
    ) {
      return true;
    }
    return false;
  }
}

class PlacesCityRule implements Rule {
  id: string;
  description: string;

  constructor() {
    this.id = `place_city`;
    this.description = "Places city";
  }

  matches(card: Card): boolean {
    return !!card.behavior?.city;
  }
}

class PlacesOceanRule implements Rule {
  id: string;
  description: string;

  constructor() {
    this.id = `place_ocean`;
    this.description = "Places ocean when played";
  }

  matches(card: Card): boolean {
    return !!card.behavior?.ocean;
  }
}

class DrawsCardRule implements Rule {
  id: string;
  description: string;

  constructor() {
    this.id = `draw_card`;
    this.description = "Draws card when played";
  }

  matches(card: Card): boolean {
    if (card.behavior?.drawCard !== undefined) {
      return true;
    }
    if (card.behavior?.or?.behaviors.some((behavior) => behavior.drawCard)) {
      return true;
    }
    return false;
  }
}

class HasDrawCardActionRule implements Rule {
  id: string;
  description: string;

  constructor() {
    this.id = `draw_card_action`;
    this.description = "Has draw card action";
  }

  matches(card: Card): boolean {
    if (card.action?.drawCard) {
      return true;
    }
    if (card.action?.or?.behaviors.some((action) => action.drawCard)) {
      return true;
    }
    return false;
  }
}

class TakesResourceRule implements Rule {
  id: string;
  description: string;
  resource: "floater" | "animal" | "microbe" | "science";

  constructor(resource: "floater" | "animal" | "microbe" | "science") {
    this.id = `take_${resource}`;
    this.description = `Accepts ${resource} resources`;
    this.resource = resource;
  }

  matches(card: Card): boolean {
    return card.resourceType?.toLowerCase() === this.resource;
  }
}

class RaisesTRWhenPlayedRule implements Rule {
  id: string;
  description: string;

  constructor() {
    this.id = `raise_tr`;
    this.description = "Raises TR when played";
  }

  matches(card: Card): boolean {
    return card.behavior?.tr !== undefined;
  }
}

class HasActionRule implements Rule {
  id: string;
  description: string;

  constructor() {
    this.id = `has_action`;
    this.description = "Has action";
  }
  matches(card: Card): boolean {
    return card.action !== undefined;
  }
}

class DiscountCardsRule implements Rule {
  id: string;
  description: string;

  constructor() {
    this.id = `discount_cards`;
    this.description = "Has effect that discounts cards";
  }

  matches(card: Card): boolean {
    return card.cardDiscount !== undefined;
  }
}

const tags = [
  "space",
  "earth",
  "science",
  "plant",
  "microbe",
  "animal",
  "venus",
  "building",
  "jovian",
  "power",
  "city",
  "wild",
];

const resources: ProductionResource[] = [
  "megacredits",
  "steel",
  "titanium",
  "plants",
  "energy",
  "heat",
];

export const allRules: Rule[] = [
  new CostAtLeastRule(20),
  new CostAtMostRule(10),
  ...tags.map((tag) => new HasTagRule(tag)),
  new HasTagRequirementRule("earth"),
  new HasTagRequirementRule("science"),
  new HasTagRequirementRule("venus"),
  new HasTagRequirementRule("jovian"),
  new HasTagRequirementRule("power"),
  new IsGreenCardRule(),
  new IsEventCardRule(),
  new IsActiveCardRule(),
  new HasNoTagsRule(),
  ...resources
    .map((resource) => {
      return [
        new IncreasesProductionForResourceRule(resource),
        new DecreasesProductionForResourceRule(resource),
        new GainsResourceRule(resource),
      ];
    })
    .flat(),
  new RemovesPlantsRule(),
  new HasVictoryPointsRule(),
  new DecreasesProductionRule(),
  new PlacesCityRule(),
  new DrawsCardRule(),
  new HasActionRule(),
  new HasGlobalRequirementRule(),
  new PlacesOceanRule(),
  new RaisesTRWhenPlayedRule(),
  new HasDrawCardActionRule(),
  new TakesResourceRule("floater"),
  new TakesResourceRule("animal"),
  new TakesResourceRule("microbe"),
  new TakesResourceRule("science"),
  new DiscountCardsRule(),
];

const ruleByIdCached = (() => {
  const map = new Map<string, Rule>();
  for (const rule of allRules) {
    if (map.has(rule.id)) {
      throw new Error(`Duplicate rule id: ${rule.id}`);
    }
    map.set(rule.id, rule);
  }
  return Object.fromEntries(map);
})();

export function getRuleById(id: string): Rule {
  const rule = ruleByIdCached[id];
  if (!rule) {
    throw new Error(`Rule with id ${id} not found`);
  }
  return rule;
}
