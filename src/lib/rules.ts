import { Card } from "./allCards";

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
    this.id = `cost-at-least-${cost}`;
    this.description = `Costs at least ${cost}`;
    this.cost = cost;
  }
  matches(card: Card): boolean {
    return (
      (card.type === "automated" ||
        card.type === "active" ||
        card.type === "event") &&
      card.cost >= this.cost
    );
  }
}

class CostAtMostRule implements Rule {
  id: string;
  description: string;
  cost: number;

  constructor(cost: number) {
    this.id = `cost-at-most-${cost}`;
    this.description = `Costs at most ${cost}`;
    this.cost = cost;
  }
  matches(card: Card): boolean {
    return (
      (card.type === "automated" ||
        card.type === "active" ||
        card.type === "event") &&
      card.cost <= this.cost
    );
  }
}

class HasTagRule implements Rule {
  id: string;
  description: string;
  tag: string;

  constructor(tag: string) {
    this.id = `has-tag-${tag}`;
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
    this.id = `has-no-tags`;
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
    this.id = `is-green-card`;
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
    this.id = `is-event-card`;
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
    this.id = `is-active-card`;
    this.description = "Is a blue card";
  }

  matches(card: Card): boolean {
    return card.type === "active";
  }
}

class IncreasesProductionForResourceRule implements Rule {
  id: string;
  description: string;
  resource: string;

  constructor(resource: string) {
    this.id = `increases-production-for-${resource}`;
    this.description = `Increases production for ${resource}`;
    this.resource = resource;
  }

  matches(card: Card): boolean {
    const production = card.behavior?.production;
    if (!production) {
      return false;
    }
    if (this.resource in production) {
      const productionValue = production[this.resource];
      return typeof productionValue !== "number" || productionValue > 0;
    }
    return false;
  }
}

class HasGlobalRequirementRule implements Rule {
  id: string;
  description: string;

  constructor() {
    this.id = `has-global-requirement`;
    this.description = `Has global requirement`;
  }

  matches(card: Card): boolean {
    return (
      (card.type === "automated" ||
        card.type === "active" ||
        card.type === "event") &&
      !!card.requirements.find((req) => {
        return req.oceans || req.oxygen || req.temperature;
      })
    );
  }
}

class HasTagRequirementRule implements Rule {
  id: string;
  description: string;
  tag: string;

  constructor(tag: string) {
    this.id = `has-tag-requirement-${tag}`;
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
  resource: string;

  constructor(resource: string) {
    this.id = `gains-resource-${resource}`;
    this.description = `Gains ${resource}`;
    this.resource = resource;
  }

  matches(card: Card): boolean {
    const stock = card.behavior?.stock;
    if (!stock) {
      return false;
    }
    if (this.resource in stock) {
      const stockValue = stock[this.resource];
      if (typeof stockValue !== "number" || stockValue > 0) {
        return true;
      }
    }
    return false;
  }
}

class HasVictoryPointsRule implements Rule {
  id: string;
  description: string;

  constructor() {
    this.id = `has-victory-points`;
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
    this.id = `decreases-production`;
    this.description = "Decreases production";
  }

  matches(card: Card): boolean {
    if (card.behavior?.decreaseAnyProduction !== undefined) {
      return true;
    }
    for (const value of Object.values(card.behavior?.production ?? {})) {
      if (typeof value === "number" && value < 0) {
        return true;
      }
    }
    return false;
  }
}

class PlacesCityRule implements Rule {
  id: string;
  description: string;

  constructor() {
    this.id = `places-city`;
    this.description = "Places city";
  }

  matches(card: Card): boolean {
    return !!card.behavior?.city;
  }
}

class DrawsCardRule implements Rule {
  id: string;
  description: string;

  constructor() {
    this.id = `draws-card`;
    this.description = "Draws card";
  }

  matches(card: Card): boolean {
    return card.behavior?.drawCard !== undefined;
  }
}

class HasActionRule implements Rule {
  id: string;
  description: string;

  constructor() {
    this.id = `has-action`;
    this.description = "Has action";
  }
  matches(card: Card): boolean {
    return card.action !== undefined;
  }
}

export const allRules: Rule[] = [
  new CostAtLeastRule(20),
  new CostAtMostRule(10),
  ...[
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
  ].map((tag) => new HasTagRule(tag)),
  ...[
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
  ].map((resource) => new HasTagRequirementRule(resource)),
  new IsGreenCardRule(),
  new IsEventCardRule(),
  new IsActiveCardRule(),
  new HasNoTagsRule(),
  ...(
    ["megacredits", "steel", "titanium", "plants", "energy", "heat"] as const
  ).map((resource) => new IncreasesProductionForResourceRule(resource)),
  ...(
    ["megacredits", "titanium", "steel", "plants", "energy", "heat"] as const
  ).map((resource) => new GainsResourceRule(resource)),
  new HasVictoryPointsRule(),
  new DecreasesProductionRule(),
  new PlacesCityRule(),
  new DrawsCardRule(),
  new HasActionRule(),
  new HasGlobalRequirementRule(),
];

const ruleByIdCached = Object.fromEntries(
  allRules.map((rule) => [rule.id, rule]),
);

export function getRuleById(id: string): Rule {
  const rule = ruleByIdCached[id];
  if (!rule) {
    throw new Error(`Rule with id ${id} not found`);
  }
  return rule;
}
