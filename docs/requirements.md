# Requirements

Format: CLAUDE.md section 14.5. Everything below is **proposed** until the team confirms it. IDs are referenced in PRs and commits.

## Functional

### FR-01 Add ingredients by searching
- **User story:** As a student on a budget, I want to type what's in my fridge and pick it from suggestions, so that I don't have to spell everything or remember exact names.
- **System requirements:**
  - The system shall suggest up to 6 matching ingredients after each typed character, including matches on Dutch and alternative names (e.g. "paprika" → Bell pepper).
  - When the field is empty and focused, the system shall show common ingredients.
  - The system shall add the highlighted ingredient on Enter, comma or tap, with a default amount, and keep the field focused for the next one.
- **MoSCoW:** Must
- **Acceptance:** typing "papr" and pressing Enter adds "Bell pepper ×2"; the field stays focused and empty.
- **Status:** done (on `feature/search-home`), not tested with users

### FR-02 Results grouped by readiness
- **User story:** As a student, I want to see which recipes I can cook now and which need a few things, so that I can decide quickly what to make.
- **System requirements:**
  - The system shall show three lists in a fixed order: Ready to cook (0 missing), Missing a few (1–3), Missing many (4+).
  - Each list shall show its count, and each recipe shall show "You have X of Y" and what's still needed.
  - The lists shall update within 1 s of adding or removing an ingredient.
  - A partial amount counts as missing.
- **MoSCoW:** Must
- **Acceptance:** with eggs, potatoes and onions in the fridge, "Spanish omelette" is in Ready to cook.
- **Status:** done, not tested with users

### FR-03 Diet as a hard filter
- **User story:** As a vegan (or vegetarian, halal or pescatarian) student, I want recipes that don't fit my diet to disappear, so that I don't have to check each one.
- **System requirements:** when a diet is selected, the system shall show only recipes tagged with that diet, in every list.
- **MoSCoW:** Must
- **Status:** done in the Filters sheet; onboarding step 2 not built

### FR-04 Allergies as a hard filter
- **User story:** As a student with a food allergy, I want recipes with that allergen never shown, so that I don't cook something unsafe by mistake.
- **System requirements:**
  - The system shall never show a recipe whose non-optional ingredients contain a selected EU allergen, in any list.
  - Optional ingredients with that allergen shall be hidden from the recipe.
- **MoSCoW:** Must
- **Status:** done in the Filters sheet, with unit tests (`lib/recommender/filters.test.ts`); onboarding step 1 not built

### FR-05 Undo removing ingredients
- **User story:** As a student, I want to undo removing an ingredient, so that a wrong tap doesn't cost me my list.
- **System requirements:** after removing one ingredient or clearing all, the system shall offer "Undo" for 5 s, longer while it's focused or hovered.
- **MoSCoW:** Must
- **Status:** done

### FR-06 Filters sheet
- **User story:** As a student, I want my diet, allergies and kitchen equipment in one place, so that the main screen stays simple.
- **System requirements:**
  - A "Filters" button under the search bar shall open a sheet with diet, the 14 EU allergens and equipment.
  - The apply button shall show the live result count ("Show 12 recipes").
  - The sheet shall close with Esc, Close or a tap outside, and focus shall return to the button.
- **MoSCoW:** Must
- **Status:** done

### FR-07 Sort recipes
- **User story:** As a student, I want to sort recipes by price or cooking time, so that I find a cheap or quick meal first.
- **System requirements:** a "Sort" button next to Filters shall offer Best match, Price, Cooking time, Uses most of your fridge and Fewest ingredients. The choice shall sort recipes inside each list and be remembered.
- **MoSCoW:** Must (price, time); Could (the other three)
- **Status:** done

### FR-08 Price range
- **User story:** As a student on a budget, I want to set the least and most I'll spend to finish a recipe, so that I only see recipes I can afford.
- **System requirements:**
  - A two-handle slider shall set the range in €0.10 steps, from €0 to the most expensive cost to finish (rounded up to €0.50).
  - "From" and "To" fields shall accept typed amounts like 2.50 or 2,50.
  - An invalid amount shall show "Type an amount like 2.50" and keep the typed text.
  - Recipes outside the range shall be reachable through a "Show N recipes outside …" button.
- **MoSCoW:** Must
- **Acceptance:** typing 3,50 in "To" shows only recipes that cost ≤ €3.50 to finish, and the button lists the rest.
- **Status:** done, with example prices (decision D-15)

## Non-functional

| ID | Requirement | MoSCoW | Status |
|---|---|---|---|
| NFR-01 | All text has ≥ 4.5:1 contrast; control borders, icons and the focus ring ≥ 3:1; in light and dark | Must | Tokens from CLAUDE.md 11.3; no Lighthouse/axe run yet |
| NFR-02 | All touch targets are ≥ 44 × 44 px | Must | Checked on the Recipes screen at 390 px |
| NFR-03 | Works without an account | Must | Done (data stays in the browser) |
| NFR-04 | No horizontal scrolling at 320 px wide with text at 200% | Must | Checked on the Recipes screen |
| NFR-05 | Status is never shown by colour alone (shape + word + count) | Must | Done |
