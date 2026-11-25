# Data notes

## What's in `data/` (2026-11-25)

- `ingredients.json`: 45 ingredients, with canonical unit, default pack amount, EU allergens and animal source.
- `recipes.json`: 19 recipes for 2 servings, with quantities, steps, equipment and diet tags.
- `staples.json`: salt, pepper and oil.

**All of it is example data written by the AI and not yet checked by the team.** Every recipe has `"source": "Team-curated placeholder, not yet checked by the team"`.

## Needs a human check
- **Allergens are a safety issue.** Each ingredient's allergen list needs checking against real product labels. For example, curry powder is tagged with mustard only, but real blends vary; soy sauce is tagged with gluten and soybeans.
- **Quantities and steps** are plausible but untested.
- **`featuredRank`** (the order of "Popular recipes") is invented. It isn't based on any usage or survey data, so it shouldn't be described as popular on slides until we have real data.
- **No prices yet.** `offers.json` (Albert Heijn and Jumbo, with `source_url` and `collected_on`) has to be collected by hand by the team (CLAUDE.md 9.5).

## Coverage (bias check, CLAUDE.md 13)
- **Cuisines:** Italian 4, Mexican 3, Chinese 2, breakfast 3, and one each of Southeast Asian, North African, Indian, Turkish, West African, Spanish and Greek.
- **Diets:** vegan 8, vegetarian 16, pescatarian 17, halal 17 (conservative rule, decision D-04).
- **Gaps:** no oven, microwave or air-fryer recipes; few high-protein meat dishes; no East African, Latin American (other than Mexican), Korean or Japanese dishes. k-NN can only recommend what's in this set.
